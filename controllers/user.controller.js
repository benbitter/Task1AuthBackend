import { User} from "../models/userModel.js";
import {oauth2Client} from "../utils/googleClient.js"
import axios from "axios"


const registerUserThroughUsername = async (req, res) => {
    try {
        const { userName, password , confirmPassword } = req.body || req.headers;

        if(!userName || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({ userName });

        if (existingUser) {
            return res.status(409).json({ message: "User name already exists" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const user = new User({ userName, password });
        
        await user.save();



        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
};

const loginUserThroughUsername = async (req, res) => {
    try {
        const { userName, password } = req.body;

        console.log("Login attempt:", userName, password);

        if(!userName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ userName });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await user.isPasswordCorrect(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = await user.generateToken();

        if(!token) {
            return res.status(500).json({ message: "Error generating token" });
        }
        user.token = token;
        await user.save({validateBeforeSave:false});

        const option = {
            httpOnly: true,
            secure:true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        };


        res.cookie("token", token, option);
        return res.status(200).json({ message: "Login successful", user , token});
    } catch (error) {
        res.status(500).json({ message: "Error logging in user", error });
    }
};

const logoutUser = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.token = null;
        await user.save({ validateBeforeSave: false });

        const option = {
            httpOnly: true,
            secure:true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }

        res.clearCookie("token", option);
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: "Error logging out user", error });
    }
};

const googleLogin = async(req,res)=>{

    try {

        const code = req.query.code;
        if(!code)
        {
            return res.status(400).json({ message: "Google login code is required" });
        }
        // console.log(code);
        const googleRes = await oauth2Client.getToken(code);
        // console.log(googleRes);
        await oauth2Client.setCredentials(googleRes.tokens);
        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );
        console.log(userRes);
        const { email, name, picture } = userRes.data;
        let user = await User.findOne({ gmail : email });

        if (!user) {
            user = new User({ gmail : email, pic: picture });
            await user.save();
        }
        const token = await user.generateToken();

        if(!token) {
            return res.status(500).json({ message: "Error generating token" });
        }
        user.token = token;
        await user.save({validateBeforeSave:false});

        const option = {
            http:true,
            sameSite: "none",
        };


        res.cookie("token", token, option);
        // return res.status(200).json({ message: "Login successful", user , token});


        return res.status(200).json({ message: "Google login successful", code ,user });

    }catch (error) {
        console.log("google login failed with error :", error);
        return res.status(500).json({ message: "Google login failed", error });
    }

}

const fetchUserData = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User data fetched successfully", user });
    } catch (error) {
        console.log("Error fetching user data:", error);
        return res.status(500).json({ message: "Error fetching user data", error });
    }
};

const addBookmark = async (req, res) => {
    try {
        const user = req.user;
        const { questionId } = req.query;

        if (!user || !questionId) {
            return res.status(400).json({ message: "User and question ID are required" });
        }

        user.bookmarks.push(questionId);
        await user.save();

        return res.status(200).json({ message: "Bookmark added successfully", user });
    } catch (error) {
        console.log("Error adding bookmark:", error);
        return res.status(500).json({ message: "Error adding bookmark", error });
    }
};

const markDone = async(req,res)=>{
    try {
        const user = req.user;
        const { questionId } = req.query;

        if (!user || !questionId) {
            return res.status(400).json({ message: "User and question ID are required" });
        }

        user.done.push(questionId);
        await user.save();

        return res.status(200).json({ message: "Bookmark added successfully", user });
    } catch (error) {
        console.log("Error adding bookmark:", error);
        return res.status(500).json({ message: "Error adding bookmark", error });
    }
}

export { registerUserThroughUsername, loginUserThroughUsername ,logoutUser , googleLogin, fetchUserData, addBookmark ,markDone};
