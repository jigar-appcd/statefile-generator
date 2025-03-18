import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateArn,
    generateDynamoTableId,
    generateKmsKeyId
} from '../base-handler'

export class AWSDynamoDBGlobalTableHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const tableId = generateDynamoTableId()
    const kmsKeyId = generateKmsKeyId()
    const replicaKmsKeyId = generateKmsKeyId()
    const accountId = '123456789012' // Using a static account ID for consistency
    const replicaRegion: Region = {
      id: 'us-west-2',
      code: 'us-west-2',
      name: 'US West (Oregon)',
      provider: 'aws'
    }
    
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
        kms_key_arn: generateArn('kms', region, accountId, 'key', kmsKeyId)
      },
      stream_enabled: true,
      stream_view_type: 'NEW_AND_OLD_IMAGES',
      replica: [
        {
          region_name: replicaRegion.code,
          kms_key_arn: generateArn('kms', replicaRegion, accountId, 'key', replicaKmsKeyId)
        }
      ],
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_kms_key.${kmsKeyId}`,
        `aws_kms_key.${replicaKmsKeyId}`,
        `aws_dynamodb_table.${tableId}`
      ]
    }

    return attributes
  }
} 