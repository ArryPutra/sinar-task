import { SearchIcon, XIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "./ui/input-group";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") ?? ""
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams(searchParams);

    if (search.trim()) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    params.set("page", "1");

    router.push(`?${params.toString()}`);
  }

  function handleClear() {
    setSearch("");

    const params = new URLSearchParams(searchParams);
    params.delete("search");
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 ml-auto">
      <InputGroup className="max-w-sm relative">
        <InputGroupInput
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* icon search kiri/kanan (optional addon kamu) */}
        <InputGroupAddon>
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>

        {/* CLEAR BUTTON */}
        {search && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
      </InputGroup>

      <Button variant="outline" type="submit">
        <SearchIcon />
        <span className="max-sm:hidden">Cari</span>
      </Button>
    </form>
  );
}