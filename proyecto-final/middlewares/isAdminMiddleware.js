const admin = true;

const isAdmin = (req, res, next) => {
    if (admin) next();
    else
        return res.json({
            error: -1,
            descripcion: `Ruta ${req.url} método ${req.method} no autorizada`,
        });
};

module.exports = isAdmin;
