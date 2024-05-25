const Record = require("../models/record");
const Artist = require("../models/artist");
const Genre = require("../models/genre");
const Copy = require("../models/copy");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of records, record instances, authors and genre counts (in parallel)
  const [
    numRecords,
    numCopies,
    numAvailableCopies,
    numArtists,
    numGenres,
  ] = await Promise.all([
    Record.countDocuments({}).exec(),
    Copy.countDocuments({}).exec(),
    Copy.countDocuments({ status: "Available" }).exec(),
    Artist.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Local Library Home",
    record_count: numRecords,
    record_instance_count: numCopies,
    record_instance_available_count: numAvailableCopies,
    author_count: numArtists,
    genre_count: numGenres,
  });
});

// Display list of all records.
exports.record_list = asyncHandler(async (req, res, next) => {
  const allRecords = await Record.find({}, "title author")
    .sort({ title: 1 })
    .populate("author")
    .exec();

  res.render("record_list", { title: "Record List", record_list: allRecords });
});

// Display detail page for a specific record.
exports.record_detail = asyncHandler(async (req, res, next) => {
  // Get details of records, record instances for specific record
  const [record, Copies] = await Promise.all([
    Record.findById(req.params.id).populate("author").populate("genre").exec(),
    Copy.find({ record: req.params.id }).exec(),
  ]);

  if (record === null) {
    // No results.
    const err = new Error("Record not found");
    err.status = 404;
    return next(err);
  }

  res.render("record_detail", {
    title: record.title,
    record: record,
    record_instances: Copies,
  });
});

// Display record create form on GET.
exports.record_create_get = asyncHandler(async (req, res, next) => {
  // Get all authors and genres, which we can use for adding to our record.
  const [allArtists, allGenres] = await Promise.all([
    Artist.find().sort({ family_name: 1 }).exec(),
    Genre.find().sort({ name: 1 }).exec(),
  ]);

  res.render("record_form", {
    title: "Create Record",
    authors: allArtists,
    genres: allGenres,
  });
});

// Handle record create on POST.
exports.record_create_post = [
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

    // Create a Record object with escaped and trimmed data.
    const record = new Record({
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
        if (record.genre.indexOf(genre._id) > -1) {
          genre.checked = "true";
        }
      }
      res.render("record_form", {
        title: "Create Record",
        authors: allArtists,
        genres: allGenres,
        record: record,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save record.
      await record.save();
      res.redirect(record.url);
    }
  }),
];

// Display record delete form on GET.
exports.record_delete_get = asyncHandler(async (req, res, next) => {
  const [record, Copies] = await Promise.all([
    Record.findById(req.params.id).populate("author").populate("genre").exec(),
    Copy.find({ record: req.params.id }).exec(),
  ]);

  if (record === null) {
    // No results.
    res.redirect("/catalog/records");
  }

  res.render("record_delete", {
    title: "Delete Record",
    record: record,
    record_instances: Copies,
  });
});

// Handle record delete on POST.
exports.record_delete_post = asyncHandler(async (req, res, next) => {
  // Assume the post has valid id (ie no validation/sanitization).

  const [record, Copies] = await Promise.all([
    Record.findById(req.params.id).populate("author").populate("genre").exec(),
    Copy.find({ record: req.params.id }).exec(),
  ]);

  if (record === null) {
    // No results.
    res.redirect("/catalog/records");
  }

  if (Copies.length > 0) {
    // Record has record_instances. Render in same way as for GET route.
    res.render("record_delete", {
      title: "Delete Record",
      record: record,
      record_instances: Copies,
    });
    return;
  } else {
    // Record has no Copy objects. Delete object and redirect to the list of records.
    await Record.findByIdAndDelete(req.body.id);
    res.redirect("/catalog/records");
  }
});

// Display record update form on GET.
exports.record_update_get = asyncHandler(async (req, res, next) => {
  // Get record, authors and genres for form.
  const [record, allArtists, allGenres] = await Promise.all([
    Record.findById(req.params.id).populate("author").exec(),
    Artist.find().sort({ family_name: 1 }).exec(),
    Genre.find().sort({ name: 1 }).exec(),
  ]);

  if (record === null) {
    // No results.
    const err = new Error("Record not found");
    err.status = 404;
    return next(err);
  }

  // Mark our selected genres as checked.
  allGenres.forEach((genre) => {
    if (record.genre.includes(genre._id)) genre.checked = "true";
  });

  res.render("record_form", {
    title: "Update Record",
    authors: allArtists,
    genres: allGenres,
    record: record,
  });
});

// Handle record update on POST.
exports.record_update_post = [
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

    // Create a Record object with escaped/trimmed data and old id.
    const record = new Record({
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
        if (record.genre.includes(genre._id)) {
          genre.checked = "true";
        }
      }
      res.render("record_form", {
        title: "Update Record",
        authors: allArtists,
        genres: allGenres,
        record: record,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const therecord = await Record.findByIdAndUpdate(req.params.id, record, {});
      // Redirect to record detail page.
      res.redirect(therecord.url);
    }
  }),
];
