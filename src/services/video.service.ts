// src/services/video.service.ts
import Video from "../models/Video";

export const createVideoService = async (data: any) => {
  return await Video.create(data);
};

export const updateVideoService = async (id: number, data: any) => {
  const video = await Video.findByPk(id);
  if (!video) throw new Error("Video not found");

  await video.update(data);
  return video;
};

export const deleteVideoService = async (id: number) => {
  const video = await Video.findByPk(id);
  if (!video) throw new Error("Video not found");

  await video.destroy();
  return "Video deleted successfully";
};

export const getVideosByPlaylistService = async (playlist_id: number) => {
  return await Video.findAll({ where: { playlist_id } });
};
