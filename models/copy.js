const mongoose = require("mongoose");
const { DateTime } = require("luxon"); //for date handling

const Schema = mongoose.Schema;

const CopySchema = new Schema({
  // Schema Versioning Pattern
  schema_version: { type: Number, required: true, default: 1 },
  // Document Versioning Pattern
  revision: { type: Number, required: true, default: 1 },
  // Date created
  date_created: { type: Date, required: true },
  // Date Modified
  date_modified: { type: Date },

  release: {
    type: Schema.Types.ObjectId,
    ref: "Release",
    required: true
  },

  collection: {
    type: Schema.Types.ObjectId,
    ref: "Collection",
    required: true
  },

  crates: [{
    type: Schema.Types.ObjectId,
    ref: "Crate",
  }],

  cost: {
    type: Number,
  },

  date_ac: { // date acquired
    type: Date,
  },

  date_in: { // date inventoried
    type: Date,
    required: true
  },

  media_cond: { // media condition
    type: String,
  },

  sleeve_cond: { // sleeve condition
    type: String,
  },

  num_discs: { // number of discs
    type: Number
  },

  printdate: { // print date
    type: Date
  },

  status: { // status
    type: String
  },

});

// Virtual for this copy object's URL.
CopySchema.virtual("url").get(function () {
  return "/catalog/copy/" + this._id;
});

// Virtual for discogs url
CopySchema.virtual("discogs_url").get(function () {
  return `https://discogs.com/release/${this.discogs_id}`;
});

// Virtual for release's URL
CopySchema.virtual("release_url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/copy/${this._id}`;
});

// Export model.
module.exports = mongoose.model("Copy", CopySchema);
