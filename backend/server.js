const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const historySchema = new mongoose.Schema(
  {
    customer: {
      type: String,
      required: true
    },

    jcbNumber: {
      type: String,
      required: true
    },

    hours: {
      type: Number,
      required: true
    },

    rate: {
      type: Number,
      required: true
    },

    diesel: {
      type: Number,
      default: 0
    },

    workAmount: {
      type: Number,
      required: true
    },

    finalAmount: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const History = mongoose.model("History", historySchema);

app.get("/", (req, res) => {
  res.send("JCB Backend is running");
});

app.post("/history", async (req, res) => {
  try {
    const newHistory = new History({
      customer: req.body.customer,
      jcbNumber: req.body.jcbNumber,
      hours: req.body.hours,
      rate: req.body.rate,
      diesel: req.body.diesel,
      workAmount: req.body.workAmount,
      finalAmount: req.body.finalAmount
    });

    const savedHistory = await newHistory.save();

    res.status(201).json({
      message: "History saved successfully",
      data: savedHistory
    });
  } catch (error) {
    console.error("Save error:", error);

    res.status(500).json({
      message: "History save failed",
      error: error.message
    });
  }
});

app.get("/history", async (req, res) => {
  try {
    const history = await History
      .find()
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    console.error("Fetch error:", error);

    res.status(500).json({
      message: "History fetch failed",
      error: error.message
    });
  }
});

app.delete("/history", async (req, res) => {
  try {
    await History.deleteMany({});

    res.json({
      message: "History cleared successfully"
    });
  } catch (error) {
    console.error("Delete error:", error);

    res.status(500).json({
      message: "History clear failed",
      error: error.message
    });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });
  })
  .catch((error) => {
    console.log(
      "MongoDB connection error:",
      error.message
    );
  });