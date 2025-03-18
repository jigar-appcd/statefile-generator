import { Region } from '@/types/cloud'
import {
    generateGcpFirewallName,
    generateGcpNetworkName,
    generateGcpProjectId,
    generateGcpSubnetworkName
} from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class GCPComputeNetworkHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const projectId = generateGcpProjectId()
    const networkName = generateGcpNetworkName(resourceName)
    const subnetName = generateGcpSubnetworkName(resourceName)
    const firewallName = generateGcpFirewallName(resourceName)
    
    const attributes: ResourceAttributes = {
      name: networkName,
      project: projectId,
      auto_create_subnetworks: false,
      routing_mode: 'REGIONAL',
      mtu: 1460,
      delete_default_routes_on_create: false,
      subnetworks: [
        {
          name: subnetName,
          ip_cidr_range: '10.0.0.0/24',
          region: region.code,
          private_ip_google_access: true,
          secondary_ip_range: [
            {
              range_name: 'services',
              ip_cidr_range: '10.1.0.0/24'
            },
            {
              range_name: 'pods',
              ip_cidr_range: '10.2.0.0/24'
            }
          ]
        }
      ],
      firewall_rules: [
        {
          name: firewallName,
          direction: 'INGRESS',
          priority: 1000,
          source_ranges: ['0.0.0.0/0'],
          allow: [
            {
              protocol: 'tcp',
              ports: ['80', '443']
            }
          ]
        }
      ],
      labels: {
        environment: 'production'
      }
    }

    return attributes
  }
} 