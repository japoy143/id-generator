"use client";

import Image from "next/image";
import { CardSettings, Student } from "@/lib/types";

interface Props {
  frame: string | null;
  photo?: string | null;
  student?: Student | null;
  side: "front" | "back";
  settings: CardSettings;
  label?: string;
  scale?: number;
}

const PPI = 96;

export default function CardPreview({
  frame,
  photo,
  student,
  side,
  settings,
  label,
  scale = 1,
}: Props) {
  const {
    cardWidth,
    cardHeight,
    photoLeft,
    photoTop,
    photoWidth,
    photoHeight,
    textFields,
  } = settings;

  const pxW = cardWidth * PPI * scale;
  const pxH = cardHeight * PPI * scale;

  const fieldsForSide = textFields.filter((f) => f.side === side);

  return (
    <div className="flex flex-col items-center gap-1">
      {label && (
        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
          {label}
        </span>
      )}
      <div
        className="relative overflow-hidden rounded border border-gray-200 shadow-sm bg-white"
        style={{ width: pxW, height: pxH, minWidth: pxW, minHeight: pxH }}
      >
        {frame ? (
          <Image
            src={frame}
            alt="card frame"
            fill
            style={{ objectFit: "fill" }}
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-[9px] text-gray-400 text-center px-2">
              No frame uploaded
            </span>
          </div>
        )}

        {side === "front" && photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt="student photo"
            className="absolute object-cover object-top"
            style={{
              left: `${photoLeft}%`,
              top: `${photoTop}%`,
              width: `${photoWidth}%`,
              height: `${photoHeight}%`,
            }}
          />
        )}

        {student &&
          fieldsForSide.map((f) => {
            const text = student[f.field] || "";
            return (
              <div
                key={f.id}
                className="absolute flex overflow-hidden leading-tight"
                style={{
                  left: `${f.left}%`,
                  top: `${f.top}%`,
                  width: `${f.width}%`,
                  height: `${f.height}%`,
                  fontSize: `${f.fontSize * scale}pt`,
                  fontWeight: f.bold ? 700 : 400,
                  fontFamily: f.fontFamily || "Arial, Helvetica, sans-serif",
                  justifyContent:
                    f.align === "left"
                      ? "flex-start"
                      : f.align === "right"
                        ? "flex-end"
                        : "center",
                  alignItems: "flex-start",
                  textAlign: f.align,
                  textTransform: f.uppercase ? "uppercase" : "none",
                  color: "#1a1a1a",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                <span className="w-full">{text}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
