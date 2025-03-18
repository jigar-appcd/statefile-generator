import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureAppConfigurationHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      sku: 'standard',
      local_auth_enabled: true,
      public_network_access: 'Enabled',
      purge_protection_enabled: true,
      soft_delete_retention_days: 7,
      replica: {
        location: region.code,
        name: `${resourceName}-replica`
      },
      encryption: {
        key_vault_key_identifier: '${azurerm_key_vault_key.app_config.id}',
        identity_client_id: '${azurerm_user_assigned_identity.app_config.client_id}'
      },
      identity: {
        type: 'SystemAssigned, UserAssigned',
        identity_ids: ['${azurerm_user_assigned_identity.app_config.id}']
      },
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 