import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { BaseSearchBar } from "./BaseSearchBar";

interface FilterSearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

export function FilterSearchBar({
  onSearch,
  placeholder,
}: FilterSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  // Update search whenever the debounced term changes
  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  return (
    <BaseSearchBar
      value={searchTerm}
      onChangeText={setSearchTerm}
      placeholder={placeholder}
      showDismissOverlay={false}
    />
  );
}
