import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzurePrivateDNSCNAMERecordHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      resource_group_name: '${azurerm_resource_group.main.name}',
      zone_name: '${azurerm_private_dns_zone.main.name}',
      ttl: 300,
      record: 'target.example.com',
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 