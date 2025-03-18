import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateS3BucketId
} from '../base-handler'

export class AWSGlueCatalogDatabaseHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const locationBucketId = generateS3BucketId()
    
    const attributes: ResourceAttributes = {
      name: resourceName.replace(/-/g, '_'),
      description: `Glue catalog database for ${resourceName}`,
      catalog_id: null,
      create_table_default_permission: [
        {
          permissions: ['SELECT', 'ALTER', 'INSERT', 'DROP']
        }
      ],
      force_destroy: true,
      location_uri: `s3://${locationBucketId}/databases/`,
      target_database: null,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_s3_bucket.${locationBucketId}`
      ]
    }

    return attributes
  }
} 