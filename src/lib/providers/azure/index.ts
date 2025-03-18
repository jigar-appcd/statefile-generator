import { CloudResource, Region, TerraformResource, TerraformStateFile } from '@/types/cloud'
import { generateUUID } from '@/lib/utils'
import crypto from 'crypto'

export const azureRegions: Region[] = [
  { id: 'eastus', name: 'East US', code: 'eastus', provider: 'azure' },
  { id: 'eastus2', name: 'East US 2', code: 'eastus2', provider: 'azure' },
  { id: 'centralus', name: 'Central US', code: 'centralus', provider: 'azure' },
  { id: 'northcentralus', name: 'North Central US', code: 'northcentralus', provider: 'azure' },
  { id: 'southcentralus', name: 'South Central US', code: 'southcentralus', provider: 'azure' },
  { id: 'westcentralus', name: 'West Central US', code: 'westcentralus', provider: 'azure' },
  { id: 'westus', name: 'West US', code: 'westus', provider: 'azure' },
  { id: 'westus2', name: 'West US 2', code: 'westus2', provider: 'azure' },
  { id: 'westus3', name: 'West US 3', code: 'westus3', provider: 'azure' },
  { id: 'canadacentral', name: 'Canada Central', code: 'canadacentral', provider: 'azure' },
  { id: 'canadaeast', name: 'Canada East', code: 'canadaeast', provider: 'azure' },
  { id: 'brazilsouth', name: 'Brazil South', code: 'brazilsouth', provider: 'azure' },
  { id: 'northeurope', name: 'North Europe', code: 'northeurope', provider: 'azure' },
  { id: 'westeurope', name: 'West Europe', code: 'westeurope', provider: 'azure' },
  { id: 'uksouth', name: 'UK South', code: 'uksouth', provider: 'azure' },
  { id: 'ukwest', name: 'UK West', code: 'ukwest', provider: 'azure' },
  { id: 'francecentral', name: 'France Central', code: 'francecentral', provider: 'azure' },
  { id: 'germanywestcentral', name: 'Germany West Central', code: 'germanywestcentral', provider: 'azure' },
  { id: 'norwayeast', name: 'Norway East', code: 'norwayeast', provider: 'azure' },
  { id: 'switzerlandnorth', name: 'Switzerland North', code: 'switzerlandnorth', provider: 'azure' },
  { id: 'eastasia', name: 'East Asia', code: 'eastasia', provider: 'azure' },
  { id: 'southeastasia', name: 'Southeast Asia', code: 'southeastasia', provider: 'azure' },
  { id: 'japaneast', name: 'Japan East', code: 'japaneast', provider: 'azure' },
  { id: 'japanwest', name: 'Japan West', code: 'japanwest', provider: 'azure' },
  { id: 'australiaeast', name: 'Australia East', code: 'australiaeast', provider: 'azure' },
  { id: 'australiasoutheast', name: 'Australia Southeast', code: 'australiasoutheast', provider: 'azure' },
  { id: 'centralindia', name: 'Central India', code: 'centralindia', provider: 'azure' },
  { id: 'southindia', name: 'South India', code: 'southindia', provider: 'azure' },
]

const generateId = (prefix: string, index: number, region: string): string => {
  const uniqueHash = crypto
    .createHash('sha256')
    .update(`${prefix}-${region}-${index}-${Date.now()}`)
    .digest('hex')
    .substring(0, 8)
  return `${prefix}-${uniqueHash}`
}

export const generateVirtualNetwork = (
  subscriptionId: string,
  region: string,
  vnetIndex: number
): TerraformResource => {
  const vnetId = generateId('vnet', vnetIndex, region)
  const name = `vnet-${region}-${vnetIndex}`
  const resourceGroup = `rg-${region}-${vnetIndex}`

  return {
    mode: 'managed',
    type: 'azurerm_virtual_network',
    name: `vnet_${vnetIndex}`,
    provider: 'provider["registry.terraform.io/hashicorp/azurerm"]',
    instances: [
      {
        schema_version: 0,
        attributes: {
          id: `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Network/virtualNetworks/${name}`,
          name: name,
          resource_group_name: resourceGroup,
          location: region,
          address_space: ['10.0.0.0/16'],
          dns_servers: [],
          bgp_community: '',
          ddos_protection_plan: [],
          tags: {
            environment: 'production',
          },
          timeouts: {
            create: '30m',
            update: '30m',
            read: '5m',
            delete: '30m',
          },
        },
      },
    ],
  }
}

export const generateAzureStateFile = (
  regions: string[] = ['eastus'],
  selectedResources: CloudResource[],
  subscriptionId: string = '00000000-0000-0000-0000-000000000000'
): TerraformStateFile => {
  const resources: TerraformResource[] = []
  const resourceCounts: Record<string, number> = {}

  for (const region of regions) {
    for (const resource of selectedResources) {
      const count = resourceCounts[resource.type] || 0
      resourceCounts[resource.type] = count + 1

      switch (resource.type) {
        case 'azurerm_virtual_network':
          resources.push(generateVirtualNetwork(subscriptionId, region, count))
          break
        // Add more resource types here...
      }
    }
  }

  return {
    version: 4,
    terraform_version: '1.5.0',
    serial: 1,
    lineage: crypto.randomUUID(),
    outputs: {},
    resources,
  }
} 