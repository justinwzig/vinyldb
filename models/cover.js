const mongoose = require("mongoose");
const { DateTime } = require("luxon"); // for date handling

const Schema = mongoose.Schema;

const GenericSchema = new Schema({
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

  image_url: {
    type: String,
    required: true,
    default: "/assets/default.png"
  },
});

// Virtual for this generic instance URL.
GenericSchema.virtual("url").get(function () {
  return "/catalog/generic/" + this._id;
});

// Export model.
module.exports = mongoose.model("Generic", GenericSchema);
