/*
The file  defines a series of routes. Each route is associated with a URL pattern and a function (or functions) that should be called when a request is made to that URL. The routes are organized into sections for different parts of the application: releases, artists, genres, and copies.

Each route definition starts with a call to a method on the router object, such as router.get or router.post. The method corresponds to the HTTP method of the request. The first argument to these methods is a string that defines the URL pattern for the route. The remaining arguments are functions that should be called when a request is made to that URL.

For example, the route router.get("/release/create", function(req, res, next) {...}); listens for GET requests to the URL "/release/create". When such a request is made, it calls the function provided as the second argument. This function takes four arguments: req (the request object), res (the response object), next (a function to call to pass control to the next middleware function), and isAjax (a boolean indicating whether the request was made via Ajax).

The function then calls a method on one of the controller modules, passing along the req, res, next, and isAjax arguments. This method contains the logic to handle the request.

Finally, at the end of the file, the router object is exported. This allows it to be imported and used in other parts of the application.
*/

const express = require("express");
const router = express.Router();

// Require our controllers.
const release_controller = require("../controllers/releaseController");
const artist_controller = require("../controllers/artistController");
const genre_controller = require("../controllers/genreController");
const copy_controller = require("../controllers/copyController");

/// RELEASE ROUTES ///

// GET catalog home page.
router.get("/", release_controller.index, artist_controller.artist_list);

// GET request for creating a Release. NOTE This must come before routes that display Release (uses id).
router.get("/release/create", function (req, res, next) {
    const isAjax = req.xhr;
    release_controller.release_create_get(req, res, next, isAjax);
});

// POST request for creating Release.
router.post("/release/create", function (req, res, next) {
    const isAjax = req.xhr;
    release_controller.release_create_post(req, res, next, isAjax);
});

// GET request to delete Release.
router.get("/release/:id/delete", function (req, res, next) {
    const isAjax = req.xhr;
    release_controller.release_delete_get(req, res, next, isAjax);
});

// POST request to delete Release.
router.post("/release/:id/delete", function (req, res, next) {
    const isAjax = req.xhr;
    release_controller.release_delete_post(req, res, next, isAjax);
});

// GET request to update Release.
router.get("/release/:id/update", function (req, res, next) {
    const isAjax = req.xhr;
    release_controller.release_update_get(req, res, next, isAjax);
});

// POST request to update Release.
router.post("/release/:id/update", function (req, res, next) {
    const isAjax = req.xhr;
    release_controller.release_update_post(req, res, next, isAjax);
});

// GET request for one Release.
router.get("/release/:id", function (req, res, next) {
    const isAjax = req.xhr;
    release_controller.release_detail(req, res, next, isAjax);
});

// GET request for list of all Release.
router.get("/releases", function (req, res, next) {
    const isAjax = req.xhr;
    release_controller.release_list(req, res, next, isAjax);
});

/// ARTIST ROUTES ///

// GET request for creating Artist. NOTE This must come before route for id (i.e. display artist).
router.get("/artist/create", function (req, res, next) {
    const isAjax = req.xhr;
    artist_controller.artist_create_get(req, res, next, isAjax);
});

// POST request for creating Artist.
router.post("/artist/create", function (req, res, next) {
    const isAjax = req.xhr;
    artist_controller.artist_create_post(req, res, next, isAjax);
});

// GET request to delete Artist.
router.get("/artist/:id/delete", function (req, res, next) {
    const isAjax = req.xhr;
    artist_controller.artist_delete_get(req, res, next, isAjax);
});

// POST request to delete Artist
router.post("/artist/:id/delete", function (req, res, next) {
    const isAjax = req.xhr;
    artist_controller.artist_delete_post(req, res, next, isAjax);
});

// GET request to update Artist.
router.get("/artist/:id/update", function (req, res, next) {
    const isAjax = req.xhr;
    artist_controller.artist_update_get(req, res, next, isAjax);
});

// POST request to update Artist.
router.post("/artist/:id/update", function (req, res, next) {
    const isAjax = req.xhr;
    artist_controller.artist_update_post(req, res, next, isAjax);
});

// GET request for one Artist.
router.get("/artist/:id", function (req, res, next) {
    const isAjax = req.xhr;
    artist_controller.artist_detail(req, res, next, isAjax);
});

// GET request for list of all Artists.
router.get("/artists", function (req, res, next) {
    const isAjax = req.xhr;
    console.log("/artists isAjax: " + isAjax)
    artist_controller.artist_list(req, res, next, isAjax);
});

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get("/genre/create", function (req, res, next) {
    const isAjax = req.xhr;
    genre_controller.genre_create_get(req, res, next, isAjax);
});

// POST request for creating Genre.
router.post("/genre/create", function (req, res, next) {
    const isAjax = req.xhr;
    genre_controller.genre_create_post(req, res, next, isAjax);
});

// GET request to delete Genre.
router.get("/genre/:id/delete", function (req, res, next) {
    const isAjax = req.xhr;
    genre_controller.genre_delete_get(req, res, next, isAjax);
});

// POST request to delete Genre.
router.post("/genre/:id/delete", function (req, res, next) {
    const isAjax = req.xhr;
    genre_controller.genre_delete_post(req, res, next, isAjax);
});

// GET request to update Genre.
router.get("/genre/:id/update", function (req, res, next) {
    const isAjax = req.xhr;
    genre_controller.genre_update_get(req, res, next, isAjax);
});

// POST request to update Genre.
router.post("/genre/:id/update", function (req, res, next) {
    const isAjax = req.xhr;
    genre_controller.genre_update_post(req, res, next, isAjax);
});

// GET request for one Genre.
router.get("/genre/:id", function (req, res, next) {
    const isAjax = req.xhr;
    genre_controller.genre_detail(req, res, next, isAjax);
});

// GET request for list of all Genre.
router.get("/genres", function (req, res, next) {
    const isAjax = req.xhr;
    genre_controller.genre_list(req, res, next, isAjax);
});

// COPY ROUTES ///

// GET request for creating a Copy. NOTE This must come before route that displays Copy (uses id).
router.get(
    "/copy/create",
    function (req, res, next) {
        const isAjax = req.xhr;
        copy_controller.copy_create_get(req, res, next, isAjax);
    }
);

// POST request for creating Copy.
router.post(
    "/copy/create",
    function (req, res, next) {
        const isAjax = req.xhr;
        copy_controller.copy_create_post(req, res, next, isAjax);
    }
);

// GET request to delete Copy.
router.get(
    "/copy/:id/delete",
    function (req, res, next) {
        const isAjax = req.xhr;
        copy_controller.copy_delete_get(req, res, next, isAjax);
    }
);

// POST request to delete Copy.
router.post(
    "/copy/:id/delete",
    function (req, res, next) {
        const isAjax = req.xhr;
        copy_controller.copy_delete_post(req, res, next, isAjax);
    }
);

// GET request to update Copy.
router.get(
    "/copy/:id/update",
    function (req, res, next) {
        const isAjax = req.xhr;
        copy_controller.copy_update_get(req, res, next, isAjax);
    }
);

// POST request to update Copy.
router.post(
    "/copy/:id/update",
    function (req, res, next) {
        const isAjax = req.xhr;
        copy_controller.copy_update_post(req, res, next, isAjax);
    }
);

// GET request for one Copy.
router.get(
    "/copy/:id",
    function (req, res, next) {
        const isAjax = req.xhr;
        copy_controller.copy_detail(req, res, next, isAjax);
    }
);

// GET request for list of all Copy.
router.get(
    "/copies",
    function (req, res, next) {
        const isAjax = req.xhr;
        copy_controller.copy_list(req, res, next, isAjax);
    }
);

module.exports = router;
