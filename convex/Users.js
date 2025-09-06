import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createNewUser = mutation({
  args: { email: v.string(), name: v.string() },
  handler: async (ctx, args) => {
    // Query existing user by email
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!existingUser) {
      const userId = await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
        credits: 10,
      });
      return { _id: userId, ...args, credits: 10 };
    }

    return existingUser;
  },
});
export const GetUser= query({
    args:{email:v.string()},
    handler:async(ctx,args)=>{
        const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .unique();
        return user;
    }})

export const UpdateUserPref = mutation({
  args: {
    uid: v.id("users"),
    weight: v.number(),
    height: v.number(), 
    gneder: v.string(),
    goal: v.string(),
    calories:v.optional(v.number()),
    proteins:v.optional(v.number()),
  },
  handler:async(ctx,args)=>{
    const result = await ctx.db.patch(args.uid,{
      height:args.height,
      weight:args.weight,
      goal:args.goal,
      gender:args.gneder,
      calories:args.calories,
      proteins:args.proteins
    } );
    return result;
  }
})