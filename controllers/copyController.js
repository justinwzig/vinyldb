const Copy = require("../models/copy");
const Release = require("../models/release");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Display list of all Copies.
exports.copy_list = asyncHandler(async (req, res, next, isAjax = false) => {
    const allCopies = await Copy.find().populate("release").exec();

    if (isAjax) {
        res.json(allCopies);
    } else {
        res.render("copy_list", {
            title: "Copy List",
            copy_list: allCopies,
        });
    }
});

// Display detail page for a specific Copy.
exports.copy_detail = asyncHandler(async (req, res, next, isAjax = false) => {
    const copy = await Copy.findById(req.params.id)
        .populate("release")
        .exec();

    if (copy === null) {
        // No results.
        const err = new Error("Copy not found");
        err.status = 404;
        return next(err);
    }

    if (isAjax) {
        res.json(copy);
    } else {
        res.render("copy_detail", {
            title: "Release:",
            copy: copy,
        });
    }
});

// Display Copy create form on GET.
exports.copy_create_get = asyncHandler(async (req, res, next, isAjax = false) => {
    const allReleases = await Release.find({}, "title").sort({ title: 1 }).exec();

    if (isAjax) {
        res.json({
            title: "Create Copy",
            release_list: allReleases,
        });
    } else {
        res.render("copy_form", {
            title: "Create Copy",
            release_list: allReleases,
        });
    }
});

// Handle Copy create on POST.
exports.copy_create_post = asyncHandler(async (req, res, next, isAjax = false) => {
    // Validate and sanitize fields.
    body("release", "Release must be specified").trim().isLength({ min: 1 }).escape(),
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
            release: req.body.release,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
        });

        if (!errors.isEmpty()) {
            // There are errors.
            // Render form again with sanitized values and error messages.
            const allReleases = await Release.find({}, "title").sort({ title: 1 }).exec();

            if (isAjax) {
                res.json({
                    title: "Create Copy",
                    release_list: allReleases,
                    selected_release: copy.release._id,
                    errors: errors.array(),
                    copy: copy,
                });
            } else {
                res.render("copy_form", {
                    title: "Create Copy",
                    release_list: allReleases,
                    selected_release: copy.release._id,
                    errors: errors.array(),
                    copy: copy,
                });
            }
            return;
        } else {
            // Data from form is valid
            await copy.save();
            if (isAjax) {
                res.json(copy);
            } else {
                res.redirect(copy.url);
            }
        }
    });
});
// Display Copy delete form on GET.
exports.copy_delete_get = asyncHandler(async (req, res, next, isAjax = false) => {
    const copy = await Copy.findById(req.params.id)
        .populate("release")
        .exec();

    if (copy === null) {
        // No results.
        res.redirect("/catalog/copies");
    }

    if (isAjax) {
        res.json(copy);
    } else {
        res.render("copy_delete", {
            title: "Delete Copy",
            copy: copy,
        });
    }
});

// Handle Copy delete on POST.
exports.copy_delete_post = asyncHandler(async (req, res, next, isAjax = false) => {
    // Assume valid Copy id in field.
    await Copy.findByIdAndDelete(req.body.id);

    if (isAjax) {
        res.json({ message: "Copy deleted successfully" });
    } else {
        res.redirect("/catalog/copies");
    }
});

// Display Copy update form on GET.
exports.copy_update_get = asyncHandler(async (req, res, next, isAjax = false) => {
    // Get release, all releases for form (in parallel)
    const [copy, allReleases] = await Promise.all([
        Copy.findById(req.params.id).populate("release").exec(),
        Release.find(),
    ]);

    if (copy === null) {
        // No results.
        const err = new Error("Copy not found");
        err.status = 404;
        return next(err);
    }

    if (isAjax) {
        res.json({ copy, allReleases });
    } else {
        res.render("copy_form", {
            title: "Update Copy",
            release_list: allReleases,
            selected_release: copy.release._id,
            copy: copy,
        });
    }
});

// Handle Copy update on POST.
exports.copy_update_post = [
    // Validate and sanitize fields.
    body("release", "Release must be specified").trim().isLength({ min: 1 }).escape(),
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
    asyncHandler(async (req, res, next, isAjax = false) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Copy object with escaped/trimmed data and current id.
        const copy = new Copy({
            release: req.body.release,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            // There are errors.
            // Render the form again, passing sanitized values and errors.

            const allReleases = await Release.find({}, "title").exec();

            if (isAjax) {
                res.json({
                    title: "Update Copy",
                    release_list: allReleases,
                    selected_release: copy.release._id,
                    errors: errors.array(),
                    copy: copy,
                });
            } else {
                res.render("copy_form", {
                    title: "Update Copy",
                    release_list: allReleases,
                    selected_release: copy.release._id,
                    errors: errors.array(),
                    copy: copy,
                });
            }
            return;
        } else {
            // Data from form is valid.
            await Copy.findByIdAndUpdate(req.params.id, copy, {});
            // Redirect to detail page.
            if (isAjax) {
                res.json(copy);
            } else {
                res.redirect(copy.url);
            }
        }
    }),
];
