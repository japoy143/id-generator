"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { CardSettings, TextFieldConfig, StudentField } from "@/lib/types";

interface Props {
  frame: string | null;
  side: "front" | "back";
  settings: CardSettings;
  onChange: (textFields: TextFieldConfig[]) => void;
  scale?: number;
}

const PPI = 96;

export default function FieldPositioner({
  frame,
  side,
  settings,
  onChange,
  scale = 1.4,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const dragState = useRef<{
    id: string;
    mode: "move" | "resize";
    startX: number;
    startY: number;
    startField: TextFieldConfig;
  } | null>(null);

  const { cardWidth, cardHeight, textFields } = settings;
  const pxW = cardWidth * PPI * scale;
  const pxH = cardHeight * PPI * scale;

  const fields = textFields.filter((f) => f.side === side);
  const others = textFields.filter((f) => f.side !== side);

  function startDrag(
    e: React.PointerEvent,
    field: TextFieldConfig,
    mode: "move" | "resize",
  ) {
    e.stopPropagation();
    e.preventDefault();
    setActiveId(field.id);
    dragState.current = {
      id: field.id,
      mode,
      startX: e.clientX,
      startY: e.clientY,
      startField: { ...field },
    };
    window.addEventListener("pointermove", onDrag);
    window.addEventListener("pointerup", endDrag);
  }

  function onDrag(e: PointerEvent) {
    const ds = dragState.current;
    const container = containerRef.current;
    if (!ds || !container) return;

    const rect = container.getBoundingClientRect();
    const dxPct = ((e.clientX - ds.startX) / rect.width) * 100;
    const dyPct = ((e.clientY - ds.startY) / rect.height) * 100;

    let patch: Partial<TextFieldConfig> = {};
    if (ds.mode === "move") {
      patch = {
        left: clamp(ds.startField.left + dxPct, 0, 100 - ds.startField.width),
        top: clamp(ds.startField.top + dyPct, 0, 100 - ds.startField.height),
      };
    } else {
      patch = {
        width: clamp(ds.startField.width + dxPct, 4, 100 - ds.startField.left),
        height: clamp(ds.startField.height + dyPct, 2, 100 - ds.startField.top),
      };
    }

    onChange([
      ...others,
      ...fields.map((f) => (f.id === ds.id ? { ...f, ...patch } : f)),
    ]);
  }

  function endDrag() {
    dragState.current = null;
    window.removeEventListener("pointermove", onDrag);
    window.removeEventListener("pointerup", endDrag);
  }

  function clamp(v: number, min: number, max: number) {
    return Math.min(Math.max(v, min), max);
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400">
        Drag a box to reposition it. Drag the bottom-right handle to resize.
      </p>
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded border border-gray-200 shadow-sm bg-white select-none"
        style={{ width: pxW, height: pxH, minWidth: pxW, minHeight: pxH }}
        onPointerDown={() => setActiveId(null)}
      >
        {frame ? (
          <Image
            src={frame}
            alt="frame"
            fill
            style={{ objectFit: "fill" }}
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <span className="text-xs text-gray-400">No frame uploaded</span>
          </div>
        )}

        {fields.map((f) => (
          <div
            key={f.id}
            onPointerDown={(e) => startDrag(e, f, "move")}
            className={`absolute flex items-center justify-center cursor-move border-2 rounded
              ${
                activeId === f.id
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-blue-300/70 bg-blue-300/10"
              }`}
            style={{
              left: `${f.left}%`,
              top: `${f.top}%`,
              width: `${f.width}%`,
              height: `${f.height}%`,
              zIndex: 10,
            }}
          >
            <span className="text-[10px] font-medium text-blue-700 px-1 wrap-break-word whitespace-pre-wrap text-center leading-tight overflow-hidden">
              {f.label}
            </span>
            <div
              onPointerDown={(e) => startDrag(e, f, "resize")}
              className="absolute -right-1.5 -bottom-1.5 w-3 h-3 bg-blue-500 rounded-sm cursor-se-resize"
              style={{ zIndex: 11 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
