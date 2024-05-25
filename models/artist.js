const mongoose = require("mongoose");
const { DateTime } = require("luxon"); // for date handling

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for artist "full" name.
ArtistSchema.virtual("name").get(function () {
  return this.family_name + ", " + this.first_name;
});

// Virtual for this artist instance URL.
ArtistSchema.virtual("url").get(function () {
  return "/catalog/artist/" + this._id;
});

ArtistSchema.virtual("lifespan").get(function () {
  let lifetime_string = "";
  if (this.date_of_birth) {
    lifetime_string = DateTime.fromJSDate(this.date_of_birth).toLocaleString(
      DateTime.DATE_MED
    );
  }
  lifetime_string += " - ";
  if (this.date_of_death) {
    lifetime_string += DateTime.fromJSDate(this.date_of_death).toLocaleString(
      DateTime.DATE_MED
    );
  }
  return lifetime_string;
});

ArtistSchema.virtual("date_of_birth_yyyy_mm_dd").get(function () {
  return DateTime.fromJSDate(this.date_of_birth).toISODate(); // format 'YYYY-MM-DD'
});

ArtistSchema.virtual("date_of_death_yyyy_mm_dd").get(function () {
  return DateTime.fromJSDate(this.date_of_death).toISODate(); // format 'YYYY-MM-DD'
});

// Export model.
module.exports = mongoose.model("Artist", ArtistSchema);
