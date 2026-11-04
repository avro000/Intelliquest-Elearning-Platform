import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
  } from "@/components/ui/dropdown-menu";
  import { Button } from "@/components/ui/button";
  import { ChevronDown } from "lucide-react";
  
  type SortByProps = {
    setSortBy: (value: string) => void;
    setSortOrder: (value: "asc" | "desc") => void;
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
  
  export default function SortByDropdown({
    setSortBy,
    setSortOrder,
  }: SortByProps) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            Sort By <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>ID</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => {
                  setSortBy("id");
                  setSortOrder("asc");
                }}
              >
                Ascending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortBy("id");
                  setSortOrder("desc");
                }}
              >
                Descending
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
  
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Username</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => {
                  setSortBy("username");
                  setSortOrder("asc");
                }}
              >
                Ascending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortBy("username");
                  setSortOrder("desc");
                }}
              >
                Descending
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  