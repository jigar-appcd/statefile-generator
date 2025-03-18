import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureStaticSiteHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      sku_tier: 'Standard',
      sku_size: 'Standard',
      app_settings: {
        API_LOCATION: 'api',
        APP_LOCATION: 'app',
        OUTPUT_LOCATION: 'dist',
        GITHUB_TOKEN: '${data.azurerm_key_vault_secret.github_token.value}'
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
      repository_url: 'https://github.com/example/repo',
      repository_token: '${data.azurerm_key_vault_secret.github_token.value}',
      branch: 'main',
      build_properties: {
        api_location: 'api',
        app_location: 'app',
        app_artifact_location: 'dist'
      },
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 