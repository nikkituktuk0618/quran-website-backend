// src/controllers/video.controller.ts
import { Request, Response } from "express";
import {
  createVideoService,
  updateVideoService,
  deleteVideoService,
  getVideosByPlaylistService,
  getVideoByIdService,
} from "../services/video.service";

// Create Video
export const createVideo = async (req: Request, res: Response) => {
  try {
    const video = await createVideoService(req.body);
    res.status(201).json({ success: true, video });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update Video
export const updateVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const video = await updateVideoService(Number(id), req.body);
    res.status(200).json({ success: true, video });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete Video
export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const message = await deleteVideoService(Number(id));
    res.status(200).json({ success: true, message });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Videos by Playlist
export const getVideosByPlaylist = async (req: Request, res: Response) => {
  try {
    const { playlist_id } = req.params;
    const videos = await getVideosByPlaylistService(Number(playlist_id));
    res.status(200).json({ success: true, videos });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getVideoById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const videoId = parseInt(req.params.id);
    if (isNaN(videoId)) {
      return res.status(400).json({ error: "Invalid video ID" });
    }

    const video = await getVideoByIdService(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    res.status(200).json(video);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
