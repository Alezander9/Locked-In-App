import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const uploadCourseData = httpAction(async (ctx, request) => {
  const requestData = await request.json();
  const dataType = requestData.type;
  const data = requestData.data;

  if (dataType === "courses") {
    await ctx.runMutation(internal.mutations.importCourses, {
      coursesInfo: data,
    });
    return new Response(
      JSON.stringify({
        message: "Course data uploaded successfully.",
        data: data,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } else {
    return new Response(
      JSON.stringify({
        message: "Unknown data type.",
        data: data,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
