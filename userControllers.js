const asyncHandler = require("express-async-handler");
const User = require("./Models/userModel");
const { generateAccessToken, generateRefreshToken } = require("./generateTokens")
const jwt = require("jsonwebtoken");

const registeruser = asyncHandler(async (req,res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
      res.status(400);
      throw new Error("Please enter all the fields.")
    }

    const userExists = await User.findOne({ email });
    if(userExists) {
      res.status(400);
      throw new Error("User Already Exists.");
    }

    const user = await User.create({ name, email, password });
    if(user){
      res.status(201).json({ accessToken: generateAccessToken(user.email), refreshToken: generateRefreshToken(user.email), });
    }else{
      res.status(400);
      throw new Error("Failed To Create The User.");
    }
});


const authoriseduser = asyncHandler(async (req,res) => {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if(user && (await user.matchPassword(password))) {
        res.json({ accessToken: generateAccessToken(user.email), refreshToken: generateRefreshToken(user.email), });
      }else{
        res.status(401);
        throw new Error("Invalid Email or Password.");
      }
});

const refreshToken = asyncHandler(async(req,res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
      res.status(401);
      throw new Error("No refreshToken")
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err,user) => {
      if(err){
          return res.sendStatus(403);
      }
      const accessToken = generateAccessToken({ email: user.email });
      res.json({ accessToken });
    })
});

const validateToken = asyncHandler(async(req,res) => {
  const accessToken = req.body.accessToken;

  if (!accessToken) {
      res.status(401);
      throw new Error("No accessToken")
    }

    jwt.verify(accessToken, process.env.JWT_SECRET, (err) => {
      if(err){
          return res.sendStatus(403);
      }
      res.sendStatus(200);
    })
});



module.exports = { registeruser, authoriseduser, refreshToken, validateToken };