// src/models/Video.ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import Playlist from "./Playlist";

class Video extends Model {
  public id!: number;
  public playlist_id!: number;
  public title!: string;
  public video_url!: string;
  public video_order!: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Video.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    playlist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Playlist,
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    video_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    video_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "videos",
    modelName: "Video",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["playlist_id", "video_order"], // Enforces uniqueness within a playlist
      },
    ],
  }
);

export default Video;
