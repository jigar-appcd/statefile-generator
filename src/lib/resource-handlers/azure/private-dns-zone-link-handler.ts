import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzurePrivateDNSZoneLinkHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      private_dns_zone_name: '${azurerm_private_dns_zone.main.name}',
      virtual_network_id: '${azurerm_virtual_network.main.id}',
      resource_group_name: '${azurerm_resource_group.main.name}',
      registration_enabled: true,
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 