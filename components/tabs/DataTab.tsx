"use client";

import React, { useRef } from "react";
import { Student } from "@/lib/types";
import { parseCSV, downloadCSVTemplate } from "@/lib/csv";
import { nanoid } from "@/lib/nanoid";
import StudentRow from "../students/StudentRow";

interface Props {
  students: Student[];
  onChange: (students: Student[]) => void;
  onNext: () => void;
}

export default function DataTab({ students, onChange, onNext }: Props) {
  const csvRef = useRef<HTMLInputElement>(null);

  function addStudent() {
    onChange([
      ...students,
      {
        id: nanoid(),
        name: "",
        lrn: "",
        grade: "",
        dob: "",
        address: "",
        parent: "",
        contact: "",
        adviser: "",
        photo: null,
      },
    ]);
  }

  function removeStudent(index: number) {
    onChange(students.filter((_, i) => i !== index));
  }

  function updateStudent(index: number, field: keyof Student, value: string) {
    const updated = [...students];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  }

  function updatePhoto(index: number, dataUrl: string) {
    const updated = [...students];
    updated[index] = { ...updated[index], photo: dataUrl };
    onChange(updated);
  }

  function handleCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        const parsed = parseCSV(ev.target.result as string);
        onChange([...students, ...parsed]);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function clearAll() {
    if (window.confirm("Clear all student data?")) onChange([]);
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={addStudent}
          className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Student
        </button>

        <button
          onClick={() => csvRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          Import CSV
        </button>
        <input
          ref={csvRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleCSV}
        />

        <button
          onClick={downloadCSVTemplate}
          className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          CSV Template
        </button>

        {students.length > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-2 text-sm border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors ml-auto"
          >
            Clear All
          </button>
        )}

        <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full ml-1">
          {students.length} student{students.length !== 1 ? "s" : ""}
        </span>
      </div>

      <p className="text-xs text-gray-400">
        CSV columns: Name, LRN, Grade &amp; Section, Date of Birth, Address,
        Parent / Guardian, Contact Number, Adviser
      </p>

      {/* Student rows */}
      {students.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <svg
            className="w-10 h-10 mx-auto mb-3 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
          </svg>
          <p className="text-sm font-medium">No students yet</p>
          <p className="text-xs mt-1">
            Add students manually or import a CSV file
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {students.map((s, i) => (
            <StudentRow
              key={s.id}
              student={s}
              index={i}
              onChange={(field, value) => updateStudent(i, field, value)}
              onRemove={() => removeStudent(i)}
              onPhotoChange={(url) => updatePhoto(i, url)}
            />
          ))}
        </div>
      )}

      {students.length > 0 && (
        <div className="flex gap-3 pt-2">
          <button
            onClick={addStudent}
            className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            + Add Another
          </button>
          <button
            onClick={onNext}
            className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Go to Print Preview →
          </button>
        </div>
      )}
    </div>
  );
}
