const express = require("express");
const { connection } = require("./configs/db");
const cors = require("cors");
const { pollRouter } = require("./routes/adminRoute");
const { googleRouter } = require("./routes/google-auth");
const requestIp = require("request-ip");
const { getLocationMiddleware } = require("./middlewares/getLocation");
const { authenticate } = require("./middlewares/authenticate");

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());

// Middleware to retrieve user's location
app.use(requestIp.mw());
app.use(getLocationMiddleware);


app.use("/polls", pollRouter)
app.use("/auth/google", googleRouter)

// app.use(authenticate)

app.get("/authorized", (req, res) => {
  res.send(
    `<h1>Congratulations! 🎉</h1><p>You've entered our secure zone. Enjoy your experience!</p>`
  );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (err) {
    console.log(err.message);
  }
  console.log(`Server is running at port ${PORT}`);
});
