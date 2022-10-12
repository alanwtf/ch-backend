const Router = require("koa-router");
const passport = require("koa-passport");

const authRouter = new Router({ prefix: "/auth" });
const { isAuthenticated, isNotAuthenticated } = require("../middlewares/auth");

// authRouter.post(
//     "/login",
//     passport.authenticate("login", {
//         successRedirect: "/",
//         failureRedirect: "/auth/login",
//         failureFlash: true,
//     })
// );

authRouter.post("/login", async (ctx) => {
    await passport.authenticate("login", async (err, user, info) => {
        if (err) {
            ctx.body({ error: err });
        }
        if (!user) {
            ctx.flash("error", info.message);
            ctx.redirect("/auth/login");
        } else {
            ctx.login(user);
            ctx.redirect("/");
        }
    })(ctx);
});

authRouter.get("/login", isNotAuthenticated, async (ctx) => {
    await ctx.render("partials/login", { message: ctx.flash("error") });
});

authRouter.get("/register", isNotAuthenticated, async (ctx) => {
    await ctx.render("partials/register", { message: ctx.flash("error") });
});

authRouter.post("/register", async (ctx, next) => {
    await passport.authenticate("register", async (err, user, info) => {
        if (err) {
            await next(err);
        }
        if (info) {
            ctx.flash("error", info.message);
            ctx.redirect("/auth/register");
        }
        if (user) {
            ctx.login(user);
            ctx.redirect("/");
        }
    })(ctx, next);
});

authRouter.get("/logout", isAuthenticated, async (ctx) => {
    if (ctx.isAuthenticated()) {
        await ctx.render("partials/logout", { email: ctx.state.user.email });
        ctx.logout();
    } else {
        ctx.body = { success: false };
        ctx.throw(401);
    }
});

module.exports = authRouter;
