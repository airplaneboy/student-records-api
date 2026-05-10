import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [3, "Age must be at least 3"],
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Gender is required"],
    },

    gradeLevel: {
      type: String,
      required: [true, "Grade level is required"],
      trim: true,
    },

    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "graduated"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;