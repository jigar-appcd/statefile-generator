import { Region } from '@/types/cloud'
import { generateResourceId } from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AzureNetworkSecurityGroupHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const nsgId = generateResourceId()
    const resourceGroupId = generateResourceId()
    const workspaceId = generateResourceId()
    const watcherId = generateResourceId()
    
    const attributes: ResourceAttributes = {
      name: `nsg-${nsgId}`,
      resource_group_name: `rg-network-${resourceGroupId}`,
      location: region.code,
      security_rule: [
        {
          name: 'allow-https',
          description: 'Allow HTTPS inbound',
          protocol: 'Tcp',
          source_port_range: '*',
          destination_port_range: '443',
          source_address_prefix: 'Internet',
          destination_address_prefix: 'VirtualNetwork',
          access: 'Allow',
          priority: 100,
          direction: 'Inbound'
        },
        {
          name: 'deny-all-inbound',
          description: 'Deny all inbound traffic',
          protocol: '*',
          source_port_range: '*',
          destination_port_range: '*',
          source_address_prefix: '*',
          destination_address_prefix: '*',
          access: 'Deny',
          priority: 4096,
          direction: 'Inbound'
        }
      ],
      flow_log: {
        enabled: true,
        retention_policy: {
          enabled: true,
          days: 7
        },
        network_watcher_flow_analytics: {
          enabled: true,
          workspace_region: region.code,
          traffic_analytics_interval: 10
        }
      },
      tags: {
        environment: 'production'
      },
      depends_on: [
        `azurerm_resource_group.${resourceGroupId}`,
        `azurerm_log_analytics_workspace.${workspaceId}`,
        `azurerm_network_watcher.${watcherId}`
      ]
    }

    return attributes
  }
} 