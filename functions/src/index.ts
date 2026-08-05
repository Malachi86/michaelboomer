
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import next from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextApp = next({
  dev: isDev,
  conf: {distDir: ".next"},
});
const nextHandle = nextApp.getRequestHandler();

export const nextServer = onRequest({secrets: []}, async (req, res) => {
  logger.info("Request received", {path: req.path});
  await nextApp.prepare();
  return nextHandle(req, res);
});
