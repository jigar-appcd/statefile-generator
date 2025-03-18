import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureCognitiveServicesHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      kind: 'ComputerVision',
      sku_name: 'S1',
      custom_subdomain_name: resourceName.toLowerCase(),
      public_network_access_enabled: false,
      outbound_network_access_restricted: true,
      local_auth_enabled: false,
      network_acls: {
        default_action: 'Deny',
        ip_rules: ['10.0.0.0/24'],
        virtual_network_rules: [
          {
            subnet_id: '${azurerm_subnet.cognitive.id}',
            ignore_missing_vnet_service_endpoint: false
          }
        ]
      },
      customer_managed_key: {
        key_vault_key_id: '${azurerm_key_vault_key.cognitive.id}',
        identity_client_id: '${azurerm_user_assigned_identity.cognitive.client_id}'
      },
      identity: {
        type: 'SystemAssigned, UserAssigned',
        identity_ids: ['${azurerm_user_assigned_identity.cognitive.id}']
      },
      metrics_advisor_aad: {
        super_user: {
          object_id: '${data.azuread_user.admin.object_id}',
          tenant_id: '${data.azurerm_client_config.current.tenant_id}'
        }
      },
      qna_runtime_endpoint: 'https://qnamaker.azure.com',
      storage: {
        storage_account_id: '${azurerm_storage_account.cognitive.id}'
      },
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 