import { Router } from "express";
import {
  createCourseHandler,
  getAllCoursesHandler,
  getCourseByIdHandler,
  updateCourseHandler,
  deleteCourseHandler,
} from "../controllers/course.controller";
import { authenticate } from "../middlewares/auth.middlewares";
import { authorize } from "../middlewares/authorize";

const router = Router();

// Routes
router.post("/", authenticate, authorize(["admin"]), createCourseHandler); // Create a course
router.get("/", getAllCoursesHandler); // Get all courses
router.get("/:id", authenticate, getCourseByIdHandler); // Get course by ID
router.put("/:id", authenticate, authorize(["admin"]), updateCourseHandler); // Update a course
router.delete("/:id", authenticate, authorize(["admin"]), deleteCourseHandler); // Delete a course

export default router;
