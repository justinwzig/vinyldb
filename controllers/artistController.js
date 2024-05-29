/*
The module begins by importing the necessary dependencies. It imports two models, Artist and Release, which are likely Mongoose models used to interact with a MongoDB database. It also imports body and validationResult from express-validator for request validation and sanitization, and asyncHandler from express-async-handler to handle asynchronous route handlers with error handling.

The exported functions are designed to handle various HTTP requests:

artist_list: This function retrieves a list of all artists from the database, sorts them by their family name, and sends the list to the client. If the request is an AJAX request, it sends a JSON response; otherwise, it renders a view named "artist_list".

artist_detail: This function retrieves detailed information about a specific artist and all their releases. If the artist is not found, it creates a new Error object and passes it to the next middleware function. If the artist is found, it sends the artist and their releases to the client.

artist_create_get and artist_create_post: These functions handle the GET and POST requests for creating a new artist. The GET handler simply renders a form for creating an artist. The POST handler validates and sanitizes the request body, creates a new Artist object, and saves it to the database. If there are validation errors, it re-renders the form with error messages.

artist_delete_get and artist_delete_post: These functions handle the GET and POST requests for deleting an artist. The GET handler retrieves the artist and their releases and renders a form for deleting the artist. The POST handler deletes the artist from the database if they have no releases.

artist_update_get and artist_update_post: These functions handle the GET and POST requests for updating an artist. The GET handler retrieves the artist and renders a form for updating the artist. The POST handler validates and sanitizes the request body, creates a new Artist object with the updated data, and updates the artist in the database.

The Error class declarations you provided seem to be repeated and extend MongooseError. This is typically used to create custom error classes in a Mongoose application, but without more context, it's hard to provide a detailed explanation of their use in this code.
*/

const Artist = require("../models/artist");
const Release = require("../models/release");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Display list of all Artists.
exports.artist_list = asyncHandler(async (req, res, next, isAjax = false) => {
    const allArtists = await Artist.find().sort({ family_name: 1 }).exec();
    if (isAjax) {
        res.json({ artist_list: allArtists });
    } else {
        res.render("artist_list", {
            title: "Artist List",
            artist_list: allArtists,
        });
    }
});

// Display detail page for a specific Artist.
exports.artist_detail = asyncHandler(async (req, res, next, isAjax = false) => {
    // Get details of artist and all their releases (in parallel)
    const [artist, allReleasesByArtist] = await Promise.all([
        Artist.findById(req.params.id).exec(),
        Release.find({ artist: req.params.id }, "title summary").exec(),
    ]);

    if (artist === null) {
        // No results.
        const err = new Error("Artist not found");
        err.status = 404;
        return next(err);
    }

    if (isAjax) {
        res.json({ artist: artist, artist_releases: allReleasesByArtist });
    } else {
        res.render("artist_detail", {
            title: "Artist Detail",
            artist: artist,
            artist_releases: allReleasesByArtist,
        });
    }
});

// Display Artist create form on GET.
exports.artist_create_get = asyncHandler(async (req, res, next, isAjax = false) => {
    if (isAjax) {
        res.json({ title: "Create Artist" });
    } else {
        res.render("artist_form", { title: "Create Artist" });
    }
});

// Handle Artist create on POST.
exports.artist_create_post = asyncHandler(async (req, res, next, isAjax = false) => {
    // Validate and sanitize fields.
    body("schema_version", "Invalid schema version")
        .trim()
        .isInt({ min: 1 })
        .default(1)
        .optional({ values: "falsy" })
        .withMessage("Schema version must be an integer."),
    body("revision", "Invalid revision")
        .trim()
        .isInt({ min: 1 })
        .default(1)
        .optional({ values: "falsy" })
        .withMessage("Revision must be an integer."),
    body("date_created", "Invalid date created")
        .trim()
        .isDate()
        .default(Date.now)
        .optional({ values: "falsy" })
        .withMessage("Date created must be a date."),
    body("name")
        .isLength({ min: 1 })
        .escape()
        .optional({ values: "falsy" })
        .withMessage("Name must be specified."),
    body("discogs_id", "Invalid Discogs ID")
        .optional({ values: "truthy" })
        .escape()
        .isAlphanumeric()
        .withMessage("Discogs ID has non-alphanumeric characters.");

    // Process request after validation and sanitization.
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Artist object with escaped and trimmed data
    const artist = new Artist({
        schema_version: req.body.schema_version,
        revision: req.body.revision,
        date_created: req.body.date_created,
        name: req.body.name,
        discogs_id: req.body.discogs_id,
    });

    if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        if (isAjax) {
            res.json({ errors: errors.array() });
        } else {
            res.render("artist_form", {
                title: "Create Artist",
                artist: artist,
                errors: errors.array(),
            });
        }
        return;
    } else {
        // Data from form is valid.

        // Save artist.
        await artist.save();
        // Redirect to new artist release.
        if (isAjax) {
            res.json({ artist: artist });
        } else {
            res.redirect(artist.url);
        }
    }
});

// Display Artist delete form on GET.
exports.artist_delete_get = asyncHandler(async (req, res, next, isAjax = false) => {
    // Get details of artist and all their releases (in parallel)
    const [artist, allReleasesByArtist] = await Promise.all([
        Artist.findById(req.params.id).exec(),
        Release.find({ artist: req.params.id }, "title summary").exec(),
    ]);

    if (artist === null) {
        // No results.
        if (isAjax) {
            res.json({ message: "Artist not found" });
        } else {
            res.redirect("/catalog/artists");
        }
        return;
    }

    if (isAjax) {
        res.json({ artist: artist, artist_releases: allReleasesByArtist });
    } else {
        res.render("artist_delete", {
            title: "Delete Artist",
            artist: artist,
            artist_releases: allReleasesByArtist,
        });
    }
});

// Handle Artist delete on POST.
exports.artist_delete_post = asyncHandler(async (req, res, next, isAjax = false) => {
    // Get details of artist and all their releases (in parallel)
    const [artist, allReleasesByArtist] = await Promise.all([
        Artist.findById(req.params.id).exec(),
        Release.find({ artist: req.params.id }, "title summary").exec(),
    ]);

    if (allReleasesByArtist.length > 0) {
        // Artist has releases. Render in same way as for GET route.
        if (isAjax) {
            res.json({ artist: artist, artist_releases: allReleasesByArtist });
        } else {
            res.render("artist_delete", {
                title: "Delete Artist",
                artist: artist,
                artist_releases: allReleasesByArtist,
            });
        }
        return;
    } else {
        // Artist has no releases. Delete object and redirect to the list of artists.
        await Artist.findByIdAndDelete(req.body.artistid);
        if (isAjax) {
            res.json({ message: "Artist deleted successfully" });
        } else {
            res.redirect("/catalog/artists");
        }
    }
});

// Display Artist update form on GET.
exports.artist_update_get = asyncHandler(async (req, res, next, isAjax = false) => {
    const artist = await Artist.findById(req.params.id).exec();
    if (artist === null) {
        // No results.
        const err = new Error("Artist not found");
        err.status = 404;
        return next(err);
    }

    if (isAjax) {
        res.json({ artist: artist });
    } else {
        res.render("artist_form", { title: "Update Artist", artist: artist });
    }
});

// Handle Artist update on POST.
exports.artist_update_post = [
    // Validate and sanitize fields.
    body("schema_version", "Invalid schema version")
        .trim()
        .isInt({ min: 1 })
        .default(1)
        .optional({ values: "falsy" })
        .withMessage("Schema version must be an integer."),
    body("revision", "Invalid revision")
        .trim()
        .isInt({ min: 1 })
        .default(1)
        .optional({ values: "falsy" })
        .withMessage("Revision must be an integer."),
    body("date_created", "Invalid date created")
        .trim()
        .isDate()
        .default(Date.now)
        .optional({ values: "falsy" })
        .withMessage("Date created must be a date."),
    body("name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .optional({ values: "falsy" })
        .withMessage("Name must be specified."),
    body("discogs_id", "Invalid Discogs ID")
        .optional({ values: "truthy" })
        .escape()
        .isAlphanumeric()
        .withMessage("Discogs ID has non-alphanumeric characters."),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next, isAjax = false) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Artist object with escaped and trimmed data (and the old id!)
        const artist = new Artist({
            first_name: req.body.name,
            discogs_id: req.discogs_id,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            if (req.isAjax) {
                res.json({ errors: errors.array() });
            } else {
                res.render("artist_form", {
                    title: "Update Artist",
                    artist: artist,
                    errors: errors.array(),
                });
            }
            return;
        } else {
            // Data from form is valid. Update the release.
            await Artist.findByIdAndUpdate(req.params.id, artist);
            // if Ajax return the artist document in a json response. Else redirect to the artist detail page.
            if (isAjax) {
                res.json({ artist: artist });
            } else {
                res.redirect(artist.url);
            }
        }
    }),
];
