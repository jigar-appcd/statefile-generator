import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPComputeFirewallHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName.toLowerCase(),
      network: '${google_compute_network.main.self_link}',
      description: `Firewall rules for ${resourceName}`,
      direction: 'INGRESS',
      source_ranges: ['0.0.0.0/0'],
      source_tags: [],
      source_service_accounts: [],
      target_tags: ['web'],
      target_service_accounts: [],
      priority: 1000,
      enable_logging: true,
      allow: [
        {
          protocol: 'tcp',
          ports: ['80', '443']
        }
      ],
      deny: [],
      log_config: {
        metadata: 'INCLUDE_ALL_METADATA'
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