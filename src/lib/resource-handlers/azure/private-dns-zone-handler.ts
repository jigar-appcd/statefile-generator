import { generateResourceId } from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzurePrivateDNSZoneHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const resourceGroupId = generateResourceId()
    
    const attributes: ResourceAttributes = {
      name: 'privatelink.blob.core.windows.net',
      resource_group_name: `rg-dns-${resourceGroupId}`,
      soa_record: {
        email: 'azureprivatedns-host.microsoft.com',
        expire_time: 2419200,
        minimum_ttl: 10,
        refresh_time: 3600,
        retry_time: 300,
        ttl: 3600
      },
      tags: {
        Name: resourceName,
        ...commonTags,
        environment: 'production'
      },
      depends_on: [
        `azurerm_resource_group.${resourceGroupId}`
      ]
    }

    return attributes
  }
} 