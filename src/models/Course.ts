import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import Playlist from "./Playlist";

class Course extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public fee_amount!: number;
  public fee_type!: "one-time" | "Enrollment";
  public created_by!: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Course.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fee_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fee_type: {
      type: DataTypes.ENUM("one-time", "Enrollment"),
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Course",
    tableName: "courses",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Course.hasMany(Playlist, { as: "playlists", foreignKey: "course_id" });
Playlist.belongsTo(Course, { foreignKey: "course_id" });

export default Course;
