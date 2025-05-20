const mongoose = require("mongoose");

const structuralUnitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  parentUnit: {
    type: String,
    required: true,
    enum: [
      "Paramos burys",
      "Rysiu ir informaciniu sistemu burys",
      "Valdymo grupe",
    ],
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("StructuralUnit", structuralUnitSchema);
