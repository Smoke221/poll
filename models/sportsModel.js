const mongoose = require("mongoose");

const sportsSchema = new mongoose.Schema({
  h5: {
    type: String,
    required: true,
  },
  p: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
});

const SportsData = mongoose.model("sports_toi", sportsSchema);


module.exports = { SportsData };
