export interface Student {
  id: string;
  name: string;
  lrn: string;
  grade: string;
  dob: string;
  address: string;
  parent: string;
  contact: string;
  adviser: string;
  photo: string | null;
}

export type StudentField = keyof Omit<Student, "id" | "photo">;

export const FONT_OPTIONS = [
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  {
    label: "Adobe Garamond",
    value:
      "'Adobe Garamond Pro', 'EB Garamond', Garamond, 'Times New Roman', serif",
  },
  { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
  { label: "Georgia", value: "Georgia, 'Times New Roman', serif" },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Tahoma", value: "Tahoma, Geneva, sans-serif" },
  { label: "Calibri", value: "Calibri, 'Trebuchet MS', sans-serif" },
  { label: "Century Gothic", value: "'Century Gothic', Futura, sans-serif" },
  {
    label: "Palatino",
    value: "'Palatino Linotype', Palatino, 'Book Antiqua', serif",
  },
] as const;

export type FontValue = (typeof FONT_OPTIONS)[number]["value"];

export interface TextFieldConfig {
  id: string;
  field: StudentField;
  label: string;
  side: "front" | "back";
  left: number;
  top: number;
  width: number;
  height: number;
  fontSize: number; // pt
  bold: boolean;
  align: "left" | "center" | "right";
  uppercase: boolean;
  fontFamily: string; // CSS font-family stack
}

export interface CardSettings {
  cardWidth: number;
  cardHeight: number;
  photoLeft: number;
  photoTop: number;
  photoWidth: number;
  photoHeight: number;
  textFields: TextFieldConfig[];
  cardGap: number; // gap between cards in inches
}

export const STUDENT_FIELDS: StudentField[] = [
  "name",
  "lrn",
  "grade",
  "dob",
  "address",
  "parent",
  "contact",
  "adviser",
];

function tf(
  field: StudentField,
  label: string,
  side: "front" | "back",
  left: number,
  top: number,
  width: number,
  height: number,
  opts: Partial<TextFieldConfig> = {},
): TextFieldConfig {
  return {
    id: `${side}-${field}`,
    field,
    label,
    side,
    left,
    top,
    width,
    height,
    fontSize: 9,
    bold: false,
    align: "center",
    uppercase: false,
    fontFamily: "Arial, Helvetica, sans-serif",
    ...opts,
  };
}

export const DEFAULT_TEXT_FIELDS: TextFieldConfig[] = [
  tf("name", "Name", "front", 8, 58, 84, 6, { bold: true, fontSize: 10 }),
  tf("lrn", "LRN", "front", 8, 67.5, 84, 6),
  tf("grade", "Grade & Section", "front", 8, 77, 84, 6),

  tf("dob", "Date of Birth", "back", 8, 17, 84, 6),
  tf("address", "Address", "back", 8, 26.5, 84, 8),
  tf("parent", "Parent / Guardian", "back", 8, 45.5, 84, 6),
  tf("contact", "Contact Number", "back", 8, 54.5, 84, 6),
  tf("adviser", "Adviser", "back", 8, 71, 84, 6),
];

export const DEFAULT_SETTINGS: CardSettings = {
  cardWidth: 2.125,
  cardHeight: 3.375,
  photoLeft: 60,
  photoTop: 18,
  photoWidth: 32,
  photoHeight: 30,
  textFields: DEFAULT_TEXT_FIELDS,
  cardGap: 0.1,
};

export const CSV_HEADERS = [
  "Name",
  "LRN",
  "Grade & Section",
  "Date of Birth",
  "Address",
  "Parent / Guardian",
  "Contact Number",
  "Adviser",
];
