import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class AzureSQLServerHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const resourceGroupId = generateResourceId('rg')
    const identityId = generateResourceId('id')
    const keyVaultId = generateResourceId('kv')
    const keyId = generateResourceId('key')
    const tenantId = '00000000-0000-0000-0000-000000000000'
    const objectId = generateResourceId('obj')
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      resource_group_name: resourceGroupId,
      location: region.code,
      version: '12.0',
      administrator_login: 'sqladmin',
      administrator_login_password: `${resourceName}-${generateResourceId('pwd')}`,
      minimum_tls_version: '1.2',
      public_network_access_enabled: false,
      outbound_network_restriction_enabled: true,
      connection_policy: 'Default',
      azuread_administrator: {
        login_username: 'SQL Admin',
        object_id: objectId,
        tenant_id: tenantId,
        azuread_authentication_only: true
      },
      identity: {
        type: 'SystemAssigned'
      },
      primary_user_assigned_identity_id: `/subscriptions/${tenantId}/resourceGroups/${resourceGroupId}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/${identityId}`,
      transparent_data_encryption_key_vault_key_id: `https://${keyVaultId}.vault.azure.net/keys/${keyId}`,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `azurerm_resource_group.${resourceGroupId}`,
        `azurerm_user_assigned_identity.${identityId}`,
        `azurerm_key_vault.${keyVaultId}`,
        `azurerm_key_vault_key.${keyId}`
      ]
    }

    return attributes
  }
} 