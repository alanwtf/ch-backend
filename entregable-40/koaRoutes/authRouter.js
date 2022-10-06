const Router = require("koa-router");
const passport = require("passport");

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

authRouter.post("/login", async (ctx, next) => {
    await passport.authenticate("login", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            ctx.flash = {
                type: "error",
                message: info.message,
            };
            return ctx.redirect("/auth/login");
        }
        ctx.login(user, () => {
            if (err) {
                return next(err);
            }

            return ctx.redirect("/");
        });
    })(ctx, next);
});

authRouter.get("/login", isNotAuthenticated, async (ctx) => {
    await ctx.render("partials/login", { message: ctx.flash.message });
});

authRouter.get("/register", isNotAuthenticated, (ctx) => {
    return ctx.render("partials/register", { message: ctx.flash.message });
});

authRouter.post("/register", async (ctx, next) => {
    await passport.authenticate("register", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            ctx.flash = {
                type: "error",
                message: info.message,
            };
            return ctx.redirect("/auth/login");
        }
        ctx.login(user, () => {
            if (err) {
                return next(err);
            }

            return ctx.redirect("/auth/register");
        });
    })(ctx, next);
});

authRouter.get("/logout", isAuthenticated, (req, res, next) => {
    const email = req.user.email;
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        return res.render("partials/logout", { email });
    });
});

module.exports = authRouter;
