const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const booksController = require("../controllers/book");
const { ensureAuth } = require("../middleware/auth");

//Main Routes 
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, booksController.getProfile);
router.get("/favorites", ensureAuth, booksController.getFavorites);
router.get("/feed", ensureAuth, booksController.getFeed);

//Routes for user login/signup
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;
