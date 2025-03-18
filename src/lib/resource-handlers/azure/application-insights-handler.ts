import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureApplicationInsightsHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      application_type: 'web',
      retention_in_days: 90,
      daily_data_cap_in_gb: 100,
      daily_data_cap_notifications_disabled: false,
      disable_ip_masking: false,
      workspace_id: '${azurerm_log_analytics_workspace.main.id}',
      local_authentication_disabled: true,
      internet_ingestion_enabled: true,
      internet_query_enabled: true,
      force_customer_storage_for_profiler: false,
      sampling_percentage: 100,
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 