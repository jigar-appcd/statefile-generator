import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureStaticWebAppHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      sku_tier: 'Standard',
      sku_size: 'Standard',
      app_settings: {
        API_URL: 'https://api.example.com',
        ENVIRONMENT: 'production'
      },
      identity: {
        type: 'SystemAssigned'
      },
      custom_domains: [
        {
          domain_name: 'www.example.com',
          validation_type: 'dns-txt-token'
        }
      ],
      staging_environment_policy: 'Enabled',
      allowed_ip_addresses: ['10.0.0.0/8', '172.16.0.0/12'],
      function_app_settings: {
        runtime_version: '~4',
        runtime_scale_monitoring_enabled: true
      },
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 