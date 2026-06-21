"use client";

import { CardSettings } from "@/lib/types";
import FrameUpload from "../ui/FrameUpload";
import CardPreview from "../ui/CardPreview";
import TextFieldEditor from "../ui/TextFieldEditor";
import FieldPositioner from "../ui/FieldPositioner";

interface Props {
  frontFrame: string | null;
  backFrame: string | null;
  settings: CardSettings;
  onFrontChange: (v: string) => void;
  onBackChange: (v: string) => void;
  onSettingsChange: (s: Partial<CardSettings>) => void;
  onNext: () => void;
}

export default function FramesTab({
  frontFrame,
  backFrame,
  settings,
  onFrontChange,
  onBackChange,
  onSettingsChange,
  onNext,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-700">
        Upload your front and back ID frame images. These will be used as
        backgrounds for all generated cards.
      </div>

      {/* Frame uploads */}
      <div className="grid grid-cols-2 gap-4">
        <FrameUpload
          label="Front Frame"
          value={frontFrame}
          onChange={onFrontChange}
        />
        <FrameUpload
          label="Back Frame"
          value={backFrame}
          onChange={onBackChange}
        />
      </div>

      {(frontFrame || backFrame) && (
        <div className="flex gap-6 justify-center py-2">
          <CardPreview
            frame={frontFrame}
            settings={settings}
            label="Front preview"
            scale={0.8}
            side="front"
          />
          <CardPreview
            frame={backFrame}
            settings={settings}
            label="Back preview"
            scale={0.8}
            side="back"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card size + gap */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Card Size
          </h3>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Width (in)
              </label>
              <input
                type="number"
                step="0.125"
                min="1"
                max="5"
                value={settings.cardWidth}
                onChange={(e) =>
                  onSettingsChange({
                    cardWidth: parseFloat(e.target.value) || 2.125,
                  })
                }
                className="w-24 px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Height (in)
              </label>
              <input
                type="number"
                step="0.125"
                min="1"
                max="8"
                value={settings.cardHeight}
                onChange={(e) =>
                  onSettingsChange({
                    cardHeight: parseFloat(e.target.value) || 3.375,
                  })
                }
                className="w-24 px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Gap (in)
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="0.5"
                value={settings.cardGap ?? 0.1}
                onChange={(e) =>
                  onSettingsChange({ cardGap: parseFloat(e.target.value) || 0 })
                }
                className="w-20 px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
            <p className="text-xs text-gray-400 self-end pb-2">
              CR80: 2.125 × 3.375 in
            </p>
          </div>
        </div>

        {/* Photo position */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Photo Position on Front (% from edges)
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { key: "photoLeft", label: "Left %" },
                { key: "photoTop", label: "Top %" },
                { key: "photoWidth", label: "Width %" },
                { key: "photoHeight", label: "Height %" },
              ] as {
                key: "photoLeft" | "photoTop" | "photoWidth" | "photoHeight";
                label: string;
              }[]
            ).map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs text-gray-400 mb-1">
                  {label}
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings[key]}
                  onChange={(e) =>
                    onSettingsChange({ [key]: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drag-to-position canvas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Position Front Fields
          </h3>
          <FieldPositioner
            frame={frontFrame}
            side="front"
            settings={settings}
            onChange={(textFields) => onSettingsChange({ textFields })}
          />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Position Back Fields
          </h3>
          <FieldPositioner
            frame={backFrame}
            side="back"
            settings={settings}
            onChange={(textFields) => onSettingsChange({ textFields })}
          />
        </div>
      </div>

      {/* Text field fine-tune editor (font, size, alignment, bold) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Front Text Fields
          </h3>
          <TextFieldEditor
            side="front"
            settings={settings}
            onChange={(textFields) => onSettingsChange({ textFields })}
          />
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Back Text Fields
          </h3>
          <TextFieldEditor
            side="back"
            settings={settings}
            onChange={(textFields) => onSettingsChange({ textFields })}
          />
        </div>
      </div>

      <button
        onClick={onNext}
        className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
      >
        Next: Enter Student Data →
      </button>
    </div>
  );
}
