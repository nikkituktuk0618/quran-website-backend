// src/models/Playlist.ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import Course from "./Course";
import Video from "./Video";

class Playlist extends Model {
  public id!: number;
  public course_id!: number;
  public title!: string;
  public playlist_order!: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Playlist.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Course,
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    playlist_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "playlists",
    modelName: "Playlist",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["course_id", "playlist_order"], // Enforces uniqueness within a course
      },
    ],
  }
);

export default Playlist;

Playlist.hasMany(Video, { as: "videos", foreignKey: "playlist_id" });
Video.belongsTo(Playlist, { foreignKey: "playlist_id" });
