import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureKeyVaultHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      sku_name: 'premium',
      tenant_id: '${data.azurerm_client_config.current.tenant_id}',
      soft_delete_retention_days: 90,
      purge_protection_enabled: true,
      enabled_for_deployment: true,
      enabled_for_disk_encryption: true,
      enabled_for_template_deployment: true,
      enable_rbac_authorization: true,
      public_network_access_enabled: false,
      network_acls: {
        bypass: 'AzureServices',
        default_action: 'Deny',
        ip_rules: ['10.0.0.0/24'],
        virtual_network_subnet_ids: ['${azurerm_subnet.keyvault.id}']
      },
      access_policy: [
        {
          tenant_id: '${data.azurerm_client_config.current.tenant_id}',
          object_id: '${data.azurerm_client_config.current.object_id}',
          key_permissions: [
            'Get',
            'List',
            'Create',
            'Delete',
            'Update',
            'Import',
            'Backup',
            'Restore',
            'Recover'
          ],
          secret_permissions: [
            'Get',
            'List',
            'Set',
            'Delete',
            'Backup',
            'Restore',
            'Recover'
          ],
          certificate_permissions: [
            'Get',
            'List',
            'Create',
            'Import',
            'Delete',
            'Update',
            'Backup',
            'Restore',
            'Recover'
          ]
        }
      ],
      contact: [
        {
          email: 'admin@example.com',
          name: 'Admin',
          phone: '5555555555'
        }
      ],
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