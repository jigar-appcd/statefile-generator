import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPComputeSubnetworkHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName.toLowerCase(),
      network: '${google_compute_network.main.self_link}',
      ip_cidr_range: '10.0.0.0/24',
      region: region.code,
      description: `Subnetwork for ${resourceName}`,
      private_ip_google_access: true,
      secondary_ip_range: [
        {
          range_name: 'pods',
          ip_cidr_range: '10.1.0.0/16'
        },
        {
          range_name: 'services',
          ip_cidr_range: '10.2.0.0/20'
        }
      ],
      log_config: {
        aggregation_interval: 'INTERVAL_5_SEC',
        flow_sampling: 0.5,
        metadata: 'INCLUDE_ALL_METADATA',
        metadata_fields: [],
        filter_expr: 'true'
      },
      purpose: 'PRIVATE',
      role: null,
      stack_type: 'IPV4_ONLY',
      ipv6_access_type: null,
      labels: {
        name: resourceName.toLowerCase(),
        ...commonTags
      },
      depends_on: [
        'google_compute_network.main'
      ]
    }

    return attributes
  }
} 