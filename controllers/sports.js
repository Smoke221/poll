const { SportsData } = require("../models/sportsModel");

async function cricketData(req, res) {
  try {
    const top3SportsData = await SportsData.find();
    if (!top3SportsData) {
      return res
        .status(404)
        .json({ message: "No information found at the moment" });
    }
    res
      .status(200)
      .json({ message: "Data retrived", sports_data: top3SportsData });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

module.exports = { cricketData };
