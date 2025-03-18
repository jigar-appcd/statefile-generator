import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureSearchServiceHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      sku: 'standard3',
      replica_count: 3,
      partition_count: 6,
      hosting_mode: 'highDensity',
      public_network_access_enabled: false,
      authentication_failure_mode: 'http401WithBearerChallenge',
      customer_managed_key_enforcement_enabled: true,
      local_authentication_enabled: false,
      identity: {
        type: 'SystemAssigned'
      },
      allowed_ips: ['10.0.0.0/24'],
      private_endpoint_connection: [
        {
          name: 'endpoint1',
          private_service_connection: {
            name: 'privateserviceconnection',
            is_manual_connection: false,
            private_connection_resource_id: '${azurerm_private_endpoint.search.id}',
            subresource_names: ['searchService']
          }
        }
      ],
      query_keys: [
        {
          name: 'readonly',
          value: '${random_string.search_key.result}'
        }
      ],
      semantic_search: {
        configuration: {
          default: {
            language: 'en-us'
          }
        }
      },
      encryption: {
        key_vault_key_id: '${azurerm_key_vault_key.search.id}',
        identity_client_id: '${azurerm_user_assigned_identity.search.client_id}'
      },
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 