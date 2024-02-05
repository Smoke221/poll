const express = require("express");
const { Poll } = require("../models/pollModel");

const pollRouter = express.Router();

pollRouter.post("/", async (req, res) => {
  try {
    const { question, options } = req.body;
    const newPoll = await Poll.create({ question, options });
    res.status(201).json({ message: "Poll created." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

pollRouter.get("/", async (req, res) => {
  try {
    const polls = await Poll.find();
    res.status(200).json(polls);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

pollRouter.post("/:pollId/vote", async (req, res) => {
  try {
    const pollId = req.params.pollId;
    const { optionIndex } = req.body;
    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ error: "Invalid option index" });
    }

    poll.options[optionIndex].votes += 1;
    await poll.save();

    res.status(200).json({ message: "Vote registered." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

pollRouter.get("/vote/count/:pollId", async (req, res) => {
  try {
    const pollId = req.params.pollId;
    const isValidPoll = await Poll.findById(pollId);

    if (!isValidPoll) {
      res.status(404).json({ message: "No poll found." });
    }

    let totalVotes = isValidPoll.options.reduce(
      (acc, option) => acc + option.votes,
      0
    );

    res.status(200).json({ totalVotes });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

pollRouter.delete("/remove/:pollId", async (req, res) => {
  try {
    const pollId = req.params.pollId;
    const isValidPoll = await Poll.findById(pollId);

    if (!isValidPoll) {
      res.status(404).json({ message: "No poll found." });
    }

    await Poll.findByIdAndDelete(pollId);
    res.status(200).json({ message: "Poll deleted." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { pollRouter };
