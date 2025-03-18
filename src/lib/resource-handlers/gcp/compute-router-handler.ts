import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPComputeRouterHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName.toLowerCase(),
      network: '${google_compute_network.main.self_link}',
      region: region.code,
      description: `Cloud Router for ${resourceName}`,
      encrypted_interconnect_router: true,
      bgp: {
        asn: 64514,
        advertise_mode: 'CUSTOM',
        advertised_groups: ['ALL_SUBNETS'],
        advertised_ip_ranges: [
          {
            range: '10.0.0.0/8'
          },
          {
            range: '172.16.0.0/12'
          }
        ]
      },
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