import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const CreateRecipe=mutation({
    arg:{
        jsondat:v.any(),
        uid:v.id('users'),
        recipeName:v.string(),
        imageUrl:v.string()
    },
    handler:async(ctx,args)=>{
        const result=await ctx.db.insert('recipes',{
            jsondata:args.jsondata,
            userid:args.uid,
            recipeName:args.recipeName,
            imageUrl:args.imageUrl
        })
        return result;
    }
})
export const getById = query({
  args: { id: v.id("recipes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});