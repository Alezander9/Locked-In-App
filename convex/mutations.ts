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

export const updateStudyProfile = mutation({
  args: {
    studyProfile: v.object({
      dorm: v.string(),
      studyLocations: v.array(v.string()),
      alertnessPreference: v.number(),
      punctualityPreference: v.number(),
      learningPreferences: v.record(v.string(), v.number()),
      availableTimeSlots: v.array(
        v.object({
          day: v.string(),
          slots: v.array(v.number()),
        })
      ),
      classes: v.array(
        v.object({
          name: v.string(),
          weeklyHours: v.number(),
          deadlinePreference: v.number(),
          targetGrade: v.string(),
          expectedGrade: v.string(),
          noiseLevel: v.number(),
        })
      ),
      additionalInfo: v.string(),
      shareLocation: v.boolean(),
      syncContacts: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called updateStudyProfile without authentication");
    }

    // Get the user ID from their clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Update the user's study profile
    await ctx.db.patch(user._id, {
      studyProfile: args.studyProfile,
      completedOnboarding: true, // Also mark onboarding as complete
    });

    return user._id;
  },
});

export const deleteClass = mutation({
  args: {
    studyProfile: v.object({
      dorm: v.string(),
      studyLocations: v.array(v.string()),
      alertnessPreference: v.number(),
      punctualityPreference: v.number(),
      learningPreferences: v.record(v.string(), v.number()),
      availableTimeSlots: v.array(
        v.object({
          day: v.string(),
          slots: v.array(v.number()),
        })
      ),
      classes: v.array(
        v.object({
          name: v.string(),
          weeklyHours: v.number(),
          deadlinePreference: v.number(),
          targetGrade: v.string(),
          expectedGrade: v.string(),
          noiseLevel: v.number(),
        })
      ),
      additionalInfo: v.string(),
      shareLocation: v.boolean(),
      syncContacts: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called deleteClass without authentication");
    }

    // Get the user ID from their clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Update the user's study profile
    await ctx.db.patch(user._id, {
      studyProfile: args.studyProfile,
    });

    return user._id;
  },
});

export const generateMatches = mutation({
  args: {
    courseId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the current user
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) {
      throw new Error("User not found");
    }

    // Get all users who have completed onboarding
    const potentialMatches = await ctx.db
      .query("users")
      .filter((q) => 
        q.and(
          q.eq(q.field("completedOnboarding"), true),
          q.neq(q.field("_id"), currentUser._id)
        )
      )
      .collect();

    // Generate fake matches with random scores and reasons
    const matchReasons = [
      "Similar study schedule • Both morning people",
      "Matching learning styles • Similar work habits",
      "Compatible study locations • Similar goals",
      "Both detail-oriented • Complementary strengths",
      "Similar academic interests • Compatible schedules",
    ];

    const matches = potentialMatches.map(user => ({
      userId: currentUser._id,
      matchedUserId: user._id,
      matchScore: 85 + Math.floor(Math.random() * 15), // Random score between 85-100
      matchReason: matchReasons[Math.floor(Math.random() * matchReasons.length)],
      status: "pending",
      courseId: args.courseId,
      createdAt: Date.now() - Math.floor(Math.random() * 86400000), // Random time in last 24h
    }));

    // Insert all matches
    await Promise.all(
      matches.map(match => ctx.db.insert("matches", match))
    );

    return matches.length;
  },
});

export const deleteMatch = mutation({
  args: {
    matchId: v.id("matches"),
  },
  handler: async (ctx, args) => {
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

    // Delete the match
    await ctx.db.delete(args.matchId);
  },
});

export const saveBackgroundPicture = mutation({
  args: {
    storageId: v.id("_storage"),
    userID: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userID, {
      backgroundPictureStorageId: args.storageId,
    });
  },
});


