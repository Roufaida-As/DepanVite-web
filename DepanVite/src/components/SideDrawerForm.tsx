// src/components/SideDrawerForm.tsx
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react"; // icon

type Field = { name: string; label: string; type?: string };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  fields: Field[];
  onSubmit: (data: Record<string, any>) => void;
  title?: string;
}

export default function SideDrawerForm({
  isOpen,
  onClose,
  fields,
  onSubmit,
  title ,
}: Props) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!isOpen) setFormData({});
  }, [isOpen]);

  const handleChange = (name: string, value: any) => {
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  // lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />
      </div>

      {/* Drawer panel */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
      >
        <div className="h-full flex flex-col bg-white shadow-2xl rounded-l-lg">
          <header className="flex items-center justify-between p-4 border-b">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-[#FFC120]">
  <Plus className="w-5 h-5" />
  {title}
</h3>
            <button
              onClick={onClose}
              className="px-3 py-1 rounded hover:bg-gray-100"
              aria-label="Close"
            >
              ✕
            </button>
          </header>

          <form className="p-4 overflow-auto flex-1" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {fields.map((f) => (
                <div key={f.name}>
                  <label className="block text-sm mb-1 font-medium text-gray-700">
                    {f.label}
                  </label>
                  <input
                    type={f.type ?? "text"}
                    value={formData[f.name] ?? ""}
                    onChange={(e) => handleChange(f.name, e.target.value)}
                    className="w-full border border-[#FFC120] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC120] focus:border-[#FFC120]"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#FFC120] text-white rounded 
                            border border-transparent 
                            hover:bg-white hover:text-[#FFC120] hover:border-[#FFC120]"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </aside>
    </>
  );
}
