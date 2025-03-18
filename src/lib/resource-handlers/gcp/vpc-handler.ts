import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPVPCHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      auto_create_subnetworks: false,
      routing_mode: 'REGIONAL',
      mtu: 1460,
      enable_ula_internal_ipv6: true,
      internal_ipv6_range: 'fd20::/20',
      network_firewall_policy_enforcement_order: 'AFTER_CLASSIC_FIREWALL',
      subnetwork: [
        {
          name: 'main',
          ip_cidr_range: '10.0.0.0/24',
          region: region.code,
          private_ip_google_access: true,
          purpose: 'PRIVATE',
          role: 'ACTIVE',
          secondary_ip_range: [
            {
              range_name: 'pods',
              ip_cidr_range: '10.1.0.0/16'
            },
            {
              range_name: 'services',
              ip_cidr_range: '10.2.0.0/16'
            }
          ],
          log_config: {
            aggregation_interval: 'INTERVAL_5_SEC',
            flow_sampling: 0.5,
            metadata: 'INCLUDE_ALL_METADATA'
          }
        }
      ],
      firewall_rule: [
        {
          name: 'allow-internal',
          direction: 'INGRESS',
          priority: 1000,
          source_ranges: ['10.0.0.0/8'],
          allow: [
            {
              protocol: 'tcp',
              ports: ['0-65535']
            },
            {
              protocol: 'udp',
              ports: ['0-65535']
            },
            {
              protocol: 'icmp'
            }
          ]
        },
        {
          name: 'allow-health-check',
          direction: 'INGRESS',
          priority: 1000,
          source_ranges: ['130.211.0.0/22', '35.191.0.0/16'],
          target_tags: ['load-balanced'],
          allow: [
            {
              protocol: 'tcp',
              ports: ['80', '443']
            }
          ]
        }
      ],
      route: [
        {
          name: 'internet',
          dest_range: '0.0.0.0/0',
          next_hop_gateway: 'default-internet-gateway',
          priority: 1000
        }
      ],
      peering: [
        {
          name: 'peering1',
          peer_network: '${google_compute_network.peer.self_link}',
          export_custom_routes: true,
          import_custom_routes: true,
          export_subnet_routes_with_public_ip: true,
          import_subnet_routes_with_public_ip: true
        }
      ],
      labels: {
        name: resourceName.toLowerCase(),
        ...commonTags
      }
    }

    return attributes
  }
} 