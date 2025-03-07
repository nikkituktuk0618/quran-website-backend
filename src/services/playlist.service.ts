// src/services/playlist.service.ts
import Playlist from "../models/Playlist";
import { Op } from "sequelize";

export const createPlaylistService = async (data: any) => {
  const exists = await Playlist.findOne({
    where: { course_id: data.course_id, playlist_order: data.playlist_order },
  });
  if (exists) {
    throw new Error("Playlist order must be unique for the course");
  }
  return await Playlist.create(data);
};

export const updatePlaylistService = async (id: number, data: any) => {
  const playlist = await Playlist.findByPk(id);
  if (!playlist) throw new Error("Playlist not found");
  if (data.playlist_order !== undefined) {
    const exists = await Playlist.findOne({
      where: {
        course_id: playlist.course_id,
        playlist_order: data.playlist_order,
        id: { [Op.ne]: id }, // Ensure it's not checking against itself
      },
    });

    if (exists) {
      throw new Error("Playlist order must be unique for the course");
    }
  }
  await playlist.update(data);
  return playlist;
};

export const deletePlaylistService = async (id: number) => {
  const playlist = await Playlist.findByPk(id);
  if (!playlist) throw new Error("Playlist not found");

  await playlist.destroy();
  return "Playlist deleted successfully";
};

export const getPlaylistsByCourseService = async (course_id: number) => {
  return await Playlist.findAll({ where: { course_id } });
};
