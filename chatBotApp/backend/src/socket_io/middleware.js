const User = require("../models/userModel");
const jwt = require("jsonwebtoken");


module.exports = (io) => {
    
io.use(async (socket, next) => {
    try {

        // Get token sent from frontend
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error("Token Missing"));
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user in database
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            return next(new Error("User not found"));
        }

        // Save authenticated user on socket
        socket.user = user;

        // Allow connection
        next();

    } catch (err) {

        next(new Error("Invalid Token"));

    }
});

}