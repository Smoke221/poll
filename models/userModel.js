const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    enum: ["self", "github", "google", "facebook"],
    default: "self",
  },
  voted: [
    {
      poll: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Poll",
        required: true,
      },
      answeredIndex: {
        type: Number,
        required: true,
      },
      timeOfVote: {
        type: Date,
        default: Date.now,
      },
    }
  ],
});

const userModel = mongoose.model("user", userSchema);

module.exports = { userModel };
