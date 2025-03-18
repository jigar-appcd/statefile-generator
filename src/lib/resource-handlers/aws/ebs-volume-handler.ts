import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class EBSVolumeHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      availability_zone: `${region.code}a`,
      encrypted: true,
      final_snapshot: true,
      iops: 3000,
      multi_attach_enabled: false,
      size: 20,
      snapshot_id: null,
      type: 'gp3',
      throughput: 125,
      outpost_arn: null,
      kms_key_id: null,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      tags_all: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 