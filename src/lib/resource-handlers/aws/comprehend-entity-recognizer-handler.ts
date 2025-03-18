import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateKmsKeyId,
    generateResourceId,
    generateS3BucketId
} from '../base-handler'

export class AWSComprehendEntityRecognizerHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const dataBucketId = generateS3BucketId()
    const outputBucketId = generateS3BucketId()
    const kmsKeyId = generateKmsKeyId()
    const roleId = generateResourceId('role')
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      language_code: 'en',
      data_access_role_arn: `REPLACE_WITH_ROLE_ARN_${roleId}`,
      model_kms_key_id: kmsKeyId,
      version_name: 'v1',
      volume_kms_key_id: kmsKeyId,
      vpc_config: null,
      input_data_config: {
        data_format: 'COMPREHEND_CSV',
        entity_types: [
          {
            type: 'PERSON',
            min_confidence: 0.5
          },
          {
            type: 'ORGANIZATION',
            min_confidence: 0.5
          },
          {
            type: 'LOCATION',
            min_confidence: 0.5
          }
        ],
        documents: {
          s3_uri: `s3://${dataBucketId}/training/documents/`,
          input_format: 'ONE_DOC_PER_LINE'
        },
        entity_list: {
          s3_uri: `s3://${dataBucketId}/training/entities.csv`
        },
        annotations: {
          s3_uri: `s3://${dataBucketId}/training/annotations.csv`
        }
      },
      output_data_config: {
        s3_uri: `s3://${outputBucketId}/output/`,
        kms_key_id: kmsKeyId
      },
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_s3_bucket.${dataBucketId}`,
        `aws_s3_bucket.${outputBucketId}`,
        `aws_kms_key.${kmsKeyId}`,
        `aws_iam_role.${roleId}`
      ]
    }

    return attributes
  }
} 