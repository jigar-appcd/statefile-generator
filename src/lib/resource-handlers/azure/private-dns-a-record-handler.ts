import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AzurePrivateDNSARecordHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName.toLowerCase(),
      zone_name: '${azurerm_private_dns_zone.main.name}',
      resource_group_name: '${azurerm_resource_group.main.name}',
      ttl: 300,
      records: ['10.0.0.4', '10.0.0.5'],
      depends_on: [
        'azurerm_private_dns_zone.main'
      ]
    }

    return attributes
  }
} 