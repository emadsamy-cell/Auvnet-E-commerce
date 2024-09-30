// function to check if the user is authorized or not ( role based ) !  
const rbac = require("../rbac/rbac");
const tokenManager = require("../helpers/tokenManager");

module.exports = (endpoints) => {
    return async (req, res, next) => {
        try {
            let barerToken = req.headers.authorization;
            let token = barerToken.split(" ")[1];
            let decoded = tokenManager.compareToken(token, process.env.JWT_SECRET_KEY);

            const isAllowed = await rbac.can(decoded.role, endpoints);
            if (!isAllowed) {
                return res.status(403).json({
                    success: false,
                    status: 403,
                    message: "Not allowed to perform this action !",
                });
            }
            req.user = decoded;
            next();
        }
        catch (err) {
            let errMessage = "Invalid Authorization Token !"
            if(err.message.includes('expired')){
                errMessage = err.message
            }
            return res.status(401).json({
                success: false,
                status: 401,
                message: errMessage,
            });
        };
    }
};