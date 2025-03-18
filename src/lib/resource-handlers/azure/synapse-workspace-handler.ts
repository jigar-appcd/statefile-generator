import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureSynapseWorkspaceHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      storage_data_lake_gen2_filesystem_id: '${azurerm_storage_data_lake_gen2_filesystem.synapse.id}',
      sql_administrator_login: 'sqladmin',
      sql_administrator_login_password: '${random_password.synapse.result}',
      managed_virtual_network_enabled: true,
      data_exfiltration_protection_enabled: true,
      purview_id: '${azurerm_purview_account.main.id}',
      aad_admin: {
        login: 'AzureAD Admin',
        object_id: '${data.azuread_group.synapse_admins.object_id}',
        tenant_id: '${data.azurerm_client_config.current.tenant_id}'
      },
      sql_identity_control_enabled: true,
      managed_resource_group_name: '${var.resource_group_name}-synapse-managed',
      customer_managed_key: {
        key_versionless_id: '${azurerm_key_vault_key.synapse.versionless_id}',
        key_vault_url: '${azurerm_key_vault.main.vault_uri}'
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