import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AWSECRRegistryScanningConfigurationHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      scan_type: 'ENHANCED',
      rule: [
        {
          scan_frequency: 'CONTINUOUS_SCAN',
          repository_filter: [
            {
              filter: '*',
              filter_type: 'WILDCARD'
            }
          ]
        }
      ],
      rules: [
        {
          scan_frequency: 'SCAN_ON_PUSH',
          repository_filter: [
            {
              filter: 'prod/*',
              filter_type: 'WILDCARD'
            }
          ]
        },
        {
          scan_frequency: 'CONTINUOUS_SCAN',
          repository_filter: [
            {
              filter: 'dev/*',
              filter_type: 'WILDCARD'
            }
          ]
        }
      ]
    }

    return attributes
  }
} 