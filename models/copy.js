const mongoose = require("mongoose");
const { DateTime } = require("luxon"); //for date handling

const Schema = mongoose.Schema;

const CopySchema = new Schema({
  record: { type: Schema.ObjectId, ref: "Record", required: true }, // Reference to the associated record.
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Available", "Maintenance", "Loaned", "Reserved"],
    default: "Maintenance",
  },
  due_back: { type: Date, default: Date.now },
});

// Virtual for this copy object's URL.
CopySchema.virtual("url").get(function () {
  return "/catalog/copy/" + this._id;
});

CopySchema.virtual("due_back_formatted").get(function () {
  return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

CopySchema.virtual("due_back_yyyy_mm_dd").get(function () {
  return DateTime.fromJSDate(this.due_back).toISODate(); //format 'YYYY-MM-DD'
});

// Export model.
module.exports = mongoose.model("Copy", CopySchema);
