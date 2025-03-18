import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateKmsKeyId
} from '../base-handler'

export class AWSGlueSecurityConfigurationHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const kmsKeyId = generateKmsKeyId()
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      encryption_configuration: {
        cloudwatch_encryption: {
          cloudwatch_encryption_mode: 'SSE-KMS',
          kms_key_arn: kmsKeyId
        },
        job_bookmarks_encryption: {
          job_bookmarks_encryption_mode: 'CSE-KMS',
          kms_key_arn: kmsKeyId
        },
        s3_encryption: {
          s3_encryption_mode: 'SSE-KMS',
          kms_key_arn: kmsKeyId
        }
      },
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_kms_key.${kmsKeyId}`
      ]
    }

    return attributes
  }
} 