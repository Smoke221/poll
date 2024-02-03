const express = require("express");
const { connection } = require("./configs/db");
const cors = require("cors");
const { pollRouter } = require("./routes/adminRoute");

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(`
          <h1>Welcome to the poll.</h1>
    `);
});

app.use("/polls", pollRouter)

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
