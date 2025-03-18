import { Region } from '@/types/cloud'
import {
  generateGcpKmsKeyName,
  generateGcpKmsKeyRingName,
  generateGcpProjectId,
  generateGcpServiceAccountEmail
} from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class GCPBigQueryHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const projectId = generateGcpProjectId()
    const keyRingName = generateGcpKmsKeyRingName('bq')
    const keyName = generateGcpKmsKeyName('bq')
    const sourceProjectId = generateGcpProjectId()
    
    const attributes: ResourceAttributes = {
      dataset_id: resourceName.toLowerCase(),
      friendly_name: `${resourceName} Dataset`,
      description: 'Managed BigQuery dataset for analytics',
      location: region.code,
      project: projectId,
      delete_contents_on_destroy: false,
      max_time_travel_hours: 168,
      default_table_expiration_ms: 2592000000,
      default_partition_expiration_ms: 5184000000,
      default_encryption_configuration: {
        kms_key_name: `projects/${projectId}/locations/global/keyRings/${keyRingName}/cryptoKeys/${keyName}`
      },
      access: [
        {
          role: 'OWNER',
          user_by_email: generateGcpServiceAccountEmail()
        },
        {
          role: 'READER',
          group_by_email: 'analytics-team@example.com'
        },
        {
          role: 'WRITER',
          special_group: 'projectWriters'
        },
        {
          view: {
            dataset_id: 'source_dataset',
            project_id: sourceProjectId,
            table_id: 'summary_view'
          }
        }
      ],
      default_capacity: {
        slots: 1000
      },
      default_collation: 'und:ci',
      storage_billing_model: 'LOGICAL',
      labels: {
        environment: 'production',
        team: 'analytics'
      }
    }

    return attributes
  }
} 