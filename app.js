const express = require("express");
const dotenv = require("dotenv");
const app = express();
const connectDB = require("./DB");
const userRoutes = require("./userRoutes");

dotenv.config();
connectDB();

app.use(express.json());

app.use('/api/user',userRoutes);

const PORT = process.env.PORT || 4000

const server = app.listen(PORT,console.log(`Server is running on port ${PORT}.`));