const cloudinary = require("../middleware/cloudinary");
const Book = require("../models/Book");
const Favorite = require("../models/Favorite");

module.exports = {
  getProfile: async (req, res) => { 
    console.log(req.user)
    try {
      //Since we have a session each request (req) contains the logged-in users info: req.user
      //console.log(req.user) to see everything
      //Grabbing just the posts of the logged-in user
      const books = await Book.find({ user: req.user.id });
      //Sending post data from mongodb and user data to ejs template
      res.render("profile.ejs", { books: books, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const books = await Book.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { books: books });
    } catch (err) {
      console.log(err);
    }
  },
  getFavorites: async (req, res) => { 
    console.log(req.user)
    try {
      //Since we have a session each request (req) contains the logged-in users info: req.user
      //console.log(req.user) to see everything
      //Grabbing just the posts of the logged-in user
      const books = await Favorite.find({ user: req.user.id }).populate('book');

      console.log(books)

      //Sending post data from mongodb and user data to ejs template
      res.render("favorites.ejs", { books: books, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getBook: async (req, res) => {
    try {
      //id parameter comes from the post routes
      //router.get("/:id", ensureAuth, postsController.getPost);
      //http://localhost:2121/post/631a7f59a3e56acfc7da286f
      //id === 631a7f59a3e56acfc7da286f
      const book = await Book.findById(req.params.id);
      res.render("book.ejs", { book: book, user: req.user});
    } catch (err) {
      console.log(err);
    }
  },
  createBook: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      //media is stored on cloudainary - the above request responds with url to media and the media id that you will need when deleting content 
      await Book.create({
        title: req.body.title,
        author: req.body.author,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        genre: req.body.genre,
        summary: req.body.summary,
        likes: 0,
        user: req.user.id,
      });
      console.log("Book has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  favoriteBook: async (req, res) => {
    try {
      //media is stored on cloudainary - the above request responds with url to media and the media id that you will need when deleting content 
      await Favorite.create({
        user: req.user.id,
        book: req.params.id,
      });
      console.log("Favorite has been added!");
      res.redirect(`/book/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  likeBook: async (req, res) => {
    try {
      await Book.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/book/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteBook: async (req, res) => {
    try {
      // Find post by id
      let book = await Book.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(book.cloudinaryId);
      // Delete post from db
      await Book.remove({ _id: req.params.id });
      console.log("Deleted Book");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
