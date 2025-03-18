import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateDynamoTableId,
    generateKmsKeyId
} from '../base-handler'

export class AWSDynamoDBTableHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const tableId = generateDynamoTableId()
    const kmsKeyId = generateKmsKeyId()
    
    const attributes: ResourceAttributes = {
      name: `${resourceName}-${tableId}`,
      billing_mode: 'PAY_PER_REQUEST',
      hash_key: 'id',
      range_key: 'timestamp',
      attribute: [
        {
          name: 'id',
          type: 'S'
        },
        {
          name: 'timestamp',
          type: 'N'
        }
      ],
      ttl: {
        enabled: true,
        attribute_name: 'ttl'
      },
      point_in_time_recovery: {
        enabled: true
      },
      server_side_encryption: {
        enabled: true,
        kms_key_arn: kmsKeyId
      },
      stream_enabled: true,
      stream_view_type: 'NEW_AND_OLD_IMAGES',
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_kms_key.${kmsKeyId}`,
        `aws_dynamodb_table.${tableId}`
      ]
    }

    return attributes
  }
} 