'use client'

import { ChevronsUpDown } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandList
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Region } from "@/types/cloud"

interface RegionSelectorProps {
  regions: Region[]
  selectedRegions: Region[]
  onRegionChange: (regions: Region[]) => void
  includeConnections: boolean
  onIncludeConnectionsChange: (include: boolean) => void
}

export default function RegionSelector({
  regions,
  selectedRegions,
  onRegionChange,
  includeConnections,
  onIncludeConnectionsChange,
}: RegionSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleRegionToggle = (region: Region) => {
    const isSelected = selectedRegions.some((r) => r.id === region.id)
    if (isSelected) {
      onRegionChange(selectedRegions.filter((r) => r.id !== region.id))
    } else {
      onRegionChange([...selectedRegions, region])
    }
  }

  const handleSelectAll = () => {
    onRegionChange(selectedRegions.length === regions.length ? [] : regions)
  }

  const filteredRegions = React.useMemo(() => {
    if (!searchQuery) return regions
    return regions.filter((region) => 
      region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      region.code.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [regions, searchQuery])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">Select Regions</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Choose one or more regions where you want to create resources
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-connections"
              checked={includeConnections}
              onCheckedChange={(checked) => onIncludeConnectionsChange(checked as boolean)}
            />
            <label
              htmlFor="include-connections"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900"
            >
              Include Connections
            </label>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="text-xs text-gray-900 hover:bg-gray-100"
          >
            {selectedRegions.length === regions.length ? "Unselect All" : "Select All"}
          </Button>
        </div>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white text-gray-900 hover:bg-gray-100"
          >
            {selectedRegions.length === 0
              ? "Select regions..."
              : `${selectedRegions.length} region${selectedRegions.length === 1 ? "" : "s"} selected`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command className="bg-white" shouldFilter={false}>
            <CommandInput 
              placeholder="Search regions..." 
              className="bg-white"
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList className="bg-white max-h-[300px] overflow-auto">
              {filteredRegions.length === 0 ? (
                <CommandEmpty>No region found.</CommandEmpty>
              ) : (
                <CommandGroup>
                  <div
                    className="flex items-center space-x-2 w-full px-2 py-1.5 hover:bg-gray-100 cursor-pointer text-left"
                    onClick={handleSelectAll}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleSelectAll()
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <Checkbox
                        checked={selectedRegions.length === regions.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedRegions.length === regions.length ? "Unselect All" : "Select All"}
                    </span>
                  </div>
                  {filteredRegions.map((region) => {
                    const isSelected = selectedRegions.some((r) => r.id === region.id)
                    return (
                      <div
                        key={region.id}
                        className="flex items-center space-x-2 w-full px-2 py-1.5 hover:bg-gray-100 cursor-pointer text-left"
                        onClick={() => handleRegionToggle(region)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleRegionToggle(region)
                          }
                        }}
                      >
                        <div className="flex items-center">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleRegionToggle(region)}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{region.name}</span>
                      </div>
                    )
                  })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedRegions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedRegions.map((region) => (
            <div
              key={region.id}
              className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-500/10"
            >
              {region.name}
              <button
                type="button"
                onClick={() => handleRegionToggle(region)}
                className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              >
                <span className="sr-only">Remove</span>
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 