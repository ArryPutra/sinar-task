import { SearchIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { Button } from "./ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

export default function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(
        searchParams.get("search") ?? ""
    );

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const params = new URLSearchParams(searchParams);

        params.set("search", search);
        params.set("page", "1");

        router.push(`?${params.toString()}`);
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <InputGroup className="max-w-sm">
                <InputGroupInput
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onSubmit={handleSubmit}
                />
                <InputGroupAddon>
                    <SearchIcon className="text-muted-foreground" />
                </InputGroupAddon>
            </InputGroup>
            <Button variant={"outline"}>
                <SearchIcon/>
                <span className="max-sm:hidden">Cari</span>
            </Button>
        </form>
    )
}
