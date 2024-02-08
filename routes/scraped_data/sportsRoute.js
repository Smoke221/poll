const express = require("express");
const { cricketData } = require("../../controllers/sports");

const sportsRouter = express.Router();

sportsRouter.get("/", cricketData)

module.exports = { sportsRouter };
