"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Student } from "@/lib/types";

interface Props {
  student: Student;
  index: number;
  onChange: (field: keyof Student, value: string) => void;
  onRemove: () => void;
  onPhotoChange: (dataUrl: string) => void;
}

const FIELDS: {
  key: keyof Omit<Student, "id" | "photo">;
  label: string;
  placeholder: string;
}[] = [
  { key: "name", label: "Name", placeholder: "Juan dela Cruz" },
  { key: "lrn", label: "LRN", placeholder: "123456789012" },
  { key: "grade", label: "Grade & Section", placeholder: "Grade 11 - STEM A" },
  { key: "dob", label: "Date of Birth", placeholder: "2008-01-15" },
  { key: "address", label: "Address", placeholder: "123 Sample St." },
  { key: "parent", label: "Parent / Guardian", placeholder: "Maria dela Cruz" },
  { key: "contact", label: "Contact Number", placeholder: "09171234567" },
  { key: "adviser", label: "Adviser", placeholder: "Mr. Santos" },
];

export default function StudentRow({
  student,
  index,
  onChange,
  onRemove,
  onPhotoChange,
}: Props) {
  const photoRef = useRef<HTMLInputElement>(null);

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) onPhotoChange(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-700">
          Student #{index + 1}
        </span>
        <button
          onClick={onRemove}
          className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
        >
          Remove
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        {FIELDS.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-xs text-gray-400 mb-1">{label}</label>
            <input
              type="text"
              value={student[key] as string}
              onChange={(e) => onChange(key, e.target.value)}
              placeholder={placeholder}
              className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 placeholder:text-gray-300"
            />
          </div>
        ))}

        {/* Photo upload */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Photo</label>
          <div className="flex items-center gap-2">
            {student.photo ? (
              <div className="relative w-8 h-10 rounded overflow-hidden border border-gray-200 shrink-0">
                <Image
                  src={student.photo}
                  alt="photo"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            ) : (
              <div className="w-8 h-10 rounded bg-gray-100 flex items-center justify-center shrink-0">
                <svg
                  className="w-4 h-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </div>
            )}
            <button
              onClick={() => photoRef.current?.click()}
              className="text-xs px-2 py-1 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 transition-colors whitespace-nowrap"
            >
              {student.photo ? "Change" : "Upload"}
            </button>
            <input
              ref={photoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhoto}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
