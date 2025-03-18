import { Region } from '@/types/cloud'
import {
    generateGcpProjectId,
    generateGcpServiceAccountEmail,
    generateS3BucketName
} from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class GCPCloudFunctionHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const projectId = generateGcpProjectId()
    const bucketName = generateS3BucketName('gcf-source')
    
    const attributes: ResourceAttributes = {
      name: resourceName.toLowerCase(),
      description: `Cloud Function for ${resourceName}`,
      runtime: 'nodejs16',
      available_memory_mb: 256,
      timeout_seconds: 60,
      max_instances: 10,
      min_instances: 0,
      trigger_http: true,
      entry_point: 'handleRequest',
      source_archive_bucket: bucketName,
      source_archive_object: 'function-source.zip',
      service_account_email: generateGcpServiceAccountEmail(),
      vpc_connector: `projects/${projectId}/locations/${region.code}/connectors/serverless-vpc`,
      vpc_connector_egress_settings: 'ALL_TRAFFIC',
      ingress_settings: 'ALLOW_INTERNAL_ONLY',
      environment_variables: {
        NODE_ENV: 'production'
      },
      labels: {
        environment: 'production'
      }
    }

    return attributes
  }
} 