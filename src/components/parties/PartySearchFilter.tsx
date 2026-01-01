import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type BalanceFilter = "all" | "receivable" | "payable" | "zero";

interface PartySearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  balanceFilter: BalanceFilter;
  onBalanceFilterChange: (filter: BalanceFilter) => void;
}

const filterLabels: Record<BalanceFilter, string> = {
  all: "All Parties",
  receivable: "To Receive",
  payable: "To Pay",
  zero: "Settled",
};

export const PartySearchFilter = ({
  searchQuery,
  onSearchChange,
  balanceFilter,
  onBalanceFilterChange,
}: PartySearchFilterProps) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const clearSearch = () => {
    onSearchChange("");
  };

  const hasActiveFilter = balanceFilter !== "all";

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex gap-2">
        <div className={`relative flex-1 transition-all ${isSearchFocused ? "ring-2 ring-primary ring-offset-2" : ""} rounded-xl`}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="pl-10 pr-10 h-11 rounded-xl border-border bg-card"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full bg-muted flex items-center justify-center hover:bg-accent transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={`h-11 w-11 rounded-xl shrink-0 ${hasActiveFilter ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
            >
              <Filter className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Filter by Balance</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={balanceFilter} onValueChange={(v) => onBalanceFilterChange(v as BalanceFilter)}>
              <DropdownMenuRadioItem value="all">All Parties</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="receivable">
                <span className="text-green-600">To Receive</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="payable">
                <span className="text-red-600">To Pay</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="zero">Settled (₹0)</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {hasActiveFilter && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1">
            {filterLabels[balanceFilter]}
            <button
              onClick={() => onBalanceFilterChange("all")}
              className="ml-1 hover:bg-accent rounded-full"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        </div>
      )}
    </div>
  );
};
