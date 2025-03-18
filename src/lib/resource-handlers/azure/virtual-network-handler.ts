import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureVirtualNetworkHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      address_space: ['10.0.0.0/16'],
      dns_servers: ['10.0.0.4', '10.0.0.5'],
      bgp_community: 'Vnet-Community-1',
      flow_timeout_in_minutes: 30,
      subnet: [
        {
          name: 'subnet1',
          address_prefix: '10.0.1.0/24',
          security_group: '${azurerm_network_security_group.main.id}',
          service_endpoints: ['Microsoft.Storage', 'Microsoft.Sql'],
          service_endpoint_policy_ids: [],
          private_endpoint_network_policies_enabled: true,
          private_link_service_network_policies_enabled: true,
          delegation: [
            {
              name: 'delegation',
              service_delegation: {
                name: 'Microsoft.ContainerInstance/containerGroups',
                actions: [
                  'Microsoft.Network/virtualNetworks/subnets/action'
                ]
              }
            }
          ]
        }
      ],
      ddos_protection_plan: {
        id: '${azurerm_network_ddos_protection_plan.main.id}',
        enable: true
      },
      encryption: {
        enforcement: 'AllowUnencrypted'
      },
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 