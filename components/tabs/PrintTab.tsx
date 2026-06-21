"use client";

import React from "react";
import CardPreview from "../ui/CardPreview";
import { Student, CardSettings } from "@/lib/types";
import { buildPrintHTML, triggerPrint } from "@/lib/print";

interface Props {
  students: Student[];
  frontFrame: string | null;
  backFrame: string | null;
  settings: CardSettings;
}

export default function PrintTab({
  students,
  frontFrame,
  backFrame,
  settings,
}: Props) {
  function handlePrint() {
    const html = buildPrintHTML(students, frontFrame, backFrame, settings);
    triggerPrint(html);
  }

  return (
    <div className="space-y-5">
      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm text-amber-800">
        <strong>Printing tip:</strong> Page 1 = all front cards, Page 2 = all
        back cards. Print double-sided using <em>Flip on Short Edge</em> for
        perfectly aligned back-to-back IDs. After printing, cut along the card
        outlines.
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handlePrint}
          disabled={students.length === 0}
          className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium
            hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
              d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.056 48.056 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"
            />
          </svg>
          Print All Cards
        </button>
        <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
          {students.length} card{students.length !== 1 ? "s" : ""}
        </span>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-sm">
            No students to preview. Add data in the Student Data tab.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Front Cards — Page 1
            </h3>
            <div className="flex flex-wrap gap-3">
              {students.map((s, i) => (
                <CardPreview
                  key={s.id}
                  frame={frontFrame}
                  photo={s.photo}
                  student={s}
                  side="front"
                  settings={settings}
                  label={s.name || `Student ${i + 1}`}
                  scale={0.6}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Back Cards — Page 2
            </h3>
            <div className="flex flex-wrap gap-3">
              {students.map((s, i) => (
                <CardPreview
                  key={s.id}
                  frame={backFrame}
                  student={s}
                  side="back"
                  settings={settings}
                  label={s.name || `Student ${i + 1}`}
                  scale={0.6}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
