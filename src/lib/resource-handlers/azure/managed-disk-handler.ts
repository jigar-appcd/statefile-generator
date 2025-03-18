import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureManagedDiskHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      storage_account_type: 'Premium_LRS',
      create_option: 'Empty',
      disk_size_gb: 128,
      zone: '1',
      disk_encryption_set_id: '${azurerm_disk_encryption_set.main.id}',
      disk_iops_read_write: 5000,
      disk_mbps_read_write: 200,
      hyper_v_generation: 'V2',
      image_reference_id: null,
      gallery_image_reference_id: null,
      os_type: null,
      source_resource_id: null,
      source_uri: null,
      storage_account_id: null,
      tier: 'P15',
      max_shares: 2,
      trusted_launch_enabled: true,
      security_type: 'TrustedLaunch',
      performance_plus_enabled: false,
      network_access_policy: 'AllowPrivate',
      disk_access_id: '${azurerm_disk_access.main.id}',
      public_network_access_enabled: false,
      encryption_settings: {
        enabled: true,
        disk_encryption_key: {
          secret_url: '${azurerm_key_vault_secret.disk_encryption_key.id}',
          source_vault_id: '${azurerm_key_vault.main.id}'
        },
        key_encryption_key: {
          key_url: '${azurerm_key_vault_key.disk_encryption.id}',
          source_vault_id: '${azurerm_key_vault.main.id}'
        }
      },
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        'azurerm_resource_group.main',
        'azurerm_disk_encryption_set.main',
        'azurerm_disk_access.main',
        'azurerm_key_vault.main',
        'azurerm_key_vault_secret.disk_encryption_key',
        'azurerm_key_vault_key.disk_encryption'
      ]
    }

    return attributes
  }
} 