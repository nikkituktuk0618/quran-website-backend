// src/services/video.service.ts
import Video from "../models/Video";
import { Op } from "sequelize";

export const createVideoService = async (data: any) => {
  const exists = await Video.findOne({
    where: { playlist_id: data.playlist_id, video_order: data.video_order },
  });
  if (exists) {
    throw new Error("Video order must be unique for the playlist");
  }
  return await Video.create(data);
};

export const updateVideoService = async (id: number, data: any) => {
  const video = await Video.findByPk(id);
  if (!video) throw new Error("Video not found");

  if (data.video_order !== undefined) {
    const exists = await Video.findOne({
      where: {
        playlist_id: video.playlist_id,
        video_order: data.video_order,
        id: { [Op.ne]: id },
      },
    });

    if (exists) {
      throw new Error("Video order must be unique for the playlist");
    }
  }
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
