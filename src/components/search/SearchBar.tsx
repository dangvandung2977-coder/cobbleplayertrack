"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
};

export function SearchBar({
  value,
  onChange,
  placeholder = "Search",
  label = "Search",
}: SearchBarProps) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="focus-ring w-full min-w-0 border border-[#4d5736] bg-[#15180f] px-4 py-3 text-sm font-bold text-[#f4ead2] placeholder:text-[#83785f] lg:w-80"
        type="search"
      />
    </label>
  );
}
