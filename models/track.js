const mongoose = require("mongoose");
const { DateTime } = require("luxon"); // for date handling

const Schema = mongoose.Schema;

const TrackSchema = new Schema({
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

  releases: [{ //note that this is an array
    type: Schema.Types.ObjectId,
    ref: "Release",
    reqired: true
  }],
  title: {
    type: String,
    required: true
  },
  position: {
    type: String,
  },
  duration: {
    type: String,
  },
  genres: [{
    type: Schema.Types.ObjectId,
    ref: "Genre"
  }],
});

// Virtual for this track instance URL.
TrackSchema.virtual("url").get(function () {
  return "/db/track/" + this._id;
});

// Export model.
module.exports = mongoose.model("Track", TrackSchema);
