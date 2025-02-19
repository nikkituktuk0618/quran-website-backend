import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

class Payment extends Model {
  public id!: number;
  public enrollment_id!: number;
  public pg_order_id!: string;
  public payment_amount!: number;
  public payment_status!: "success" | "failed" | "pending";
  public pg_transaction_id!: string;
  public payment_date!: Date;
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    enrollment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pg_order_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payment_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.ENUM("success", "failed", "pending"),
      allowNull: false,
      defaultValue: "pending",
    },
    pg_transaction_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Payment",
    tableName: "payments",
    timestamps: false,
  }
);

export default Payment;
