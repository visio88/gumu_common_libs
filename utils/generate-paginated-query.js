import { Types } from "mongoose";
/**
 * Get Paginated Result [Listing Result]
 * @param {*} query
 * @param { import("mongoose").Model } Model
 * @param {*} filterQueries
 * @param {*} allowedFields
 * @param {*} sortFields
 * @param {*} projection
 * @param {import 'mongoose'.ClientSession | null} session
 * @returns
 */
export const getPaginationQuery = async (
  query,
  Model,
  filterQueries,
  allowedFields,
  sortFields,
  projection,
  session = null,
) => {
  try {
    const q = {
      ...(filterQueries || {}),
    };
    query = query || {};
    let limit = +query.pageSize || 20;
    if (limit < 1) {
      limit = 16;
    }
    if (!query.pageSize && limit > 16) {
      limit = 48;
    }

    // What field is our cursor?
    let cursorField = "_id";
    if (query.field && allowedFields.includes(query.field)) {
      cursorField = query.field || "_id";
    }

    const order = {
      query: "descending",
      key: "",
      key_cursor: "",
      sort_order: -1,
    };
    if (query.order === "ascending") {
      order.query = "ascending";
    }
    /**
     * @type {string} cursor
     */
    let cursor;
    if (query.cursor) {
      cursor = query.cursor;
      if (order.query === "descending") {
        order.key_cursor = "$lte";
        order.key = "$lt";
        order.sort_order = -1;
      } else {
        order.key_cursor = "$gte";
        order.key = "$gt";
        order.sort_order = 1;
      }
    }
    const sort = {
      ...sortFields,
    };
    let filters = {};
    let prevCursorFilters = {};
    let prevSortOrder = sort;
    if (cursor) {
      let [cursorId, cursorParam] = cursor.split("_");
      cursorId = new Types.ObjectId(cursorId);
      if (cursorParam) {
        // defined cursor field parameter
        if (cursorField === "createdAt") {
          cursorParam = new Date(cursorParam).toISOString();
        }
        filters = {
          ...q,
          [cursorField]: { [order.key_cursor]: new Date(cursorParam) },
          _id: { [order.key]: cursorId },
        };

        sort[cursorField] = order.sort_order;
      } else {
        filters._id = { [order.key]: cursorId };
      }
      sort._id = order.sort_order;
      prevCursorFilters = {
        ...filters,
        [cursorField]: { $gte: new Date(cursorParam) },
        _id: { $gte: cursorId },
      };
      prevSortOrder._id = order.sort_order === -1 ? 1 : -1;
      prevSortOrder[cursorField] = order.sort_order === -1 ? 1 : -1;
    } else {
      filters = q;
    }

    //aggregation query for pagination
    const facetStage = {
      $facet: {
        metadata: [{ $match: filters }, { $count: "totalCount" }],
        nextCursor: [
          { $match: filters },
          { $sort: sort },
          { $skip: limit },
          {
            $group: {
              _id: null,
              nextCDoc: { $first: "$$ROOT" },
            },
          },
        ],
        data: [
          { $match: filters },
          { $sort: sort },
          { $limit: limit },
          { $project: { ...projection } },
        ],
      },
    };
    //apply previous page's () first
    if (cursor) {
      facetStage["$facet"].prevCursor = [
        { $match: prevCursorFilters },
        { $sort: sort },
        { $skip: limit },
        {
          $limit: limit,
        },
        {
          $sort: prevSortOrder,
        },
        {
          $limit: 1,
        },
      ];
    }
    /** @type {import("mongoose").Query} */
    const mongooseQuery = Model.aggregate([facetStage]);
    if (session) {
      mongooseQuery.session(session);
    }
    const data = await mongooseQuery.exec();
    const resultData = data?.[0]?.data;
    const totalCount = data?.[0]?.metadata?.[0]?.totalCount || [];
    const nextCursor = data?.[0]?.nextCursor;
    const prevCursor = data?.[0]?.prevCursor;

    const response = {
      data: resultData,
      currentPageTotalElements: resultData?.length || 0,
      order: order.query,
      totalCount,
      cursors: {
        nextCursor: nextCursor?.[0]?.nextCDoc
          ? {
              _id: nextCursor?.[0]?.nextCDoc?._id,
              createdAt: nextCursor?.[0]?.nextCDoc?.createdAt,
              cursor: `${nextCursor?.[0]?.nextCDoc?._id}_${
                nextCursor?.[0]?.nextCDoc?.createdAt?.toUTCString &&
                nextCursor?.[0]?.nextCDoc?.createdAt?.toISOString()
              }`,
            }
          : {},
        prevCursor: prevCursor?.[0]
          ? {
              _id: prevCursor?.[0]?._id,
              createdAt: prevCursor?.[0]?.createdAt,
              cursor: `${prevCursor?.[0]?._id}_${
                prevCursor?.[0]?.createdAt?.toUTCString &&
                prevCursor?.[0]?.createdAt?.toISOString()
              }`,
            }
          : {},
      },
    };
    return response;
  } catch (error) {
    console.log(error, "error on pagination");
    throw error;
  }
};
