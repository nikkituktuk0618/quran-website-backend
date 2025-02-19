import { Request, Response } from 'express';
import { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse } from '../services/course.service';

export const createCourseHandler = async (req: Request, res: Response) => {
  try {
    const course = await createCourse(req.body);
    res.status(201).json(course);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCoursesHandler = async (req: Request, res: Response) => {
  try {
    const courses = await getAllCourses();
    res.status(200).json(courses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseByIdHandler = async (req: Request, res: Response): Promise<any> => {
  try {
    const course = await getCourseById(+req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    return res.status(200).json(course);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateCourseHandler = async (req: Request, res: Response) => {
  try {
    const course = await updateCourse(+req.params.id, req.body);
    res.status(200).json(course);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCourseHandler = async (req: Request, res: Response) => {
  try {
    await deleteCourse(+req.params.id);
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
