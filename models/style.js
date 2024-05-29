const mongoose = require("mongoose");
const { DateTime } = require("luxon"); // for date handling

const Schema = mongoose.Schema;

const StyleSchema = new Schema({
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
});

// Virtual for this style instance URL.
StyleSchema.virtual("url").get(function () {
  return "/catalog/style/" + this._id;
});

// Export model.
module.exports = mongoose.model("Style", StyleSchema);
