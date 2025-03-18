import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureDataFactoryHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      public_network_enabled: false,
      managed_virtual_network_enabled: true,
      customer_managed_key_id: '${azurerm_key_vault_key.adf.id}',
      customer_managed_key_identity_id: '${azurerm_user_assigned_identity.adf.id}',
      purview_id: '${azurerm_purview_account.main.id}',
      global_parameter: [
        {
          name: 'Environment',
          type: 'String',
          value: 'Production'
        },
        {
          name: 'Region',
          type: 'String',
          value: region.code
        }
      ],
      identity: {
        type: 'SystemAssigned, UserAssigned',
        identity_ids: ['${azurerm_user_assigned_identity.adf.id}']
      },
      vsts_configuration: {
        account_name: 'myorganization',
        branch_name: 'main',
        project_name: 'myproject',
        repository_name: 'myrepo',
        root_folder: '/',
        tenant_id: '${data.azurerm_client_config.current.tenant_id}'
      },
      github_configuration: {
        account_name: 'myorganization',
        branch_name: 'main',
        git_url: 'https://github.com/myorganization/myrepo',
        repository_name: 'myrepo',
        root_folder: '/'
      },
      integration_runtime_custom: [
        {
          name: 'SelfHosted',
          description: 'Self-hosted integration runtime',
          type: 'SelfHosted'
        },
        {
          name: 'Managed',
          description: 'Managed integration runtime',
          type: 'Managed',
          compute_type: 'General',
          core_count: 8,
          time_to_live_min: 60
        }
      ],
      managed_private_endpoint: [
        {
          name: 'sql',
          target_resource_id: '${azurerm_mssql_server.main.id}',
          subresource_name: 'sqlServer'
        },
        {
          name: 'storage',
          target_resource_id: '${azurerm_storage_account.adf.id}',
          subresource_name: 'blob'
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