import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureStreamAnalyticsJobHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      streaming_units: 3,
      transformation_query: `
        SELECT *
        INTO [YourOutputAlias]
        FROM [YourInputAlias]
        WHERE [User].[Score] > 80
      `,
      compatibility_level: '1.2',
      data_locale: 'en-US',
      events_late_arrival_max_delay_in_seconds: 60,
      events_out_of_order_max_delay_in_seconds: 50,
      events_out_of_order_policy: 'Adjust',
      output_error_policy: 'Drop',
      identity: {
        type: 'SystemAssigned'
      },
      job_storage_account: {
        authentication_mode: 'Msi',
        account_key: '${azurerm_storage_account.analytics.primary_access_key}',
        account_name: '${azurerm_storage_account.analytics.name}'
      },
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 