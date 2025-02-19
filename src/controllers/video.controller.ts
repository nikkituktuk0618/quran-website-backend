// src/controllers/video.controller.ts
import { Request, Response } from "express";
import {
  createVideoService,
  updateVideoService,
  deleteVideoService,
  getVideosByPlaylistService,
} from "../services/video.service";

// Create Video
export const createVideo = async (req: Request, res: Response) => {
  try {
    const video = await createVideoService(req.body);
    res.status(201).json({ success: true, video });
  } catch (error:any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update Video
export const updateVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const video = await updateVideoService(Number(id), req.body);
    res.status(200).json({ success: true, video });
  } catch (error:any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete Video
export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const message = await deleteVideoService(Number(id));
    res.status(200).json({ success: true, message });
  } catch (error:any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Videos by Playlist
export const getVideosByPlaylist = async (req: Request, res: Response) => {
  try {
    const { playlist_id } = req.params;
    const videos = await getVideosByPlaylistService(Number(playlist_id));
    res.status(200).json({ success: true, videos });
  } catch (error:any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
