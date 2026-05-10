"use client";

import React, { useEffect, useMemo, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  gender: string;
  gradeLevel: string;
  department: string;
  phone: string;
  address: string;
  status: string;
}

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  age: "",
  gender: "",
  gradeLevel: "",
  department: "",
  phone: "",
  address: "",
  status: "active",
};

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchStudents() {
    try {
      const res = await fetch("/api/students");
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to fetch students");
        return;
      }

      setStudents(data.students);
    } catch {
      setMessage("Something went wrong while fetching students.");
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e:React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const payload = {
      ...formData,
      age: Number(formData.age),
    };

    const url = editingId ? `/api/students/${editingId}` : "/api/students";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Request failed");
        return;
      }

      setMessage(editingId ? "Student updated successfully." : "Student created successfully.");
      setFormData(emptyForm);
      setEditingId(null);
      fetchStudents();
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(student:Student) {
    setEditingId(student._id);

    setFormData({
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      email: student.email || "",
      age: student.age.toString(),
      gender: student.gender || "",
      gradeLevel: student.gradeLevel || "",
      department: student.department || "",
      phone: student.phone || "",
      address: student.address || "",
      status: student.status || "active",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(id:string) {
    const confirmed = confirm("Are you sure you want to delete this student?");

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Delete failed");
        return;
      }

      setMessage("Student deleted successfully.");
      fetchStudents();
    } catch {
      setMessage("Something went wrong while deleting student.");
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setFormData(emptyForm);
    setMessage("");
  }

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const fullText = `
        ${student.firstName}
        ${student.lastName}
        ${student.email}
        ${student.gradeLevel}
        ${student.department}
        ${student.status}
      `.toLowerCase();

      return fullText.includes(search.toLowerCase());
    });
  }, [students, search]);

  return (
    <main className="min-h-screen px-6 py-10">
      <ThemeToggle />

      <section className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p
            className="mb-4 inline-flex rounded-full px-4 py-2 text-sm font-bold"
            style={{
              background: "var(--accent-soft)",
              color: "var(--accent)",
            }}
          >
            Backend Project 2
          </p>

          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            Student Records API
          </h1>

          <p className="mt-4 text-lg" style={{ color: "var(--muted)" }}>
            A full CRUD student management system built with Next.js API routes,
            MongoDB, Mongoose, and Tailwind CSS.
          </p>
        </div>

        {message && (
          <div
            className="mb-6 rounded-2xl border p-4 font-semibold"
            style={{
              background: "var(--accent-soft)",
              borderColor: "var(--card-border)",
            }}
          >
            {message}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-4xl border p-6 shadow-2xl backdrop-blur-xl"
            style={{
              background: "var(--card)",
              borderColor: "var(--card-border)",
            }}
          >
            <h2 className="text-2xl font-black">
              {editingId ? "Edit Student" : "Add Student"}
            </h2>

            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              Fill in the student information below.
            </p>

            <div className="mt-6 grid gap-4">
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="rounded-xl border p-3 outline-none"
                style={{
                  background: "var(--input)",
                  borderColor: "var(--input-border)",
                  color: "var(--foreground)",
                }}
              />

              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="rounded-xl border p-3 outline-none"
                style={{
                  background: "var(--input)",
                  borderColor: "var(--input-border)",
                  color: "var(--foreground)",
                }}
              />

              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className="rounded-xl border p-3 outline-none"
                style={{
                  background: "var(--input)",
                  borderColor: "var(--input-border)",
                  color: "var(--foreground)",
                }}
              />

              <input
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                className="rounded-xl border p-3 outline-none"
                style={{
                  background: "var(--input)",
                  borderColor: "var(--input-border)",
                  color: "var(--foreground)",
                }}
              />

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="rounded-xl border p-3 outline-none"
                style={{
                  background: "var(--input)",
                  borderColor: "var(--input-border)",
                  color: "var(--foreground)",
                }}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <input
                name="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleChange}
                placeholder="Grade level, e.g. Grade 10"
                className="rounded-xl border p-3 outline-none"
                style={{
                  background: "var(--input)",
                  borderColor: "var(--input-border)",
                  color: "var(--foreground)",
                }}
              />

              <input
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Department, e.g. Science"
                className="rounded-xl border p-3 outline-none"
                style={{
                  background: "var(--input)",
                  borderColor: "var(--input-border)",
                  color: "var(--foreground)",
                }}
              />

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                className="rounded-xl border p-3 outline-none"
                style={{
                  background: "var(--input)",
                  borderColor: "var(--input-border)",
                  color: "var(--foreground)",
                }}
              />

              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="rounded-xl border p-3 outline-none"
                style={{
                  background: "var(--input)",
                  borderColor: "var(--input-border)",
                  color: "var(--foreground)",
                }}
              />

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="rounded-xl border p-3 outline-none"
                style={{
                  background: "var(--input)",
                  borderColor: "var(--input-border)",
                  color: "var(--foreground)",
                }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="graduated">Graduated</option>
              </select>

              <button
                disabled={loading}
                className="rounded-xl px-5 py-3 font-black text-white shadow-lg transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: "var(--primary)" }}
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Student"
                  : "Create Student"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-xl border px-5 py-3 font-bold"
                  style={{
                    borderColor: "var(--card-border)",
                    color: "var(--foreground)",
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          <div
            className="rounded-[2rem] border p-6 shadow-2xl backdrop-blur-xl"
            style={{
              background: "var(--card)",
              borderColor: "var(--card-border)",
            }}
          >
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-black">Student List</h2>
                <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                  Total records: {students.length}
                </p>
              </div>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students..."
                className="w-full rounded-xl border p-3 outline-none md:w-72"
                style={{
                  background: "var(--input)",
                  borderColor: "var(--input-border)",
                  color: "var(--foreground)",
                }}
              />
            </div>

            <div className="grid gap-4">
              {filteredStudents.length === 0 ? (
                <div
                  className="rounded-2xl border p-8 text-center font-semibold"
                  style={{
                    borderColor: "var(--card-border)",
                    color: "var(--muted)",
                  }}
                >
                  No students found.
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <div
                    key={student._id}
                    className="rounded-2xl border p-5"
                    style={{
                      background: "var(--input)",
                      borderColor: "var(--card-border)",
                    }}
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-xl font-black">
                          {student.firstName} {student.lastName}
                        </h3>

                        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                          {student.email}
                        </p>

                        <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
                          <p>
                            <strong>Age:</strong> {student.age}
                          </p>
                          <p>
                            <strong>Gender:</strong> {student.gender}
                          </p>
                          <p>
                            <strong>Grade:</strong> {student.gradeLevel}
                          </p>
                          <p>
                            <strong>Department:</strong> {student.department}
                          </p>
                          <p>
                            <strong>Status:</strong> {student.status}
                          </p>
                          <p>
                            <strong>Phone:</strong> {student.phone || "N/A"}
                          </p>
                        </div>

                        {student.address && (
                          <p className="mt-2 text-sm">
                            <strong>Address:</strong> {student.address}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(student)}
                          className="rounded-xl px-4 py-2 text-sm font-bold text-white"
                          style={{ background: "var(--primary)" }}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(student._id)}
                          className="rounded-xl px-4 py-2 text-sm font-bold text-white"
                          style={{ background: "var(--danger)" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}