import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureTrafficManagerHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      resource_group_name: '${azurerm_resource_group.main.name}',
      traffic_routing_method: 'Performance',
      dns_config: {
        relative_name: resourceName.toLowerCase(),
        ttl: 30
      },
      monitor_config: {
        protocol: 'HTTPS',
        port: 443,
        path: '/health',
        interval_in_seconds: 30,
        timeout_in_seconds: 10,
        tolerated_number_of_failures: 3,
        expected_status_code_ranges: ['200-299']
      },
      profile_status: 'Enabled',
      max_return: 5,
      endpoint: [
        {
          name: 'primary',
          target_resource_id: '${azurerm_public_ip.primary.id}',
          weight: 100,
          priority: 1,
          endpoint_location: region.code,
          min_child_endpoints: 1,
          geo_mappings: ['WORLD']
        },
        {
          name: 'secondary',
          target_resource_id: '${azurerm_public_ip.secondary.id}',
          weight: 50,
          priority: 2,
          endpoint_location: 'westeurope',
          min_child_endpoints: 1,
          geo_mappings: ['WORLD']
        }
      ],
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 