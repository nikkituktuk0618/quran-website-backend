import express from "express";
import { sequelize } from "./config/database";
import routes from "./routes";
import { User, Course, Playlist, Video, Enrollment, Payment } from "./models";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1", routes);

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
