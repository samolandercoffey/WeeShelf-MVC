const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const booksController = require("../controllers/book");
const { ensureAuth } = require("../middleware/auth"); 

//Post Routes
//Since linked from server js treat each path as:
//post/:id, post/createPost, post/likePost/:id, post/deletePost/:id
router.get("/:id", ensureAuth, booksController.getBook); 


//Enables user to create post w/ cloudinary for media uploads
router.post("/createBook", upload.single("file"), booksController.createBook);

router.post("/favoriteBook/:id", booksController.favoriteBook); 

 
//Enables user to like post. In controller, uses POST model to update likes by 1
router.put("/likeBook/:id", booksController.likeBook);

//Enables user to delete post. In controller, uses POST model to delete post from MongoDB collection
router.delete("/deleteBook/:id", booksController.deleteBook);

module.exports = router;
