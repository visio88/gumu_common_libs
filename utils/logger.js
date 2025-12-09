import { LOG_LEVEL } from "../libs/const";
import { pino } from "pino";
import pretty from "pino-pretty";

const stream = pretty({
  colorize: true,
  translateTime: "SYS:standard",
  ignore: "pid,hostname",
});
const logger = pino(
  {
    level: LOG_LEVEL, // Set the initial log level (e.g., "info", "debug", "error")
  },
  stream,
);

export default logger;
