"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Region {
  value: string
  label: string
  category: string
}

interface RegionSelectorProps {
  regions: Region[]
  selectedRegions: string[]
  onRegionChange: (regions: string[]) => void
}

export function RegionSelector({
  regions,
  selectedRegions,
  onRegionChange,
}: RegionSelectorProps) {
  const [open, setOpen] = React.useState(false)

  const handleRegionToggle = (value: string) => {
    const newSelectedRegions = selectedRegions.includes(value)
      ? selectedRegions.filter((r) => r !== value)
      : [...selectedRegions, value]
    onRegionChange(newSelectedRegions)
  }

  const handleSelectAll = () => {
    const allRegions = regions.map((r) => r.value)
    onRegionChange(
      selectedRegions.length === allRegions.length ? [] : allRegions
    )
  }

  const groupedRegions = regions.reduce((acc, region) => {
    if (!acc[region.category]) {
      acc[region.category] = []
    }
    acc[region.category].push(region)
    return acc
  }, {} as Record<string, Region[]>)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {selectedRegions.length > 0
            ? `${selectedRegions.length} regions selected`
            : "Select regions..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search regions..." />
          <CommandList>
            <CommandEmpty>No regions found.</CommandEmpty>
            <CommandGroup>
              <CommandItem onSelect={handleSelectAll}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedRegions.length === regions.length
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                <span>Select All</span>
              </CommandItem>
            </CommandGroup>
            {Object.entries(groupedRegions).map(([category, categoryRegions]) => (
              <CommandGroup key={category} heading={category}>
                {categoryRegions.map((region) => (
                  <CommandItem
                    key={region.value}
                    onSelect={() => handleRegionToggle(region.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedRegions.includes(region.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {region.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 