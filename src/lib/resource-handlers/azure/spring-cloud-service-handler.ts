import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureSpringCloudServiceHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      sku_name: 'S0',
      network: {
        app_subnet_id: '${azurerm_subnet.apps.id}',
        service_runtime_subnet_id: '${azurerm_subnet.runtime.id}',
        cidr_ranges: ['10.1.0.0/16', '10.2.0.0/16'],
        app_network_resource_group: '${azurerm_resource_group.apps.name}'
      },
      config_server_git_setting: {
        uri: 'https://github.com/example/config',
        label: 'main',
        search_paths: ['config'],
        http_basic_auth: {
          username: '${data.azurerm_key_vault_secret.git_username.value}',
          password: '${data.azurerm_key_vault_secret.git_password.value}'
        }
      },
      trace: {
        connection_string: '${azurerm_application_insights.main.connection_string}',
        sample_rate: 10
      },
      build_agent_pool_size: 'S1',
      service_registry_enabled: true,
      zone_redundant: true,
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