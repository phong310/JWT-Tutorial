const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")

dotenv.config()
const app = express();

// connect MongoDB
mongoose.connect(process.env.MONGODB_URL, () => {
    console.log("CONNECT TO MONGO DB")
})

app.use(cors());
app.use(cookieParser());
app.use(express.json());


// Routes
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);


app.listen(8000, () => {
    console.log("Server is running !")
});

// JSON WEB TOKEN