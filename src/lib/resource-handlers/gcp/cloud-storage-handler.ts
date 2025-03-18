import { Region } from '@/types/cloud'
import { generateResourceId } from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class GCPCloudStorageHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const bucketId = generateResourceId()
    const projectId = generateResourceId()
    const keyRingId = generateResourceId()
    const keyId = generateResourceId()
    
    const attributes: ResourceAttributes = {
      name: `gcs-${bucketId}`,
      location: region.code,
      project: `project-${projectId}`,
      storage_class: 'STANDARD',
      uniform_bucket_level_access: true,
      versioning: {
        enabled: true
      },
      lifecycle_rule: [
        {
          condition: {
            age: 30,
            with_state: 'ARCHIVED'
          },
          action: {
            type: 'Delete'
          }
        }
      ],
      encryption: {
        default_kms_key_name: `projects/project-${projectId}/locations/global/keyRings/kr-${keyRingId}/cryptoKeys/key-${keyId}`
      },
      cors: [
        {
          origin: ['*'],
          method: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'],
          response_header: ['*'],
          max_age_seconds: 3600
        }
      ],
      labels: {
        environment: 'production'
      },
      depends_on: [
        `google_project.${projectId}`,
        `google_kms_key_ring.${keyRingId}`,
        `google_kms_crypto_key.${keyId}`
      ]
    }

    return attributes
  }
} 