const mongoose = require("mongoose");
const { DateTime } = require("luxon"); // for date handling

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
  // Schema Versioning Pattern
  schema_version: { type: Number, required: true, default: 1 },
  // Document Versioning Pattern
  revision: { type: Number, required: true, default: 1 },
  // Date created
  date_created: { type: Date, required: true },
  // Date Modified
  date_modified: { type: Date },

  name: {
    type: String,
    required: true
  },
  discogs_id: {
    type: String,
  },
  image_url: {
    type: String,
  },
  releases: [{ //note that this is an array
    type: Schema.Types.ObjectId,
    ref: "Release"
  }],
  genres: [{
    type: Schema.Types.ObjectId,
    ref: "Genre"
  }],
  status: { type: String }

});


// Virtual for this model's URL
ArtistSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/artist/${this._id}`;
});

// Virtual for discogs URL
ArtistSchema.virtual("discogs_url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `https://www.discogs.com/artist/${this.discogs_id}`;
  });


// Export model
module.exports = mongoose.model("Artist", ArtistSchema);
