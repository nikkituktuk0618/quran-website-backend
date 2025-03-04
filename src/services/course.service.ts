import Course from "../models/Course";
import Playlist from "../models/Playlist";
import Video from "../models/Video";
import Enrollment from "../models/Enrollment";
import { createPGPlan } from "../services/subscription.service";

export const createCourse = async (courseData: Partial<Course>) => {
  if (courseData.fee_type === "subscription") {
    courseData.plan_id = await createPGPlan(Number(courseData.fee_amount));
  }
  return await Course.create(courseData);
};

export const getAllCourses = async () => {
  return await Course.findAll();
};

export const getCourseById = async (id: number) => {
  try {
    const course = await Course.findByPk(id, {
      include: [
        {
          model: Playlist,
          as: "playlists",
          include: [
            {
              model: Video,
              as: "videos",
              attributes: ["id", "title", "video_url", "video_order"],
            },
          ],
          attributes: ["id", "title", "playlist_order"],
        },
      ],
      attributes: ["id", "title", "description", "fee_amount", "fee_type"],
    });

    if (!course) {
      throw new Error("Course not found");
    }

    return course;
  } catch (error: any) {
    throw new Error(`Error fetching course: ${error.message}`);
  }
};

export const updateCourse = async (id: number, updates: Partial<Course>) => {
  const course = await Course.findByPk(id);
  if (!course) throw new Error("Course not found");
  return await course.update(updates);
};

export async function deleteCourse(courseId: number) {
  // Check if any user is enrolled in the course
  const enrollmentCount = await Enrollment.count({ where: { courseId } });

  if (enrollmentCount > 0) {
    throw new Error("Course cannot be deleted as users are enrolled.");
  }

  // Delete course and cascade delete playlists and videos
  await Course.destroy({ where: { id: courseId } });

  return { message: "Course deleted successfully." };
}
