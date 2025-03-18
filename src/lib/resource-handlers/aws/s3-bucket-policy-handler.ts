import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    generateArn,
    generateResourceId
} from '../base-handler'

export class S3BucketPolicyHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const bucketId = generateResourceId('bucket').toLowerCase()
    const accountId = '123456789012'
    
    const attributes: ResourceAttributes = {
      bucket: `${resourceName}-${bucketId}`,
      policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Sid: `${resourceName}PublicReadGetObject`,
            Effect: 'Allow',
            Principal: {
              AWS: `arn:aws:iam::${accountId}:root`
            },
            Action: [
              's3:GetObject',
              's3:ListBucket'
            ],
            Resource: [
              generateArn('s3', region, accountId, 'bucket', `${resourceName}-${bucketId}`),
              `${generateArn('s3', region, accountId, 'bucket', `${resourceName}-${bucketId}`)}/*`
            ]
          }
        ]
      }),
      depends_on: [
        `aws_s3_bucket.${bucketId}`
      ]
    }

    return attributes
  }
} 