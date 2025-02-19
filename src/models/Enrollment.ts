import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

class Enrollment extends Model {
  public id!: number;
  public user_id!: number;
  public course_id!: number;
  public pg_order_id!: string;
  public enrollment_type!: "active" | "inactive" | "expired" | "grace";
  public start_date!: Date;
  public end_date!: Date;
  public payment_status!: "success" | "failed" | "pending";
  public auto_renewal!: boolean;
}

Enrollment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pg_order_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    enrollment_type: {
      type: DataTypes.ENUM("active", "inactive", "expired", "grace"),
      allowNull: false,
      defaultValue: "inactive",
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    payment_status: {
      type: DataTypes.ENUM("success", "failed", "pending"),
      allowNull: false,
      defaultValue: "pending",
    },
    auto_renewal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Determines if the user enabled auto-payments
    },
  },
  {
    sequelize,
    tableName: "enrollments",
    modelName: "Enrollment",
    timestamps: true,
  }
);

export default Enrollment;
