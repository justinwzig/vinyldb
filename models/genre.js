const mongoose = require("mongoose");
const { DateTime } = require("luxon"); // for date handling

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  // Schema Versioning Pattern
  schema_version: { type: Number, required: true, default: 1 },
  // Document Versioning Pattern
  revision: { type: Number, required: true, default: 1 },
  // Date created
  date_created: { type: Date, required: true },
  // Date Modified
  date_modified: { type: Date },
  // Status
  status: { type: String },

  name: {
    type: String,
    required: true
  },
  desc: {
    type: String,
  },
  status: { type: String }
});

// Virtual for this genre instance URL.
GenreSchema.virtual("url").get(function () {
  return "/db/genre/" + this._id;
});

// Export model.
module.exports = mongoose.model("Genre", GenreSchema);
