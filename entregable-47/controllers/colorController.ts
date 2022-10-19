import { Context } from "../deps.ts";
import * as db from "../db/colors.ts";

export const getColors = async (ctx: Context) => {
    const colors = await db.getColors();
    ctx.response.body = colors;
};

export const postColor = async (ctx: Context) => {
    const { color } = await ctx.request.body().value;
    db.postColor(color);
    ctx.response.body = color;
};
