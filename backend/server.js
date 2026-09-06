const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// ===============================
// HISTORY SCHEMA
// ===============================

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

    driverBata: {
      type: Number,
      default: 0
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


// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
  res.send("Chowdeshwari Earth Movers Backend is running");
});


// ===============================
// SAVE HISTORY
// ===============================

app.post("/history", async (req, res) => {
  try {
    const customer = req.body.customer || "N/A";
    const jcbNumber = req.body.jcbNumber || "N/A";

    const hours = Number(req.body.hours) || 0;
    const rate = Number(req.body.rate) || 0;
    const diesel = Number(req.body.diesel) || 0;
    const driverBata = Number(req.body.driverBata) || 0;

    const workAmount = hours * rate;
    const finalAmount = workAmount + driverBata;

    const newHistory = new History({
      customer,
      jcbNumber,
      hours,
      rate,
      diesel,
      workAmount,
      driverBata,
      finalAmount
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


// ===============================
// GET HISTORY
// ===============================

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


// ===============================
// MSG91 OTP VERIFICATION
// ===============================

app.post("/auth/verify", async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: "Access token is required"
      });
    }

    const response = await axios.post(
      "https://control.msg91.com/api/v5/widget/verifyAccessToken",
      {
        authkey: process.env.MSG91_AUTHKEY,
        "access-token": accessToken
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      success: true,
      message: "OTP verified successfully",
      data: response.data
    });

  } catch (error) {
    console.error(
      "MSG91 verification error:",
      error.response?.data || error.message
    );

    res.status(401).json({
      success: false,
      message: "OTP verification failed"
    });
  }
});


// ===============================
// MONGODB CONNECTION
// ===============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(
        "Chowdeshwari Earth Movers server running on port " + PORT
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error.message
    );
  });