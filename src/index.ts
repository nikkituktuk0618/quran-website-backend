import express from "express";
import { sequelize } from "./config/database";
import routes from "./routes";
import { User, Course, Playlist, Video, Enrollment, Payment } from "./models";
const cron = require("node-cron");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1", routes);

cron.schedule("*/1 * * * *", async () => {
  console.log("Executing API call at:", new Date().toISOString());

  try {
    const response = await axios.get(
      "https://quran-website-backend.onrender.com/api/v1/ping"
    );
    console.log("API Response:", response.data);
  } catch (error: any) {
    console.error("Error calling API:", error.message);
  }
});
// Database Connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    await User.sync({ alter: true });
    await Course.sync({ alter: true });
    await Playlist.sync({ alter: true });
    await Video.sync({ alter: true });
    await Enrollment.sync({ alter: true });
    await Payment.sync({ alter: true });
    console.log("Tables Synchronised......");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
