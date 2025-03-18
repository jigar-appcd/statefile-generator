import { Region } from '@/types/cloud'
import {
    generateGcpDiskName,
    generateGcpKmsKeyName,
    generateGcpProjectId,
    generateGcpServiceAccountEmail
} from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class GCPComputeDiskHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const projectId = generateGcpProjectId()
    const kmsKeyName = generateGcpKmsKeyName('disk')
    
    const attributes: ResourceAttributes = {
      name: generateGcpDiskName(resourceName),
      type: 'pd-ssd',
      zone: region.code,
      size: 100,
      description: `Persistent disk for ${resourceName}`,
      physical_block_size_bytes: 4096,
      interface: 'SCSI',
      provisioned_iops: 0,
      snapshot: null,
      image: 'debian-cloud/debian-11',
      labels: {
        name: resourceName.toLowerCase(),
        environment: 'production'
      },
      disk_encryption_key: {
        kms_key_self_link: `projects/${projectId}/locations/global/keyRings/disk-encryption/cryptoKeys/${kmsKeyName}`,
        kms_key_service_account: generateGcpServiceAccountEmail()
      },
      snapshot_encryption_key: null,
      source_image_encryption_key: null,
      source_snapshot_encryption_key: null,
      depends_on: [
        'google_kms_crypto_key.disk',
        'google_service_account.disk'
      ]
    }

    return attributes
  }
} 