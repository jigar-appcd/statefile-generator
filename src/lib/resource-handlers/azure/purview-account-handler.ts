import { Region } from '@/types/cloud'
import {
    generateResourceGroupName,
    generateResourceId
} from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AzurePurviewAccountHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const resourceGroupName = generateResourceGroupName('prod', 'purview')
    const accountId = generateResourceId()
    
    const attributes: ResourceAttributes = {
      name: `pview-${accountId}`,
      resource_group_name: resourceGroupName,
      location: region.code,
      public_network_enabled: false,
      managed_resource_group_name: `${resourceGroupName}-purview-managed`,
      identity: {
        type: 'SystemAssigned'
      },
      managed_resources: {
        event_hub_namespace_id: null,
        storage_account_id: null,
        key_vault_id: null
      },
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