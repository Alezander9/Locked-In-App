import { httpRouter } from "convex/server";
import { uploadCourseData } from "./httpActions";

const http = httpRouter();

http.route({
  path: "/uploadCourseData",
  method: "POST",
  handler: uploadCourseData,
});

export default http;
