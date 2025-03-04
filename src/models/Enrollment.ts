import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

class Enrollment extends Model {
  public id!: number;
  public user_id!: number;
  public course_id!: number;
  public pg_order_id!: string | null;
  public subscription_id!: string | null;
  public enrollment_type!: "active" | "inactive" | "expired" | "grace";
  public start_date!: Date;
  public end_date!: Date;
  public next_billing_date!: Date | null;
  public remaining_cycles!: number | null;
  public payment_status!: "success" | "pending" | "failed";
  public razorpay_status!:
    | "created"
    | "authenticated"
    | "active"
    | "pending"
    | "halted"
    | "cancelled"
    | "paused"
    | "expired"
    | "completed"
    | "attempted";

  public auto_renewal!: boolean;
  public grace_period_end!: Date | null;
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
      allowNull: true,
    },
    subscription_id: {
      type: DataTypes.STRING,
      allowNull: true,
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
    next_billing_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    payment_status: {
      type: DataTypes.ENUM("success", "pending", "failed"),
      allowNull: false,
      defaultValue: "pending",
    },
    razorpay_status: {
      type: DataTypes.ENUM(
        "created",
        "authenticated",
        "active",
        "pending",
        "halted",
        "cancelled",
        "paused",
        "expired",
        "completed",
        "attempted"
      ),
      allowNull: false,
      defaultValue: "pending",
    },
    remaining_cycles: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
