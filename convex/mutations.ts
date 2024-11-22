import { internalMutation, mutation } from "./_generated/server";
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

export const toggleEventResponse = mutation({
  args: {
    eventId: v.id("events"),
    userId: v.id("users"),
    response: v.union(v.literal("yes"), v.literal("no")),
  },
  handler: async (ctx, args) => {
    const { eventId, userId, response } = args;

    // Get current event
    const event = await ctx.db.get(eventId);
    if (!event) throw new Error("Event not found");

    // Create new lists removing user from both
    const newYesList = event.yesList.filter((id) => id !== userId);
    const newNoList = event.noList.filter((id) => id !== userId);

    // Add user to appropriate list if they're not already there
    // or if they're toggling the opposite response
    if (response === "yes") {
      if (!event.yesList.includes(userId)) {
        newYesList.push(userId);
      }
    } else if (response === "no") {
      if (!event.noList.includes(userId)) {
        newNoList.push(userId);
      }
    }

    // Update the event
    await ctx.db.patch(eventId, {
      yesList: newYesList,
      noList: newNoList,
    });
  },
});

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    completedOnboarding: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    // Create new user if they don't exist
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      completedOnboarding: args.completedOnboarding,
    });

    return userId;
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const saveProfilePicture = mutation({
  args: {
    storageId: v.id("_storage"),
    userID: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userID, {
      profilePictureStorageId: args.storageId,
      pictureCompressed: false,
    });
  },
});

export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    location: v.string(),
    date: v.number(),
    duration: v.number(),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the user ID from their clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Create the event with the current user in the yesList
    const eventId = await ctx.db.insert("events", {
      title: args.title,
      description: args.description,
      location: args.location,
      date: args.date,
      duration: args.duration,
      public: args.isPublic,
      yesList: [],
      noList: [],
    });

    return eventId;
  },
});
