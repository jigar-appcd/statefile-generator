import { Region } from '@/types/cloud'
import {
    generateResourceGroupName,
    generateResourceId,
    generateSubscriptionId
} from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AzurePrivateEndpointHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const resourceGroupName = generateResourceGroupName('prod', 'endpoint')
    const endpointId = generateResourceId()
    const subscriptionId = generateSubscriptionId()
    const storageAccountId = generateResourceId()
    
    const attributes: ResourceAttributes = {
      name: `pe-${endpointId}`,
      resource_group_name: resourceGroupName,
      location: region.code,
      subnet_id: `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/virtualNetworks/vnet-main/subnets/subnet-endpoints`,
      private_service_connection: {
        name: `psc-${endpointId}`,
        is_manual_connection: false,
        private_connection_resource_id: `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Storage/storageAccounts/${storageAccountId}`,
        subresource_names: ['blob'],
        request_message: null
      },
      custom_network_interface_name: `nic-${endpointId}`,
      private_dns_zone_group: {
        name: 'default',
        private_dns_zone_ids: [
          `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/privateDnsZones/privatelink.blob.core.windows.net`
        ]
      },
      ip_configuration: [
        {
          name: 'ipconfig1',
          private_ip_address: '10.0.1.4',
          subresource_name: 'blob',
          member_name: 'default'
        }
      ],
      tags: {
        environment: 'production'
      },
      depends_on: [
        `azurerm_resource_group.${resourceGroupName}`,
        `azurerm_storage_account.${storageAccountId}`,
        'azurerm_virtual_network.main',
        'azurerm_subnet.endpoints',
        'azurerm_private_dns_zone.blob'
      ]
    }

    return attributes
  }
} 