import { Region } from '@/types/cloud'
import { generateResourceId } from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AzureLogAnalyticsWorkspaceHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const workspaceId = generateResourceId()
    const resourceGroupId = generateResourceId()
    
    const attributes: ResourceAttributes = {
      name: `law-${workspaceId}`,
      resource_group_name: `rg-logs-${resourceGroupId}`,
      location: region.code,
      sku: 'PerGB2018',
      retention_in_days: 30,
      daily_quota_gb: 5,
      internet_ingestion_enabled: true,
      internet_query_enabled: true,
      reservation_capacity_in_gb_per_day: 100,
      features: {
        enable_log_access_using_only_resource_permissions: true,
        search_version: 2
      },
      identity: {
        type: 'SystemAssigned'
      },
      tags: {
        environment: 'production'
      },
      depends_on: [
        `azurerm_resource_group.${resourceGroupId}`
      ]
    }

    return attributes
  }
} 