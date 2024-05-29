const Release = require("../models/release");
const Artist = require("../models/artist");
const Genre = require("../models/genre");
const Copy = require("../models/copy");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next, isAjax = false) => {
    // Get details of releases, release instances, authors and genre counts (in parallel)
    const [
        numReleases,
        numCopies,
        numAvailableCopies,
        numArtists,
        numGenres,
        artistList
    ] = await Promise.all([
        Release.countDocuments({}).exec(),
        Copy.countDocuments({}).exec(),
        Copy.countDocuments({ status: "Available" }).exec(),
        Artist.countDocuments({}).exec(),
        Genre.countDocuments({}).exec(),
        Artist.find().sort({ name: 1 }).exec() // Fetch the list of artists
    ]);

    if (isAjax) {
        res.json({
            release_count: numReleases,
            release_instance_count: numCopies,
            release_instance_available_count: numAvailableCopies,
            author_count: numArtists,
            genre_count: numGenres,
            artist_list: artistList
        });
    } else {
        res.render("index", {
            title: "Local Library Home",
            release_count: numReleases,
            release_instance_count: numCopies,
            release_instance_available_count: numAvailableCopies,
            author_count: numArtists,
            genre_count: numGenres,
            artist_list: artistList // Pass the artist list to the view
        });
    }

});
// Display list of all releases.
exports.release_list = asyncHandler(async (req, res, next, isAjax = false) => {
    const allReleases = await Release.find({}, "title author")
        .sort({ title: 1 })
        .populate("author")
        .exec();

    if (isAjax) {
        res.json(allReleases);
    } else {
        res.render("release_list", { title: "Release List", release_list: allReleases });
    }
});

// Display detail page for a specific release.
exports.release_detail = asyncHandler(async (req, res, next, isAjax = false) => {
    // Get details of releases, release instances for specific release
    const [release, Copies] = await Promise.all([
        Release.findById(req.params.id).populate("author").populate("genre").exec(),
        Copy.find({ release: req.params.id }).exec(),
    ]);

    if (release === null) {
        // No results.
        const err = new Error("Release not found");
        err.status = 404;
        return next(err);
    }

    if (isAjax) {
        res.json({ release, release_instances: Copies });
    } else {
        res.render("release_detail", {
            title: release.title,
            release: release,
            release_instances: Copies,
        });
    }
});

// Display release create form on GET.
exports.release_create_get = asyncHandler(async (req, res, next) => {
    // Get all authors and genres, which we can use for adding to our release.
    const [allArtists, allGenres] = await Promise.all([
        Artist.find().sort({ family_name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
    ]);

    res.render("release_form", {
        title: "Create Release",
        authors: allArtists,
        genres: allGenres,
    });
});

// Handle release create on POST.
exports.release_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if (!Array.isArray(req.body.genre)) {
            req.body.genre =
                typeof req.body.genre === "undefined" ? [] : [req.body.genre];
        }
        next();
    },

    // Validate and sanitize fields.
    body("title", "Title must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("author", "Artist must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("summary", "Summary must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
    body("genre.*").escape(),
    // Process request after validation and sanitization.

    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Release object with escaped and trimmed data.
        const release = new Release({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            const [allArtists, allGenres] = await Promise.all([
                Artist.find().sort({ family_name: 1 }).exec(),
                Genre.find().sort({ name: 1 }).exec(),
            ]);

            // Mark our selected genres as checked.
            for (const genre of allGenres) {
                if (release.genre.indexOf(genre._id) > -1) {
                    genre.checked = "true";
                }
            }
            res.render("release_form", {
                title: "Create Release",
                authors: allArtists,
                genres: allGenres,
                release: release,
                errors: errors.array(),
            });
        } else {
            // Data from form is valid. Save release.
            await release.save();
            res.redirect(release.url);
        }
    }),
];

// Display release delete form on GET.
exports.release_delete_get = asyncHandler(async (req, res, next) => {
    const [release, Copies] = await Promise.all([
        Release.findById(req.params.id).populate("author").populate("genre").exec(),
        Copy.find({ release: req.params.id }).exec(),
    ]);

    if (release === null) {
        // No results.
        res.redirect("/catalog/releases");
    }

    res.render("release_delete", {
        title: "Delete Release",
        release: release,
        release_instances: Copies,
    });
});

// Handle release delete on POST.
exports.release_delete_post = asyncHandler(async (req, res, next) => {
    // Assume the post has valid id (ie no validation/sanitization).

    const [release, Copies] = await Promise.all([
        Release.findById(req.params.id).populate("author").populate("genre").exec(),
        Copy.find({ release: req.params.id }).exec(),
    ]);

    if (release === null) {
        // No results.
        res.redirect("/catalog/releases");
    }

    if (Copies.length > 0) {
        // Release has release_instances. Render in same way as for GET route.
        res.render("release_delete", {
            title: "Delete Release",
            release: release,
            release_instances: Copies,
        });
        return;
    } else {
        // Release has no Copy objects. Delete object and redirect to the list of releases.
        await Release.findByIdAndDelete(req.body.id);
        res.redirect("/catalog/releases");
    }
});

// Display release update form on GET.
exports.release_update_get = asyncHandler(async (req, res, next) => {
    // Get release, authors and genres for form.
    const [release, allArtists, allGenres] = await Promise.all([
        Release.findById(req.params.id).populate("author").exec(),
        Artist.find().sort({ family_name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
    ]);

    if (release === null) {
        // No results.
        const err = new Error("Release not found");
        err.status = 404;
        return next(err);
    }

    // Mark our selected genres as checked.
    allGenres.forEach((genre) => {
        if (release.genre.includes(genre._id)) genre.checked = "true";
    });

    res.render("release_form", {
        title: "Update Release",
        authors: allArtists,
        genres: allGenres,
        release: release,
    });
});

// Handle release update on POST.
exports.release_update_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if (!Array.isArray(req.body.genre)) {
            req.body.genre =
                typeof req.body.genre === "undefined" ? [] : [req.body.genre];
        }
        next();
    },

    // Validate and sanitize fields.
    body("title", "Title must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("author", "Artist must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("summary", "Summary must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
    body("genre.*").escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Release object with escaped/trimmed data and old id.
        const release = new Release({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
            _id: req.params.id, // This is required, or a new ID will be assigned!
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form
            const [allArtists, allGenres] = await Promise.all([
                Artist.find().sort({ family_name: 1 }).exec(),
                Genre.find().sort({ name: 1 }).exec(),
            ]);

            // Mark our selected genres as checked.
            for (const genre of allGenres) {
                if (release.genre.includes(genre._id)) {
                    genre.checked = "true";
                }
            }
            res.render("release_form", {
                title: "Update Release",
                authors: allArtists,
                genres: allGenres,
                release: release,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid. Update the release.
            const therelease = await Release.findByIdAndUpdate(req.params.id, release, {});
            // Redirect to release detail page.
            res.redirect(therelease.url);
        }
    }),
];
