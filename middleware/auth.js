const jwt = require('jsonwebtoken');
const { ApiError } = require('../Errorhandler/ApiError');
const User = require('../models/user.model');

// Middleware to verify JWT
const verifyjwt = async (req, res, next) => {
    try {
        // Extract token from cookies or headers
        const token = req.cookies?.AccessToken || req.headers.authorization?.replace('Bearer ', '');

        // Check if token exists
        if (!token) {
            throw new ApiError(404, "No Access Token Found");
        }
        console.log(token)

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        

        // Find the user
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(404, "No Such User Found");
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (e) {
        // Handle errors
        next(new ApiError(404, e?.message || "Invalid access token"));
    }
};

module.exports = { verifyjwt };
