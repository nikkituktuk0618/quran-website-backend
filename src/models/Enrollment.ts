import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import Course from "./Course";
import User from "./User";
import Payment from "./Payment";
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
    | "attempted"
    | "captured"
    | "failed";

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
        "attempted",
        "captured",
        "failed"
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
    indexes: [
      {
        unique: true,
        fields: ["user_id", "course_id"], // Enforces uniqueness within a playlist
      },
    ],
  }
);
Enrollment.hasMany(Payment, { foreignKey: "enrollment_id", as: "payments" });
Payment.belongsTo(Enrollment, {
  foreignKey: "enrollment_id",
  as: "enrollment",
});

Enrollment.belongsTo(Course, { foreignKey: "course_id", as: "course" });
Course.hasMany(Enrollment, { foreignKey: "course_id", as: "enrollments" });

Enrollment.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(Enrollment, { foreignKey: "user_id", as: "enrollments" });

export default Enrollment;
