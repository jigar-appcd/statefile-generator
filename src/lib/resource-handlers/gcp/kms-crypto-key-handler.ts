import { Region } from '@/types/cloud'
import { generateResourceId } from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class GCPKMSCryptoKeyHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const keyId = generateResourceId()
    const keyRingId = generateResourceId()
    const projectId = generateResourceId()
    
    const attributes: ResourceAttributes = {
      name: `key-${keyId}`,
      key_ring: `projects/project-${projectId}/locations/global/keyRings/kr-${keyRingId}`,
      rotation_period: '7776000s',
      purpose: 'ENCRYPT_DECRYPT',
      version_template: {
        algorithm: 'GOOGLE_SYMMETRIC_ENCRYPTION',
        protection_level: 'HSM'
      },
      labels: {
        environment: 'production'
      },
      depends_on: [
        `google_project.${projectId}`,
        `google_kms_key_ring.${keyRingId}`
      ]
    }

    return attributes
  }
} 