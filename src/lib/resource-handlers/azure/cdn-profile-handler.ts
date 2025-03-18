import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureCDNProfileHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      sku: 'Standard_Microsoft',
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 