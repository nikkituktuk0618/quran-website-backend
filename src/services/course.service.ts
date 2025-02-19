import Course from "../models/Course";
import  Playlist  from '../models/Playlist';
import  Video  from '../models/Video';

export const createCourse = async (courseData: Partial<Course>) => {
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
            as: 'playlists',
            include: [
              {
                model: Video,
                as: 'videos',
                attributes: ['id', 'title', 'video_url', 'video_order'],
              },
            ],
            attributes: ['id', 'title', 'playlist_order'],
          },
        ],
        attributes: ['id', 'title', 'description', 'fee_amount', 'fee_type'],
      });
  
      if (!course) {
        throw new Error('Course not found');
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

export const deleteCourse = async (id: number) => {
  const course = await Course.findByPk(id);
  if (!course) throw new Error("Course not found");
  await course.destroy();
};
