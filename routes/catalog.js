const express = require("express");
const router = express.Router();

// Require our controllers.
const release_controller = require("../controllers/releaseController");
const artist_controller = require("../controllers/artistController");
const genre_controller = require("../controllers/genreController");
const copy_controller = require("../controllers/copyController");

/// BOOK ROUTES ///

// GET catalog home page.
router.get("/", release_controller.index, artist_controller.artist_list);

// GET request for creating a Release. NOTE This must come before routes that display Release (uses id).
router.get("/release/create", release_controller.release_create_get);

// POST request for creating Release.
router.post("/release/create", release_controller.release_create_post);

// GET request to delete Release.
router.get("/release/:id/delete", release_controller.release_delete_get);

// POST request to delete Release.
router.post("/release/:id/delete", release_controller.release_delete_post);

// GET request to update Release.
router.get("/release/:id/update", release_controller.release_update_get);

// POST request to update Release.
router.post("/release/:id/update", release_controller.release_update_post);

// GET request for one Release.
router.get("/release/:id", release_controller.release_detail);

// GET request for list of all Release.
router.get("/releases", release_controller.release_list);

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
  copy_controller.copy_create_get
);

// POST request for creating Copy.
router.post(
  "/copy/create",
  copy_controller.copy_create_post
);

// GET request to delete Copy.
router.get(
  "/copy/:id/delete",
  copy_controller.copy_delete_get
);

// POST request to delete Copy.
router.post(
  "/copy/:id/delete",
  copy_controller.copy_delete_post
);

// GET request to update Copy.
router.get(
  "/copy/:id/update",
  copy_controller.copy_update_get
);

// POST request to update Copy.
router.post(
  "/copy/:id/update",
  copy_controller.copy_update_post
);

// GET request for one Copy.
router.get("/copy/:id", copy_controller.copy_detail);

// GET request for list of all Copy.
router.get("/Copies", copy_controller.copy_list);

module.exports = router;
