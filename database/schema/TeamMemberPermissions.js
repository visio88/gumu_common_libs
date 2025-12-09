import mongoose from "mongoose";

import { enums } from "../../utils/enum";

const ClientTabStatuses = enums.clientTabPermissionStatus.map((data) => data?.value);
// const GymTabStatuses = enums.gymTabPermissionStatus.map((data) => data?.value)
// const BillingTabStatuses = enums.billingTabPermissionStatus.map((data) => data?.value)
// const ECommerceTabStatuses = enums.eCommerceTabPermissionStatus.map((data) => data?.value)

const ClientTabPermissionSchema = new mongoose.Schema({
  tabStatus: {
    type: String,
    enum: ClientTabStatuses
  },
  allowLeadEditAndConversion: {
    type: Boolean,
  },
  allowEditSystemConfiguration: {
    type: Boolean,
  },
  allowMakePayments: {
    type: Boolean,
  },
  allowAttendanceMark: {
    type: Boolean,
  },
});
const GymTabPermissionSchema = new mongoose.Schema({
  tabStatus: {
    type: String, //todo  GymTabStatuses
  },
  allowLeadEditAndConversion: {
    type: Boolean,
  },
  allowEditSystemConfiguration: {
    type: Boolean,
  },
  allowMakePayments: {
    type: Boolean,
  },
  allowAttendanceMark: {
    type: Boolean,
  },
});
const BillingTabPermissionSchema = new mongoose.Schema({
  tabStatus: {
    type: String, //todo billingTabPermissionStatus
  },
  allowLeadEditAndConversion: {
    type: Boolean,
  },
  allowEditSystemConfiguration: {
    type: Boolean,
  },
  allowMakePayments: {
    type: Boolean,
  },
  allowAttendanceMark: {
    type: Boolean,
  },
});
const ECommerceTabPermissionSchema = new mongoose.Schema({
  tabStatus: {
    type: String, //todo eCommerceTabPermissionStatus
  },
  allowLeadEditAndConversion: {
    type: Boolean,
  },
  allowEditSystemConfiguration: {
    type: Boolean,
  },
  allowMakePayments: {
    type: Boolean,
  },
  allowAttendanceMark: {
    type: Boolean,
  },
});

const TeamMemberPermissionSchema = new mongoose.Schema({
  assignedLocations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Center" }],
  clientTabPermissions: { type: ClientTabPermissionSchema },
  gymTabPermissions: { type: GymTabPermissionSchema },
  billingTabPermissions: { type: BillingTabPermissionSchema },
  eCommerceTabPermissions: { type: ECommerceTabPermissionSchema },
});

export default TeamMemberPermissionSchema;
