import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken"

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log("Token received:", token);
    
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
    
         const decodedToken = jwt.verify(token,"secret");

         if(!decodedToken) {
             return res.status(403).json({ message: "Invalid token" });
         }
         
        const user = await User.findOne({ _id: decodedToken._id });
        if(!user) {
             return res.status(404).json({ message: "User not found : JWT verification failed" })
         };

        req.user = user;
        next();

    } catch (error) {
        return res.status(500).json({ message: "Error verifying token", error });
    }
};

export {verifyJWT}
