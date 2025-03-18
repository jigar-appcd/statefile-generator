import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureServicePlanHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      os_type: 'Linux',
      sku_name: 'P1v2',
      per_site_scaling_enabled: false,
      zone_balancing_enabled: true,
      worker_count: 2,
      maximum_elastic_worker_count: 20,
      app_service_environment_id: null,
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 