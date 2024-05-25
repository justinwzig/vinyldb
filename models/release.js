const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReleaseSchema = new Schema({
  title: { type: String, required: true },
  artist: { type: Schema.ObjectId, ref: "Artist", required: true },
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
  genre: [{ type: Schema.ObjectId, ref: "Genre" }],
});

// Virtual for this release instance URL.
ReleaseSchema.virtual("url").get(function () {
  return "/catalog/release/" + this._id;
});

// Export model.
module.exports = mongoose.model("Release", ReleaseSchema);
