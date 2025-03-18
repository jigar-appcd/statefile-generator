import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AthenaDatabaseHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      bucket: '${aws_s3_bucket.athena_results.id}',
      force_destroy: true,
      encryption_configuration: {
        encryption_option: 'SSE_S3'
      },
      expected_bucket_owner: '${data.aws_caller_identity.current.account_id}',
      acl_configuration: {
        s3_acl_option: 'BUCKET_OWNER_FULL_CONTROL'
      },
      properties: {
        'has_encrypted_data': 'true',
        'creator': 'Athena'
      },
      comment: `Athena database for ${resourceName}`,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      tags_all: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 