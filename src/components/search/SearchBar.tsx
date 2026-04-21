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
      <span className="flex w-full min-w-0 items-center gap-3 rounded-md border border-[#3f503f] bg-[#111511] px-4 py-3 transition focus-within:border-[#67d8cf] lg:w-80">
        <span aria-hidden="true" className="font-mono text-sm text-[#67d8cf]">
          /
        </span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="focus-ring w-full min-w-0 bg-transparent text-sm font-bold text-[#fff5de] outline-none placeholder:text-[#8c9a86]"
          type="search"
        />
      </span>
    </label>
  );
}
