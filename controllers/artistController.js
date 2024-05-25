const Artist = require("../models/artist");
const Release = require("../models/release");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Display list of all Artists.
exports.artist_list = asyncHandler(async (req, res, next) => {
  const allArtists = await Artist.find().sort({ family_name: 1 }).exec();
  res.render("artist_list", {
    title: "Artist List",
    artist_list: allArtists,
  });
});

// Display detail page for a specific Artist.
exports.artist_detail = asyncHandler(async (req, res, next) => {
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

  res.render("artist_detail", {
    title: "Artist Detail",
    artist: artist,
    artist_releases: allReleasesByArtist,
  });
});

// Display Artist create form on GET.
exports.artist_create_get = (req, res, next) => {
  res.render("artist_form", { title: "Create Artist" });
};

// Handle Artist create on POST.
exports.artist_create_post = [
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
    .withMessage("Discogs ID has non-alphanumeric characters."),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Artist object with escaped and trimmed data
    const artist = new Artist({
      name: req.body.name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("artist_form", {
        title: "Create Artist",
        artist: artist,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.

      // Save artist.
      await artist.save();
      // Redirect to new artist release.
      res.redirect(artist.url);
    }
  }),
];

// Display Artist delete form on GET.
exports.artist_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of artist and all their releases (in parallel)
  const [artist, allReleasesByArtist] = await Promise.all([
    Artist.findById(req.params.id).exec(),
    Release.find({ artist: req.params.id }, "title summary").exec(),
  ]);

  if (artist === null) {
    // No results.
    res.redirect("/catalog/artists");
  }

  res.render("artist_delete", {
    title: "Delete Artist",
    artist: artist,
    artist_releases: allReleasesByArtist,
  });
});

// Handle Artist delete on POST.
exports.artist_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of artist and all their releases (in parallel)
  const [artist, allReleasesByArtist] = await Promise.all([
    Artist.findById(req.params.id).exec(),
    Release.find({ artist: req.params.id }, "title summary").exec(),
  ]);

  if (allReleasesByArtist.length > 0) {
    // Artist has releases. Render in same way as for GET route.
    res.render("artist_delete", {
      title: "Delete Artist",
      artist: artist,
      artist_releases: allReleasesByArtist,
    });
    return;
  } else {
    // Artist has no releases. Delete object and redirect to the list of artists.
    await Artist.findByIdAndDelete(req.body.artistid);
    res.redirect("/catalog/artists");
  }
});

// Display Artist update form on GET.
exports.artist_update_get = asyncHandler(async (req, res, next) => {
  const artist = await Artist.findById(req.params.id).exec();
  if (artist === null) {
    // No results.
    const err = new Error("Artist not found");
    err.status = 404;
    return next(err);
  }

  res.render("artist_form", { title: "Update Artist", artist: artist });
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
  asyncHandler(async (req, res, next) => {
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
      res.render("artist_form", {
        title: "Update Artist",
        artist: artist,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the release.
      await Artist.findByIdAndUpdate(req.params.id, artist);
      res.redirect(artist.url);
    }
  }),
];
