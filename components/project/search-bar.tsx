import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Funnel, ListFilter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchFragmentProps {
  onSearch: (query: string) => void;
  onFilterStatus: (status: string | null) => void;
  onSort: (sort: string) => void;
}

const SearchFragment = ({ onSearch, onFilterStatus, onSort }: SearchFragmentProps) => {
  return (
    <div className="flex items-center space-x-4 justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari proyek..."
          className="bg-card pl-10"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline"><Funnel className="mr-2" />Status</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem onClick={() => onFilterStatus(null)}>
              Semua
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onClick={() => onFilterStatus("active")}>
              Berlangsung
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onClick={() => onFilterStatus("done")}>
              Selesai
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onClick={() => onFilterStatus("planning")}>
              Perencanaan
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline"><ListFilter className="mr-2" />Urutkan</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Urutkan Berdasarkan</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem onClick={() => onSort("newest")}>
              Terbaru
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onClick={() => onSort("oldest")}>
              Terlama
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onClick={() => onSort("deadline")}>
              Deadline Terdekat
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default SearchFragment