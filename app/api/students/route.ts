import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Student from "@/app/models/Student";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();

    const students = await Student.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "Students fetched successfully",
        count: students.length,
        students,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch students",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      age,
      gender,
      gradeLevel,
      department,
      phone,
      address,
      status,
    } = body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !age ||
      !gender ||
      !gradeLevel ||
      !department
    ) {
      return NextResponse.json(
        {
          message:
            "First name, last name, email, age, gender, grade level, and department are required",
        },
        { status: 400 }
      );
    }

    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      return NextResponse.json(
        { message: "Student with this email already exists" },
        { status: 409 }
      );
    }

    const student = await Student.create({
      firstName,
      lastName,
      email,
      age,
      gender,
      gradeLevel,
      department,
      phone,
      address,
      status,
    });

    return NextResponse.json(
      {
        message: "Student created successfully",
        student,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to create student",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}