const express = require("express");
const router = express.Router();

// Require our controllers.
const record_controller = require("../controllers/recordController");
const artist_controller = require("../controllers/artistController");
const genre_controller = require("../controllers/genreController");
const record_instance_controller = require("../controllers/copyController");

/// BOOK ROUTES ///

// GET catalog home page.
router.get("/", record_controller.index);

// GET request for creating a Record. NOTE This must come before routes that display Record (uses id).
router.get("/record/create", record_controller.record_create_get);

// POST request for creating Record.
router.post("/record/create", record_controller.record_create_post);

// GET request to delete Record.
router.get("/record/:id/delete", record_controller.record_delete_get);

// POST request to delete Record.
router.post("/record/:id/delete", record_controller.record_delete_post);

// GET request to update Record.
router.get("/record/:id/update", record_controller.record_update_get);

// POST request to update Record.
router.post("/record/:id/update", record_controller.record_update_post);

// GET request for one Record.
router.get("/record/:id", record_controller.record_detail);

// GET request for list of all Record.
router.get("/records", record_controller.record_list);

/// AUTHOR ROUTES ///

// GET request for creating Artist. NOTE This must come before route for id (i.e. display artist).
router.get("/artist/create", artist_controller.artist_create_get);

// POST request for creating Artist.
router.post("/artist/create", artist_controller.artist_create_post);

// GET request to delete Artist.
router.get("/artist/:id/delete", artist_controller.artist_delete_get);

// POST request to delete Artist
router.post("/artist/:id/delete", artist_controller.artist_delete_post);

// GET request to update Artist.
router.get("/artist/:id/update", artist_controller.artist_update_get);

// POST request to update Artist.
router.post("/artist/:id/update", artist_controller.artist_update_post);

// GET request for one Artist.
router.get("/artist/:id", artist_controller.artist_detail);

// GET request for list of all Artists.
router.get("/artists", artist_controller.artist_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get("/genre/create", genre_controller.genre_create_get);

// POST request for creating Genre.
router.post("/genre/create", genre_controller.genre_create_post);

// GET request to delete Genre.
router.get("/genre/:id/delete", genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post("/genre/:id/delete", genre_controller.genre_delete_post);

// GET request to update Genre.
router.get("/genre/:id/update", genre_controller.genre_update_get);

// POST request to update Genre.
router.post("/genre/:id/update", genre_controller.genre_update_post);

// GET request for one Genre.
router.get("/genre/:id", genre_controller.genre_detail);

// GET request for list of all Genre.
router.get("/genres", genre_controller.genre_list);

/// BOOKINSTANCE ROUTES ///

// GET request for creating a Copy. NOTE This must come before route that displays Copy (uses id).
router.get(
  "/copy/create",
  record_instance_controller.copy_create_get
);

// POST request for creating Copy.
router.post(
  "/copy/create",
  record_instance_controller.copy_create_post
);

// GET request to delete Copy.
router.get(
  "/copy/:id/delete",
  record_instance_controller.copy_delete_get
);

// POST request to delete Copy.
router.post(
  "/copy/:id/delete",
  record_instance_controller.copy_delete_post
);

// GET request to update Copy.
router.get(
  "/copy/:id/update",
  record_instance_controller.copy_update_get
);

// POST request to update Copy.
router.post(
  "/copy/:id/update",
  record_instance_controller.copy_update_post
);

// GET request for one Copy.
router.get("/copy/:id", record_instance_controller.copy_detail);

// GET request for list of all Copy.
router.get("/Copies", record_instance_controller.copy_list);

module.exports = router;
