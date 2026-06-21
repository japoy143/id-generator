"use client";

import React, { useRef } from "react";
import Image from "next/image";

interface Props {
  label: string;
  value: string | null;
  onChange: (dataUrl: string) => void;
}

export default function FrameUpload({ label, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) onChange(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-1.5">{label}</p>
      <div
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
          ${value ? "border-gray-300 bg-gray-50" : "border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-white"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
        {value ? (
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-24 h-36 rounded overflow-hidden border border-gray-200 shadow-sm">
              <Image
                src={value}
                alt={label}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <span className="text-xs text-blue-600 font-medium">
              Click to replace
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4">
            <svg
              className="w-8 h-8 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            <span className="text-sm text-gray-400">
              Click to upload {label.toLowerCase()}
            </span>
            <span className="text-xs text-gray-300">PNG, JPG supported</span>
          </div>
        )}
      </div>
    </div>
  );
}
