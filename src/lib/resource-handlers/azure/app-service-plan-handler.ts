import { Region } from '@/types/cloud'
import {
    generateResourceGroupName,
    generateResourceId
} from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AzureAppServicePlanHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const resourceGroupName = generateResourceGroupName('prod', 'app')
    const planId = generateResourceId()
    
    const attributes: ResourceAttributes = {
      name: `asp-${planId}`,
      resource_group_name: resourceGroupName,
      location: region.code,
      os_type: 'Linux',
      sku_name: 'P1v2',
      per_site_scaling_enabled: false,
      zone_balancing_enabled: true,
      maximum_elastic_worker_count: 20,
      worker_count: 3,
      app_service_environment_id: null,
      tags: {
        environment: 'production'
      },
      depends_on: [
        `azurerm_resource_group.${resourceGroupName}`
      ]
    }

    return attributes
  }
} 