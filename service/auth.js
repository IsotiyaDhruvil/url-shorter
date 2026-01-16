const jwt = require("jsonwebtoken");
const secretKey = "dhruvil@420";
function setUser(user) {
    return jwt.sign({
        id: user._id,
        email: user.email,
        role: user.role,
    }, secretKey);
} 

function getUser(token) {
    if(!token){
        return null;
    }
    return jwt.verify(token, secretKey);
}

module.exports = { setUser, getUser };