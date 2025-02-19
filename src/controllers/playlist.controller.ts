// src/controllers/playlist.controller.ts
import { Request, Response } from "express";
import {
  createPlaylistService,
  updatePlaylistService,
  deletePlaylistService,
  getPlaylistsByCourseService,
} from "../services/playlist.service";

// Create Playlist
export const createPlaylist = async (req: Request, res: Response) => {
  try {
    const playlist = await createPlaylistService(req.body);
    res.status(201).json({ success: true, playlist });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update Playlist
export const updatePlaylist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const playlist = await updatePlaylistService(Number(id), req.body);
    res.status(200).json({ success: true, playlist });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete Playlist
export const deletePlaylist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const message = await deletePlaylistService(Number(id));
    res.status(200).json({ success: true, message });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Playlists by Course
export const getPlaylistsByCourse = async (req: Request, res: Response) => {
  try {
    const { course_id } = req.params;
    const playlists = await getPlaylistsByCourseService(Number(course_id));
    res.status(200).json({ success: true, playlists });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
