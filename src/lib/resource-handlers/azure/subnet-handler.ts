
import { generateResourceGroupName, generateVnetName } from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AzureSubnetHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      resource_group_name: generateResourceGroupName('prod', 'network'),
      virtual_network_name: generateVnetName('prod'),
      address_prefixes: ['10.0.1.0/24'],
      service_endpoints: [
        'Microsoft.Storage',
        'Microsoft.Sql',
        'Microsoft.KeyVault',
        'Microsoft.ContainerRegistry'
      ],
      private_endpoint_network_policies_enabled: true,
      private_link_service_network_policies_enabled: true,
      delegation: [
        {
          name: 'aks-delegation',
          service_delegation: {
            name: 'Microsoft.ContainerInstance/containerGroups',
            actions: [
              'Microsoft.Network/virtualNetworks/subnets/action'
            ]
          }
        }
      ],
      timeouts: {
        create: '30m',
        read: '5m',
        update: '30m',
        delete: '30m'
      }
    }

    return attributes
  }
} 