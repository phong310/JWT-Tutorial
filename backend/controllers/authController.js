const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

let refeshTokens = [];

const authController = {
    // REGISTER
    registerUser: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            // Create new user
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            });

            // Save to DB
            const user = await newUser.save();
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json(error)
        }
    },

    // GENERATE ACCESS TOKEN
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin
        },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "30s" }
        );
    },

    // GENERATE REFRESH TOKEN
    generateRefeshToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin
        },
            process.env.JWT_REFESH_KEY,
            { expiresIn: "365d" }
        );
    },

    // LOGIN
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                return res.status(404).json("Wrong username !");
            }

            // so sánh password
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            )
            if (!validPassword) {
                return res.status(404).json("Wrong password !")
            }

            // success
            if (user && validPassword) {
                const accessToken = authController.generateAccessToken(user)
                const refestToken = authController.generateRefeshToken(user)
                refeshTokens.push(refestToken);
                // save refestToken to cookie
                res.cookie("refeshToken", refestToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                })

                const { password, ...others } = user._doc;
                res.status(200).json({ ...others, accessToken });
            }
        }
        catch (err) {
            res.status(500).json(err);
        }
    },

    // REFRESH TOKEN
    requestRefreshToken: async (req, res) => {
        // Take cookie from user
        const refreshToken = req.cookies.refeshToken;
        if (!refreshToken) return res.status(401).json("You're not authenticated !");

        if (!refeshTokens.includes(refreshToken)) {
            return res.status(403).json("Refresh token is not valid")
        }

        jwt.verify(refreshToken, process.env.JWT_REFESH_KEY, (err, user) => {
            if (err) {
                console.log(err);
            }
            // loop để lọc token cũ ra
            refeshTokens = refeshTokens.filter((token) => token !== refreshToken);

            //create new accessToken, refreshToken
            const newAccessToke = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefeshToken(user);

            refeshTokens.push(newRefreshToken);

            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            res.status(200).json({ accessToken: newAccessToke });
        })
    },

    // LOGOUT
    userLogout: async (req, res) => {
        res.clearCookie("refeshToken");
        refeshTokens = refeshTokens.filter((token) => token !== req.cookies.refeshToken);
        res.status(200).json("Logged out !")
    }
}

module.exports = authController;