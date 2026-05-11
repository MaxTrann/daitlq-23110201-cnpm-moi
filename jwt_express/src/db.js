//db.js
const users = [
    {
        id: 1,
        username: "admin",
        password: "$2b$10$vV6w3oyEHfe87z8Np8VP7.r1iRXyMq9w.XJ9bJNk4z0Mze/doib.y" // password: 123456
    }
];

let refreshTokens = [];

module.exports = {
    users,
    refreshTokens
}