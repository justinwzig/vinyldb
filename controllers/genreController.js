const Genre = require("../models/genre");
const Release = require("../models/release");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Display list of all Genre.
exports.genre_list = asyncHandler(async (req, res, next, isAjax = false) => {
  const allGenres = await Genre.find().sort({ name: 1 }).exec();

  if (isAjax) {
    res.json({ genre_list: allGenres });
  } else {
    res.render("genre_list", {
        title: "Genre List",
        list_genres: allGenres,
    });
  }
});

// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next, isAjax = false) => {
    // Get details of genre and all associated releases (in parallel)
    const [genre, releasesInGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Release.find({ genre: req.params.id }, "title summary").exec(),
    ]);
    if (genre === null) {
        // No results.
        const err = new Error("Genre not found");
        err.status = 404;
        return next(err);
    }

    if (isAjax) {
        res.json({ genre_detail: genre, genre_releases: releasesInGenre });
    } else {
        res.render("genre_detail", {
            title: "Genre Detail",
            genre: genre,
            genre_releases: releasesInGenre,
        });
    }
});

// Display Genre create form on GET.
exports.genre_create_get = asyncHandler(async (req, res, next, isAjax = false) => {
    if (isAjax) {
        res.json({ title: "Create Genre" });
    } else {
        res.render("genre_form", { title: "Create Genre" });
    }
});
// Handle Genre create on POST.
exports.genre_create_post = [
    // Validate and sanitize the name field.
    body("name", "Genre name must contain at least 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next, isAjax = false) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        const genre = new Genre({ name: req.body.name });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            if (isAjax) {
                res.json({ title: "Create Genre", errors: errors.array() });
            } else {
                res.render("genre_form", {
                    title: "Create Genre",
                    genre: genre,
                    errors: errors.array(),
                });
            }
            return;
        } else {
            // Data from form is valid.
            // Check if Genre with same name (case insensitive) already exists.
            const genreExists = await Genre.findOne({ name: req.body.name })
                .collation({ locale: "en", strength: 2 })
                .exec();
            if (genreExists) {
                // Genre exists, redirect to its detail page.
                if (isAjax) {
                    res.json({ genre_exists: true, genre_url: genreExists.url });
                } else {
                    res.redirect(genreExists.url);
                }
            } else {
                await genre.save();
                // New genre saved. Redirect to genre detail page.
                if (isAjax) {
                    res.json({ genre_url: genre.url });
                } else {
                    res.redirect(genre.url);
                }
            }
        }
    }),
];

// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next, isAjax = false) => {
    // Get details of genre and all associated releases (in parallel)
    const [genre, releasesInGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Release.find({ genre: req.params.id }, "title summary").exec(),
    ]);
    if (genre === null) {
        // No results.
        if (isAjax) {
            res.json({ error: "Genre not found" });
        } else {
            res.redirect("/catalog/genres");
        }
    }

    if (isAjax) {
        res.json({ genre: genre, genre_releases: releasesInGenre });
    } else {
        res.render("genre_delete", {
            title: "Delete Genre",
            genre: genre,
            genre_releases: releasesInGenre,
        });
    }
});

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next, isAjax = false) => {
    // Get details of genre and all associated releases (in parallel)
    const [genre, releasesInGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Release.find({ genre: req.params.id }, "title summary").exec(),
    ]);

    if (releasesInGenre.length > 0) {
        // Genre has releases. Render in same way as for GET route.
        if (isAjax) {
            res.json({ genre: genre, genre_releases: releasesInGenre });
        } else {
            res.render("genre_delete", {
                title: "Delete Genre",
                genre: genre,
                genre_releases: releasesInGenre,
            });
        }
        return;
    } else {
        // Genre has no releases. Delete object and redirect to the list of genres.
        await Genre.findByIdAndDelete(req.body.id);
        if (isAjax) {
            res.json({ success: true });
        } else {
            res.redirect("/catalog/genres");
        }
    }
});

// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next, isAjax = false) => {
    const genre = await Genre.findById(req.params.id).exec();

    if (genre === null) {
        // No results.
        const err = new Error("Genre not found");
        err.status = 404;
        return next(err);
    }

    if (isAjax) {
        res.json({ title: "Update Genre", genre: genre });
    } else {
        res.render("genre_form", { title: "Update Genre", genre: genre });
    }
});

// Handle Genre update on POST.
exports.genre_update_post = [
    // Validate and sanitize the name field.
    body("name", "Genre name must contain at least 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next, isAjax = false) => {
        // Extract the validation errors from a request .
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data (and the old id!)
        const genre = new Genre({
            name: req.body.name,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            if (isAjax) {
                res.json({ title: "Update Genre", genre: genre, errors: errors.array() });
            } else {
                res.render("genre_form", {
                    title: "Update Genre",
                    genre: genre,
                    errors: errors.array(),
                });
            }
            return;
        } else {
            // Data from form is valid. Update the release.
            await Genre.findByIdAndUpdate(req.params.id, genre);
            if (isAjax) {
                res.json({ genre_url: genre.url });
            } else {
                res.redirect(genre.url);
            }
        }
    }),
];
