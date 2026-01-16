const {getUser} = require("../service/auth.js");

function checkauthorization(req, res, next) {
    const authorizationvalue =  req.cookies?.token;
    req.user = null;

    if(!authorizationvalue){
        return next();
    };
    const token =authorizationvalue;
    const user = getUser(token);

    req.user = user;
    next();
};   
function restrictTo(role = []) {
    return async function (req, res, next) {
        const authorizationvalue = req.cookies?.token;
        if (!req.user) {
            return res.redirect("/login");
        }
        if (!role.includes(req.user.role)) {
            return res.end("Unauthorized Access");
        }
         const token =authorizationvalue;
    const user = getUser(token);

    req.user = user;
        next();
    };
};

module.exports = {checkauthorization,restrictTo };