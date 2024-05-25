const Copy = require("../models/copy");
const Record = require("../models/record");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Display list of all Copies.
exports.copy_list = asyncHandler(async (req, res, next) => {
  const allCopies = await Copy.find().populate("record").exec();

  res.render("copy_list", {
    title: "Copy List",
    copy_list: allCopies,
  });
});

// Display detail page for a specific Copy.
exports.copy_detail = asyncHandler(async (req, res, next) => {
  const copy = await Copy.findById(req.params.id)
    .populate("record")
    .exec();

  if (copy === null) {
    // No results.
    const err = new Error("Copy not found");
    err.status = 404;
    return next(err);
  }

  res.render("copy_detail", {
    title: "Record:",
    copy: copy,
  });
});

// Display Copy create form on GET.
exports.copy_create_get = asyncHandler(async (req, res, next) => {
  const allRecords = await Record.find({}, "title").sort({ title: 1 }).exec();

  res.render("copy_form", {
    title: "Create Copy",
    record_list: allRecords,
  });
});

// Handle Copy create on POST.
exports.copy_create_post = [
  // Validate and sanitize fields.
  body("record", "Record must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Copy object with escaped and trimmed data.
    const copy = new Copy({
      record: req.body.record,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      const allRecords = await Record.find({}, "title").sort({ title: 1 }).exec();

      res.render("copy_form", {
        title: "Create Copy",
        record_list: allRecords,
        selected_record: copy.record._id,
        errors: errors.array(),
        copy: copy,
      });
      return;
    } else {
      // Data from form is valid
      await copy.save();
      res.redirect(copy.url);
    }
  }),
];

// Display Copy delete form on GET.
exports.copy_delete_get = asyncHandler(async (req, res, next) => {
  const copy = await Copy.findById(req.params.id)
    .populate("record")
    .exec();

  if (copy === null) {
    // No results.
    res.redirect("/catalog/copies");
  }

  res.render("copy_delete", {
    title: "Delete Copy",
    copy: copy,
  });
});

// Handle Copy delete on POST.
exports.copy_delete_post = asyncHandler(async (req, res, next) => {
  // Assume valid Copy id in field.
  await Copy.findByIdAndDelete(req.body.id);
  res.redirect("/catalog/copies");
});

// Display Copy update form on GET.
exports.copy_update_get = asyncHandler(async (req, res, next) => {
  // Get record, all records for form (in parallel)
  const [copy, allRecords] = await Promise.all([
    Copy.findById(req.params.id).populate("record").exec(),
    Record.find(),
  ]);

  if (copy === null) {
    // No results.
    const err = new Error("Copy not found");
    err.status = 404;
    return next(err);
  }

  res.render("copy_form", {
    title: "Update Copy",
    record_list: allRecords,
    selected_record: copy.record._id,
    copy: copy,
  });
});

// Handle Copy update on POST.
exports.copy_update_post = [
  // Validate and sanitize fields.
  body("record", "Record must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Copy object with escaped/trimmed data and current id.
    const copy = new Copy({
      record: req.body.record,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render the form again, passing sanitized values and errors.

      const allRecords = await Record.find({}, "title").exec();

      res.render("copy_form", {
        title: "Update Copy",
        record_list: allRecords,
        selected_record: copy.record._id,
        errors: errors.array(),
        copy: copy,
      });
      return;
    } else {
      // Data from form is valid.
      await Copy.findByIdAndUpdate(req.params.id, copy, {});
      // Redirect to detail page.
      res.redirect(copy.url);
    }
  }),
];
