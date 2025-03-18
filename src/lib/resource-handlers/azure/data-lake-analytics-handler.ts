import { Region } from '@/types/cloud'
import { generateResourceId } from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AzureDataLakeAnalyticsHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const analyticsId = generateResourceId()
    const resourceGroupId = generateResourceId()
    const storageAccountId = generateResourceId()
    
    const attributes: ResourceAttributes = {
      name: `adla-${analyticsId}`,
      resource_group_name: `rg-analytics-${resourceGroupId}`,
      location: region.code,
      tier: 'Consumption',
      default_store_account_name: `st${storageAccountId}`,
      firewall_allow_azure_ips: true,
      firewall_state: 'Enabled',
      storage_accounts: [
        {
          name: `st${storageAccountId}`,
          access_key: 'storage_account_access_key',
          suffix: 'core.windows.net'
        }
      ],
      storage_account_ids: [
        `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-analytics-${resourceGroupId}/providers/Microsoft.Storage/storageAccounts/st${storageAccountId}`
      ],
      tags: {
        environment: 'production'
      },
      depends_on: [
        `azurerm_resource_group.${resourceGroupId}`,
        `azurerm_storage_account.${storageAccountId}`
      ]
    }

    return attributes
  }
} 