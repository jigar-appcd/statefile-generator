import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureSignalRServiceHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      sku: {
        name: 'Standard_S1',
        capacity: 1,
        tier: 'Standard'
      },
      service_mode: 'Default',
      upstream_endpoint: {
        category_pattern: ['*'],
        event_pattern: ['*'],
        hub_pattern: ['*'],
        url_template: 'https://example.com/api/{hub}/{category}/{event}'
      },
      live_trace: {
        enabled: true,
        messaging_logs_enabled: true,
        connectivity_logs_enabled: true
      },
      connectivity_logs_enabled: true,
      messaging_logs_enabled: true,
      features: [
        {
          flag: 'ServiceMode',
          value: 'Default'
        },
        {
          flag: 'EnableConnectivityLogs',
          value: 'true'
        }
      ],
      cors: {
        allowed_origins: ['*']
      },
      identity: {
        type: 'SystemAssigned'
      },
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 