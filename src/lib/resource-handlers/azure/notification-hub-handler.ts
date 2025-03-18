import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureNotificationHubHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      namespace_name: '${azurerm_notification_hub_namespace.main.name}',
      apns_credential: {
        application_mode: 'Production',
        bundle_id: 'com.example.app',
        key_id: '${data.azurerm_key_vault_secret.apns_key_id.value}',
        team_id: '${data.azurerm_key_vault_secret.apns_team_id.value}',
        token: '${data.azurerm_key_vault_secret.apns_token.value}'
      },
      gcm_credential: {
        api_key: '${data.azurerm_key_vault_secret.gcm_api_key.value}'
      },
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 