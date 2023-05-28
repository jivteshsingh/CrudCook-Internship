const express = require("express");
const { registeruser, authoriseduser, refreshToken, validateToken } = require("./userControllers");

const router = express.Router();

router.route('/').post(registeruser);
router.post('/login',authoriseduser);
router.post('/token/validate',validateToken);
router.post('/token/refresh',refreshToken);



module.exports = router;