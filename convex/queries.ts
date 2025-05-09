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

export const getStudyProfile = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    // If no userId provided, get the current user's profile
    if (!args.userId) {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        return null;
      }

      const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
        .first();

      if (!user) {
        return null;
      }

      return user.studyProfile;
    }

    // If userId is provided, get that specific user's profile
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return null;
    }

    return user.studyProfile;
  },
});

export const getUserMatches = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    // Get the current user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) {
      throw new Error("User not found");
    }
    // Get all matches for this user
    const matches = await ctx.db
      .query("matches")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
    // Fetch the matched user details
    const matchesWithDetails = await Promise.all(
      matches.map(async (match) => {
        const matchedUser = await ctx.db.get(match.matchedUserId);
        if (!matchedUser) return null;
        return {
          id: match._id,
          name: `${matchedUser.firstName} ${matchedUser.lastName}`,
          title: "Stanford Student",
          mutualConnections: Math.floor(Math.random() * 5), // Random number for demo
          timeAgo: formatTimeAgo(match.createdAt),
          hasCreatedStudyProfile: !!matchedUser.studyProfile,
          courseId: match.courseId,
        };
      })
    );
    return matchesWithDetails.filter(
      (match): match is NonNullable<typeof match> => match !== null
    );
  },
});

// Helper function for getUserMatches
function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

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

    // TEMPORARY: Showing all tasks for demo video purposes, regardless of due date
    // Original code:
    // const tasks = await ctx.db
    //   .query("tasks")
    //   .withIndex("by_userID_dueDate", (q) =>
    //     q.eq("userId", user._id).gte("dueDate", cursor ?? now)
    //   )
    //   .order("asc")
    //   .take(limit);

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_userID_dueDate", (q) => q.eq("userId", user._id))
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

export const getTask = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.taskId);
  },
});
