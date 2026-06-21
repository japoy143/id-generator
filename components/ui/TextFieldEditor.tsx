"use client";

import {
  CardSettings,
  TextFieldConfig,
  STUDENT_FIELDS,
  StudentField,
  FONT_OPTIONS,
} from "@/lib/types";
import { nanoid } from "@/lib/nanoid";

interface Props {
  side: "front" | "back";
  settings: CardSettings;
  onChange: (fields: TextFieldConfig[]) => void;
}

const FIELD_LABELS: Record<StudentField, string> = {
  name: "Name",
  lrn: "LRN",
  grade: "Grade & Section",
  dob: "Date of Birth",
  address: "Address",
  parent: "Parent / Guardian",
  contact: "Contact Number",
  adviser: "Adviser",
};

export default function TextFieldEditor({ side, settings, onChange }: Props) {
  const fields = settings.textFields.filter((f) => f.side === side);
  const others = settings.textFields.filter((f) => f.side !== side);

  function update(id: string, patch: Partial<TextFieldConfig>) {
    onChange([
      ...others,
      ...fields.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    ]);
  }

  function remove(id: string) {
    onChange([...others, ...fields.filter((f) => f.id !== id)]);
  }

  function add() {
    const used = new Set(fields.map((f) => f.field));
    const next = STUDENT_FIELDS.find((f) => !used.has(f)) ?? STUDENT_FIELDS[0];
    onChange([
      ...others,
      ...fields,
      {
        id: nanoid(),
        field: next,
        label: FIELD_LABELS[next],
        side,
        left: 10,
        top: 10,
        width: 80,
        height: 6,
        fontSize: 9,
        bold: false,
        align: "center",
        uppercase: false,
        fontFamily: "Arial, Helvetica, sans-serif",
      },
    ]);
  }

  return (
    <div className="space-y-3">
      {/* Column headers */}
      {fields.length > 0 && (
        <div className="grid grid-cols-12 gap-2 px-2">
          <span className="col-span-3 text-[10px] text-gray-400 font-medium">
            Field
          </span>
          <span className="col-span-1 text-[10px] text-gray-400 font-medium text-center">
            L%
          </span>
          <span className="col-span-1 text-[10px] text-gray-400 font-medium text-center">
            T%
          </span>
          <span className="col-span-1 text-[10px] text-gray-400 font-medium text-center">
            W%
          </span>
          <span className="col-span-1 text-[10px] text-gray-400 font-medium text-center">
            H%
          </span>
          <span className="col-span-1 text-[10px] text-gray-400 font-medium text-center">
            pt
          </span>
          <span className="col-span-2 text-[10px] text-gray-400 font-medium">
            Font
          </span>
          <span className="col-span-1 text-[10px] text-gray-400 font-medium text-center">
            Aln
          </span>
          <span className="col-span-1 text-[10px] text-gray-400 font-medium text-center">
            B
          </span>
        </div>
      )}

      {fields.map((f) => (
        <div
          key={f.id}
          className="bg-white border border-gray-100 rounded-lg p-2 space-y-2"
        >
          <div className="grid grid-cols-12 gap-2 items-center">
            {/* Field selector */}
            <select
              value={f.field}
              onChange={(e) =>
                update(f.id, {
                  field: e.target.value as StudentField,
                  label: FIELD_LABELS[e.target.value as StudentField],
                })
              }
              className="col-span-3 text-xs border border-gray-200 rounded px-1.5 py-1"
            >
              {STUDENT_FIELDS.map((sf) => (
                <option key={sf} value={sf}>
                  {FIELD_LABELS[sf]}
                </option>
              ))}
            </select>

            {/* Position / size inputs: L, T, W, H */}
            {(["left", "top", "width", "height"] as const).map((k) => (
              <input
                key={k}
                type="number"
                value={f[k]}
                onChange={(e) =>
                  update(f.id, { [k]: parseFloat(e.target.value) || 0 })
                }
                title={k}
                className="col-span-1 text-xs border border-gray-200 rounded px-1 py-1 text-center"
              />
            ))}

            {/* Font size (pt) */}
            <input
              type="number"
              value={f.fontSize}
              min={4}
              max={72}
              onChange={(e) =>
                update(f.id, { fontSize: parseFloat(e.target.value) || 9 })
              }
              title="Font size in pt"
              className="col-span-1 text-xs border border-gray-200 rounded px-1 py-1 text-center"
            />

            {/* Font family */}
            <select
              value={f.fontFamily || "Arial, Helvetica, sans-serif"}
              onChange={(e) => update(f.id, { fontFamily: e.target.value })}
              title="Font family"
              className="col-span-2 text-xs border border-gray-200 rounded px-1 py-1"
            >
              {FONT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Alignment */}
            <select
              value={f.align}
              onChange={(e) =>
                update(f.id, {
                  align: e.target.value as TextFieldConfig["align"],
                })
              }
              className="col-span-1 text-xs border border-gray-200 rounded px-1 py-1"
            >
              <option value="left">L</option>
              <option value="center">C</option>
              <option value="right">R</option>
            </select>

            {/* Bold */}
            <label className="col-span-1 text-xs flex items-center justify-center gap-0.5 cursor-pointer">
              <input
                type="checkbox"
                checked={f.bold}
                onChange={(e) => update(f.id, { bold: e.target.checked })}
                className="accent-gray-700"
              />
              <span className="font-bold">B</span>
            </label>
          </div>

          {/* Font preview + remove */}
          <div className="flex items-center justify-between px-0.5">
            <span
              className="text-[11px] text-gray-500 truncate max-w-[70%]"
              style={{ fontFamily: f.fontFamily || "Arial, sans-serif" }}
            >
              {f.label} preview — {f.fontSize}pt
            </span>
            <button
              onClick={() => remove(f.id)}
              title="Remove field"
              className="text-[10px] text-red-400 hover:text-red-600 transition-colors shrink-0"
            >
              ✕ remove
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={add}
        className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        + Add Text Field
      </button>
    </div>
  );
}
