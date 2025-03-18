'use client'

import { useStateGenerator } from '@/hooks/useStateGenerator'
import { RadioGroup } from '@headlessui/react'
import { useState } from 'react'
import RegionSelector from './RegionSelector'
import ResourceSelector from './ResourceSelector'
import { Button } from './ui/button'

const providers = [
  {
    id: 'aws' as const,
    name: 'Amazon Web Services',
    description: 'Generate state file for AWS resources',
    logo: '/aws-logo.svg'
  },
  {
    id: 'gcp' as const,
    name: 'Google Cloud Platform',
    description: 'Generate state file for GCP resources',
    logo: '/gcp-logo.svg'
  },
  {
    id: 'azure' as const,
    name: 'Microsoft Azure',
    description: 'Generate state file for Azure resources',
    logo: '/azure-logo.svg'
  }
] as const

export default function CloudProviderSelector() {
  const {
    provider,
    setProvider,
    selectedRegions,
    setSelectedRegions,
    selectedResources,
    setSelectedResources,
    categories,
    regions,
    generateStateFile,
    includeConnections,
    setIncludeConnections,
  } = useStateGenerator()

  const [stateFile, setStateFile] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState<number>(5)

  const handleGenerateClick = () => {
    const state = generateStateFile(selectedResources, selectedRegions, includeConnections, totalCount)
    if (state) {
      setStateFile(JSON.stringify(state, null, 2))
    }
  }

  const handleDownload = () => {
    if (!stateFile) return

    const blob = new Blob([stateFile], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'terraform.tfstate'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8 bg-white">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <RadioGroup value={provider} onChange={setProvider}>
          <RadioGroup.Label className="text-base font-semibold leading-6 text-gray-900">
            Select Cloud Provider
          </RadioGroup.Label>

          <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
            {providers.map((providerOption) => (
              <RadioGroup.Option
                key={providerOption.id}
                value={providerOption.id}
                className={({ active, checked }) =>
                  `${
                    active ? 'ring-2 ring-indigo-600 ring-offset-2' : ''
                  } ${
                    checked ? 'bg-indigo-600 text-white' : 'bg-white'
                  } relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                }
              >
                {({ checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium ${checked ? 'text-white' : 'text-gray-900'}`}
                          >
                            {providerOption.name}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={`inline ${checked ? 'text-indigo-100' : 'text-gray-500'}`}
                          >
                            {providerOption.description}
                          </RadioGroup.Description>
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white">
                          <CheckIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>

      {provider && (
        <div className="space-y-8">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <RegionSelector
              regions={regions}
              selectedRegions={selectedRegions}
              onRegionChange={setSelectedRegions}
              includeConnections={includeConnections}
              onIncludeConnectionsChange={setIncludeConnections}
            />
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <ResourceSelector
              categories={categories}
              selectedResources={selectedResources}
              onResourceChange={setSelectedResources}
              totalCount={totalCount}
              onTotalCountChange={setTotalCount}
            />
          </div>

          <div className="flex justify-end space-x-4 items-center">
            <Button
              className='cursor-pointer'
              onClick={handleGenerateClick}
              disabled={selectedRegions.length === 0 || selectedResources.length === 0}
            >
              Generate State File
            </Button>
            {stateFile && <Button className='cursor-pointer' onClick={handleDownload}>Download</Button>}
          </div>

          {stateFile && (
            <div className="rounded-lg bg-white border border-gray-200 p-4 overflow-x-auto">
              <pre className="text-sm text-gray-800">{stateFile}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CheckIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
} 