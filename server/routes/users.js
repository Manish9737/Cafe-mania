var express = require('express');
var router = express.Router();  
const { registerUser,
    loginUser,
    getUser,
    allUsers,
    ForgotPassword,
    VerifyOtp,
    resetPassword,
    contactUs,
    updateUser,
    deleteUser, 
    profileData
} = require('../controllers/userController');
const auth = require('../middlewares/auth');
const adminAuth = require('../middlewares/adminAuth');
const upload = require('../utils/multerConfig');


router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", ForgotPassword);
router.post("/verifyOtp", VerifyOtp);
router.post("/reset-password", resetPassword);
router.post("/contact", contactUs);

router.get("/profileData", auth, profileData);
router.get("/", adminAuth, allUsers);
router.get("/:id", auth, getUser);

router.patch("/:id", upload('images').single('image'), updateUser);
router.delete("/:id", deleteUser);


module.exports = router;