import { Region } from '@/types/cloud'
import { generateResourceId } from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AWSECRRegistryReplicationConfigurationHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const kmsKeyId = generateResourceId()
    
    const attributes: ResourceAttributes = {
      replication_configuration: {
        rules: [
          {
            destinations: [
              {
                region: 'us-west-2',
                registry_id: '123456789012'
              }
            ]
          }
        ]
      }
    }

    return attributes
  }
} 