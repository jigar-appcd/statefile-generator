import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPFilestoreInstanceHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName.toLowerCase(),
      location: region.code,
      tier: 'STANDARD',
      description: `Filestore instance for ${resourceName}`,
      file_shares: [
        {
          name: 'share1',
          capacity_gb: 1024,
          source_backup: null,
          nfs_export_options: [
            {
              ip_ranges: ['10.0.0.0/24'],
              access_mode: 'READ_WRITE',
              squash_mode: 'NO_ROOT_SQUASH',
              anon_uid: 65534,
              anon_gid: 65534
            }
          ]
        }
      ],
      networks: [
        {
          network: '${google_compute_network.main.name}',
          modes: ['MODE_IPV4'],
          connect_mode: 'DIRECT_PEERING',
          reserved_ip_range: '10.0.0.0/29'
        }
      ],
      kms_key_name: '${google_kms_crypto_key.filestore.id}',
      labels: {
        name: resourceName.toLowerCase(),
        ...commonTags
      },
      depends_on: [
        'google_compute_network.main',
        'google_kms_crypto_key.filestore'
      ]
    }

    return attributes
  }
} 