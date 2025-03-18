import { Region } from '@/types/cloud'
import {
    generateResourceId,
    generateSubscriptionId
} from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AzureStorageAccountHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const storageAccountId = generateResourceId()
    const resourceGroupId = generateResourceId()
    const keyVaultId = generateResourceId()
    const keyId = generateResourceId()
    const identityId = generateResourceId()
    const subscriptionId = generateSubscriptionId()
    
    const attributes: ResourceAttributes = {
      name: `st${storageAccountId}`,
      resource_group_name: `rg-storage-${resourceGroupId}`,
      location: region.code,
      account_tier: 'Standard',
      account_replication_type: 'GRS',
      account_kind: 'StorageV2',
      access_tier: 'Hot',
      enable_https_traffic_only: true,
      min_tls_version: 'TLS1_2',
      allow_nested_items_to_be_public: false,
      shared_access_key_enabled: true,
      public_network_access_enabled: false,
      default_to_oauth_authentication: true,
      is_hns_enabled: true,
      nfsv3_enabled: false,
      large_file_share_enabled: false,
      network_rules: {
        default_action: 'Deny',
        bypass: ['AzureServices'],
        ip_rules: ['10.0.0.0/24'],
        virtual_network_subnet_ids: []
      },
      blob_properties: {
        versioning_enabled: true,
        change_feed_enabled: true,
        container_delete_retention_policy: {
          days: 7
        },
        delete_retention_policy: {
          days: 7
        }
      },
      queue_properties: {
        logging: {
          delete: true,
          read: true,
          write: true,
          version: '1.0'
        },
        hour_metrics: {
          enabled: true,
          include_apis: true,
          retention_policy_days: 7,
          version: '1.0'
        },
        minute_metrics: {
          enabled: true,
          include_apis: true,
          retention_policy_days: 7,
          version: '1.0'
        }
      },
      customer_managed_key: {
        key_vault_key_id: `/subscriptions/${subscriptionId}/resourceGroups/rg-storage-${resourceGroupId}/providers/Microsoft.KeyVault/vaults/kv-${keyVaultId}/keys/key-${keyId}`,
        user_assigned_identity_id: `/subscriptions/${subscriptionId}/resourceGroups/rg-storage-${resourceGroupId}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/id-${identityId}`
      },
      identity: {
        type: 'UserAssigned',
        identity_ids: [`/subscriptions/${subscriptionId}/resourceGroups/rg-storage-${resourceGroupId}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/id-${identityId}`]
      },
      tags: {
        environment: 'production'
      },
      depends_on: [
        `azurerm_resource_group.${resourceGroupId}`,
        `azurerm_key_vault.${keyVaultId}`,
        `azurerm_key_vault_key.${keyId}`,
        `azurerm_user_assigned_identity.${identityId}`
      ]
    }

    return attributes
  }
} 