import { nanoid } from "./nanoid";
import { Student, CSV_HEADERS } from "./types";

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else if (char === "\r") {
      // skip carriage returns (Windows line endings)
    } else {
      current += char;
    }
  }

  fields.push(current.trim());
  return fields;
}

export function parseCSV(text: string): Student[] {
  const lines = text.split("\n").filter((l) => l.trim());
  if (lines.length < 2) return [];

  const header = parseCSVLine(lines[0]).map((h) => h.toLowerCase());

  const colIndex = (names: string[]) =>
    names.map((n) => header.indexOf(n.toLowerCase())).find((i) => i >= 0) ?? -1;

  const col = (row: string[], names: string[]) => {
    const i = colIndex(names);
    return i >= 0 ? (row[i] ?? "").trim() : "";
  };

  const students: Student[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    const student: Student = {
      id: nanoid(),
      name: col(row, ["name"]),
      lrn: col(row, ["lrn"]),
      grade: col(row, ["grade & section", "grade", "section"]),
      dob: col(row, ["date of birth", "dob"]),
      address: col(row, ["address"]),
      parent: col(row, [
        "parent / guardian",
        "parent/guardian",
        "parent",
        "guardian",
      ]),
      contact: col(row, ["contact number", "contact"]),
      adviser: col(row, ["adviser"]),
      photo: null,
    };
    if (Object.values(student).some((v) => v && v !== student.id)) {
      students.push(student);
    }
  }

  return students;
}

export function downloadCSVTemplate() {
  const example = `Juan dela Cruz,123456789012,Grade 11 - STEM A,2008-01-15,"#205 E. Rodriguez Sr. Ave., Brgy Damayang Lagi, QC",Maria dela Cruz,09171234567,Mr. Santos`;
  const csv = [CSV_HEADERS.join(","), example].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "id_students_template.csv";
  a.click();
  URL.revokeObjectURL(url);
}
