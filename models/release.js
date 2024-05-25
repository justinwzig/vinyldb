const mongoose = require("mongoose");
const { DateTime } = require("luxon"); // for date handling

const Schema = mongoose.Schema;

const ReleaseSchema = new Schema({
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

  title: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  primaryArtist: {
    type: Schema.Types.ObjectId,
    ref: "Artist",
    required: true
  },
  artists: [{
    type: Schema.Types.ObjectId,
    ref: "Artist",
    required: true
  }],
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
  tracks: [{
    type: Schema.Types.ObjectId,
    ref: "Track"
  }],
  copies: [{
    type: Schema.Types.ObjectId,
    ref: "Copy"
  }],

  format: {
    type: String,
    required: true
  },

  discogs_rid: { type: String },
  barcode_upc: { type: String },
  barcode_other: { type: String },
  custom_id: { type: String },

  print_date: { type: Date },

});

// Virtual for discogs url
ReleaseSchema.virtual("discogs_url").get(function () {
  return `https://discogs.com/release/${this.discogs_id}`;
});

// Virtual for this release instance URL.
ReleaseSchema.virtual("url").get(function () {
  return "/db/release/" + this._id;
});

// Export model.
module.exports = mongoose.model("Release", ReleaseSchema);
