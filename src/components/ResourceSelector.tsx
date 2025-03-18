'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CloudResource, ResourceCategory } from '@/types/cloud'
import { ChangeEvent } from 'react'

interface ResourceSelectorProps {
  categories: ResourceCategory[]
  selectedResources: CloudResource[]
  totalCount: number
  onResourceChange: (resources: CloudResource[]) => void
  onTotalCountChange: (count: number) => void
}

export default function ResourceSelector({
  categories,
  selectedResources,
  totalCount,
  onResourceChange,
  onTotalCountChange,
}: ResourceSelectorProps) {
  const handleResourceToggle = (resource: CloudResource) => {
    const isSelected = selectedResources.some((r) => r.id === resource.id)
    if (isSelected) {
      onResourceChange(selectedResources.filter((r) => r.id !== resource.id))
    } else {
      onResourceChange([...selectedResources, resource])
    }
  }

  const handleCategorySelectAll = (category: ResourceCategory, checked: boolean) => {
    if (checked) {
      // Add all resources from this category that aren't already selected
      const newResources = category.resources.filter(
        (resource) => !selectedResources.some((r) => r.id === resource.id)
      )
      onResourceChange([...selectedResources, ...newResources])
    } else {
      // Remove all resources from this category
      onResourceChange(
        selectedResources.filter(
          (resource) => !category.resources.some((r) => r.id === resource.id)
        )
      )
    }
  }

  const handleSelectAllCategories = (checked: boolean) => {
    if (checked) {
      // Select all resources from all categories
      const allResources = categories.flatMap((category) => category.resources)
      onResourceChange(allResources)
    } else {
      // Deselect all resources
      onResourceChange([])
    }
  }

  const isCategorySelected = (category: ResourceCategory) => {
    return category.resources.every((resource) =>
      selectedResources.some((r) => r.id === resource.id)
    )
  }


  const areAllCategoriesSelected = () => {
    const allResources = categories.flatMap((category) => category.resources)
    return allResources.every((resource) =>
      selectedResources.some((r) => r.id === resource.id)
    )
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">Select Resources</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Choose the resources you want to include in your state file
          </p>
        </div>
        <div className="flex items-center justify-end space-x-8">
          <div className="flex items-center space-x-2">
            <Label htmlFor="total-count" className="text-sm font-medium text-gray-700">
              Total Resources:
            </Label>
            <Input
              type="number"
              id="total-count"
              className="w-24 bg-white border-gray-200"
              min={1}
              max={100}
              value={totalCount}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onTotalCountChange(parseInt(e.target.value, 10) || 1)
              }
            />
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Checkbox
                id="select-all-categories"
                checked={areAllCategoriesSelected()}
                onCheckedChange={(checked) => handleSelectAllCategories(checked as boolean)}
                // data-state={isAnyCategoryIndeterminate() ? "indeterminate" : undefined}
              />
            </div>
            <Label
              htmlFor="select-all-categories"
              className="text-sm font-medium text-gray-900 cursor-pointer select-none"
            >
              Select All Categories
            </Label>
          </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium leading-6 text-gray-900">{category.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{category.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <Checkbox
                    id={`select-all-${category.id}`}
                    checked={isCategorySelected(category)}
                    onCheckedChange={(checked) => handleCategorySelectAll(category, checked as boolean)}
                    // data-state={isCategoryIndeterminate(category) ? "indeterminate" : undefined}
                  />
                </div>
                <Label
                  htmlFor={`select-all-${category.id}`}
                  className="w-16 text-sm font-medium text-gray-900 cursor-pointer select-none"
                >
                  Select All
                </Label>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {category.resources.map((resource) => {
                const isSelected = selectedResources.some((r) => r.id === resource.id)
                return (
                  <div key={resource.id} className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      <Checkbox
                        id={resource.id}
                        checked={isSelected}
                        onCheckedChange={() => handleResourceToggle(resource)}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Label
                        htmlFor={resource.id}
                        className="text-sm font-medium text-gray-900 cursor-pointer"
                      >
                        {resource.name}
                      </Label>
                      <p className="text-sm text-gray-500">{resource.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 