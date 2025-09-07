import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const CreateMealPlan = mutation({
  args: {
    recipeId: v.id("recipes"),
    date: v.string(),
    mealType: v.string(),
    uid: v.id("users"),
  },
  handler: async (ctx, args) => {
    const recipe = await ctx.db.get(args.recipeId);

    const result = await ctx.db.insert("mealPlan", {
      recipeId: args.recipeId,
      date: args.date,
      mealType: args.mealType,
      uid: args.uid,
      status: false, 
      calories: recipe?.jsonData?.calories || 0, 
    });
    return result;
  },
});

export const getTodaysMealPlan = query({
  args: { uid: v.id("users"), date: v.string() },
  handler: async (ctx, args) => {
    const mealPlans = await ctx.db
      .query("mealPlan")
      .filter((q) => q.eq(q.field("uid"), args.uid))   // ✅ one filter
      .filter((q) => q.eq(q.field("date"), args.date)) // ✅ another filter
      // .filter((q)=>q.eq(q.field('status'),true))
      .collect();

    const result = await Promise.all(
      mealPlans.map(async (plan) => {
        const recipe = await ctx.db.get(plan.recipeId);
        return {
          ...plan,
          recipe,
        };
      })
    );

    return result;
  },
});
export const updateStatus = mutation({
  args: {
    id: v.id("mealPlan"),
    status: v.boolean(),
    calories: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const update = {
      status: args.status,
    };

    if (args.calories !== undefined) {
      update.calories = args.calories; 
    }

    return await ctx.db.patch(args.id, update);
  },
});
export const GetTotalCaloriesConsumed = query({
  args: {
    date: v.string(),
    uid: v.id('users')
  },
  handler: async (ctx, args) => {
    
    const mealPlanResult = await ctx.db.query('mealPlan')
      .filter(q => q.eq(q.field('uid'), args.uid))
      .filter(q => q.eq(q.field('date'), args.date))
      .filter(q=>q.field('status'),true)
      .collect();


    const totalCalories = mealPlanResult?.reduce((sum, meal) => {
      return sum + (meal.calories ?? 0);
    }, 0);

    return totalCalories;
  }
});
export const addMeal = mutation({
  args: {
    recipeId: v.id("recipes"),
    uid: v.id("users"),
    date: v.string(),          // ISO date (or YYYY-MM-DD)
    mealType: v.string(),      // "Breakfast" | "Lunch" | "Dinner" | "Snack"
    status: v.optional(v.boolean()),
    calories: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // (Optional) validate recipe exists
    const recipe = await ctx.db.get(args.recipeId);
    if (!recipe) throw new Error("Recipe not found");

    return await ctx.db.insert("mealPlan", {
      recipeId: args.recipeId,
      uid: args.uid,
      date: args.date,
      mealType: args.mealType,
      status: args.status ?? false,
      calories: args.calories ?? null,
      // Remove createdAt since it's not in your schema
      // Convex automatically adds _creationTime anyway
    });
  },
});