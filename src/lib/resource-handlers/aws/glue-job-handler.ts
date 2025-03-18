import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateGlueJobId,
    generateKmsKeyId,
    generateS3BucketId
} from '../base-handler'

export class AWSGlueJobHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const jobId = generateGlueJobId()
    const scriptBucketId = generateS3BucketId()
    const tempBucketId = generateS3BucketId()
    const kmsKeyId = generateKmsKeyId()
    
    const attributes: ResourceAttributes = {
      name: `${resourceName}-${jobId}`,
      role_arn: 'REPLACE_WITH_ROLE_ARN',
      description: `Glue ETL job for ${resourceName}`,
      max_retries: 0,
      timeout: 2880,
      max_capacity: 10,
      worker_type: 'G.1X',
      number_of_workers: 2,
      glue_version: '4.0',
      execution_class: 'STANDARD',
      default_arguments: {
        '--enable-metrics': 'true',
        '--enable-spark-ui': 'true',
        '--enable-job-insights': 'true',
        '--enable-continuous-cloudwatch-log': 'true',
        '--enable-glue-datacatalog': 'true',
        '--TempDir': `s3://${tempBucketId}/temporary/`,
        '--job-language': 'python',
        '--job-bookmark-option': 'job-bookmark-enable',
        '--enable-auto-scaling': 'true'
      },
      non_overridable_arguments: {
        '--encryption-type': 'sse-kms',
        '--encryption-key': kmsKeyId
      },
      command: {
        name: 'glueetl',
        python_version: '3',
        script_location: `s3://${scriptBucketId}/scripts/job.py`
      },
      connections: [],
      notification_property: {
        notify_delay_after: 10
      },
      security_configuration: null,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_s3_bucket.${scriptBucketId}`,
        `aws_s3_bucket.${tempBucketId}`,
        `aws_kms_key.${kmsKeyId}`
      ]
    }

    return attributes
  }
} 