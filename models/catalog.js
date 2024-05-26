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

  name: {
    type: String,
    required: true
  },
  primaryCover: {
    type: Schema.Types.ObjectId,
    ref: "Cover"
  },
  covers: [{
    type: Schema.Types.ObjectId,
    ref: "Cover"
  }], //note that this is an array
  genres: [{
    type: Schema.Types.ObjectId,
    ref: "Genre"
  }],
  styles: [{
    type: Schema.Types.ObjectId,
    ref: "Style"
  }],
  copies: [{
    type: Schema.Types.ObjectId,
    ref: "Copy"
  }],
  crates: [{
    type: Schema.Types.ObjectId,
    ref: "Crate"
  }],
});

// Virtual for this generic instance URL.
GenericSchema.virtual("url").get(function () {
  return "/catalog/generic/" + this._id;
});

// Export model.
module.exports = mongoose.model("Generic", GenericSchema);
