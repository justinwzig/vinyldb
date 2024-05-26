const mongoose = require("mongoose");
const { DateTime } = require("luxon"); // for date handling

const Schema = mongoose.Schema;

const CrateSchema = new Schema({
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
  collection: {
    type: Schema.Types.ObjectId,
    ref: "collection"
  },
  genres: [{
    type: Schema.Types.ObjectId,
    ref: "Genre"
  }],
  autocrate: {
    type: Boolean,
    default: false
  }
});

// Virtual for this crate instance URL.
CrateSchema.virtual("url").get(function () {
  return "/catalog/crate/" + this._id;
});

// Export model.
module.exports = mongoose.model("Crate", CrateSchema);
