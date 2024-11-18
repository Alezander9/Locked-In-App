import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

interface CourseInput {
  code: string;
  department: string;
  title: string;
  description: string;
  terms: string[];
  units: string;
}

interface CoursesInfo {
  [key: string]: CourseInput;
}

export const importCourses = internalMutation({
  args: {
    coursesInfo: v.any(),
  },
  handler: async (ctx, { coursesInfo }) => {
    const batchSize = 50;
    const courses = Object.entries(coursesInfo as CoursesInfo).map(
      ([_, course]) => ({
        code: course.code,
        department: course.department,
        title: course.title,
        terms: course.terms,
        units: course.units,
      })
    );

    // Insert in batches
    for (let i = 0; i < courses.length; i += batchSize) {
      const batch = courses.slice(i, i + batchSize);
      await Promise.all(
        batch.map((course) => ctx.db.insert("courses", course))
      );
    }

    return courses.length;
  },
});
