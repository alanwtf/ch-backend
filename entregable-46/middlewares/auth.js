const isAuthenticated = (ctx, next) => {
    if (ctx.isAuthenticated()) return next();
    return ctx.redirect("/auth/login");
};

const isNotAuthenticated = (ctx, next) => {
    if (!ctx.isAuthenticated()) return next();
    ctx.redirect("/index");
};

module.exports = { isAuthenticated, isNotAuthenticated };
