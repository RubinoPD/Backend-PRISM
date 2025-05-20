const mongoose = require("mongoose");

const soldierSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  militaryRank: {
    type: String,
    required: true,
    trim: true,
  },
  joinDate: {
    type: Date,
    required: true,
  },
  primaryUnit: {
    type: String,
    required: true,
    enum: [
      "Paramos burys",
      "Rysiu ir informaciniu sistemu burys",
      "Valdymo grupe",
    ],
  },
  subUnit: {
    type: String,
    required: function () {
      return this.primaryUnit === "Rysiu ir informaciniu sistemu burys";
    },
    enum: [
      "RIS burys",
      "LAN/WAN skyrius",
      "Videotelekonferencijos skyrius",
      "Laidinio rysio skyrius",
      "Kompiuteriniui tinklu skyrius",
      "1 rysiu skyrius",
      "2 rysiu skyrius",
      "Vartotoju aptarnavimo skyrius",
    ],
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Soldier", soldierSchema);
