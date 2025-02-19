// src/services/playlist.service.ts
import Playlist from "../models/Playlist";

export const createPlaylistService = async (data: any) => {
  return await Playlist.create(data);
};

export const updatePlaylistService = async (id: number, data: any) => {
  const playlist = await Playlist.findByPk(id);
  if (!playlist) throw new Error("Playlist not found");

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
