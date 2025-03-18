import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class S3BucketHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const bucketId = generateResourceId('bucket').toLowerCase()
    const kmsKeyId = generateResourceId('key')
    const accountId = '123456789012'
    
    const attributes: ResourceAttributes = {
      bucket: `${resourceName}-${bucketId}`,
      bucket_domain_name: `${resourceName}-${bucketId}.s3.amazonaws.com`,
      bucket_regional_domain_name: `${resourceName}-${bucketId}.s3.${region.code}.amazonaws.com`,
      force_destroy: true,
      hosted_zone_id: 'Z3AQBSTGFYJSTF',
      object_lock_enabled: true,
      request_payer: "BucketOwner",
      versioning: {
        enabled: true,
        mfa_delete: false
      },
      website: {
        error_document: `${resourceName}-error.html`,
        index_document: `${resourceName}-index.html`,
        routing_rules: ""
      },
      server_side_encryption_configuration: {
        rule: {
          apply_server_side_encryption_by_default: {
            sse_algorithm: "aws:kms",
            kms_master_key_id: `arn:aws:kms:${region.code}:${accountId}:key/${kmsKeyId}`
          },
          bucket_key_enabled: true
        }
      },
      lifecycle_rule: [
        {
          id: `${resourceName}-cleanup`,
          enabled: true,
          abort_incomplete_multipart_upload_days: 7,
          expiration: {
            days: 365,
            expired_object_delete_marker: true
          },
          transition: [
            {
              days: 30,
              storage_class: "STANDARD_IA"
            },
            {
              days: 60,
              storage_class: "GLACIER"
            }
          ]
        }
      ],
      tags: {
        Name: resourceName,
        ...commonTags
      },
      tags_all: {
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