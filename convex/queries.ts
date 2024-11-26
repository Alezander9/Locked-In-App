import { query } from "./_generated/server";
import { v } from "convex/values";

export const getTasks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

export const searchCourses = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    const { searchTerm } = args;
    const cleanedTerm = searchTerm.trim().toUpperCase();

    if (!cleanedTerm) {
      return [];
    }

    return await ctx.db
      .query("courses")
      .withIndex("by_code", (q) =>
        // Narrow down the range as much as possible
        q.gte("code", cleanedTerm).lt("code", cleanedTerm + "\uffff")
      )
      .take(10);
  },
});

export const getUpcomingEvents = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 20, cursor } = args;
    const now = Date.now();

    return await ctx.db
      .query("events")
      .withIndex("by_date", (q) => q.gte("date", cursor ?? now))
      .order("asc")
      .take(limit);
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    if (!args.clerkId) {
      return null;
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    return user;
  },
});

export const getImageUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const getUserCourses = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get user's courses with their colors
    const userCourses = await ctx.db
      .query("userCourses")
      .withIndex("by_userID_courseID", (q) => q.eq("userId", user._id))
      .collect();

    // Get the actual course details and combine with colors
    const courses = await Promise.all(
      userCourses.map(async (uc) => {
        const course = await ctx.db.get(uc.courseId);
        return {
          ...course,
          color: uc.color,
        };
      })
    );

    return courses;
  },
});

export const getUserCoursesOrdered = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get user's courses with their settings
    const userCourses = await ctx.db
      .query("userCourses")
      .withIndex("by_userID_courseID", (q) => q.eq("userId", user._id))
      .collect();

    // Get the actual course details and combine with user settings
    const courses = await Promise.all(
      userCourses.map(async (uc) => {
        const course = await ctx.db.get(uc.courseId);
        return {
          ...course,
          color: uc.color,
          order: uc.order ?? 0, // Default to 0 if no order set
        };
      })
    );

    // Sort by order
    return courses.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  },
});

export const getUpcomingTasks = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 20, cursor } = args;
    const now = Date.now();
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get tasks with course color information
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_userID_dueDate", (q) =>
        q.eq("userId", user._id).gte("dueDate", cursor ?? now)
      )
      .order("asc")
      .take(limit);

    // Fetch course information for each task
    const tasksWithCourseInfo = await Promise.all(
      tasks.map(async (task) => {
        const userCourse = await ctx.db
          .query("userCourses")
          .withIndex("by_userID_courseID", (q) =>
            q.eq("userId", user._id).eq("courseId", task.courseId)
          )
          .first();

        const course = await ctx.db.get(task.courseId);

        return {
          ...task,
          courseCode: course?.code ?? "",
          courseColor: userCourse?.color ?? "#94a3b8",
        };
      })
    );

    return tasksWithCourseInfo;
  },
});
