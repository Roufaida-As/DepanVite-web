import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface Props {
  text?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: (term: string) => void;
  placeholder?: string;
}

export default function SearchBar({ text = "Search", value, onChange, onSearch, placeholder }: Props) {
  const [local, setLocal] = useState(value ?? "");

  useEffect(() => {
    // keep local in sync when parent controls value
    if (value !== undefined && value !== local) setLocal(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(local);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={local}
        onChange={(e) => {
          setLocal(e.target.value);
          onChange?.(e);
        }}
        placeholder={placeholder ?? text}
        className="w-full border border-[#FFC120] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC120] focus:border-[#FFC120]"
      />
     
    </form>
  );
}
