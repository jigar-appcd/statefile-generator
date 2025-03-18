import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateGlueCrawlerId,
    generateS3BucketId
} from '../base-handler'

export class AWSGlueCrawlerHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const crawlerId = generateGlueCrawlerId()
    const sourceBucketId = generateS3BucketId()
    
    const attributes: ResourceAttributes = {
      name: `${resourceName}-${crawlerId}`,
      role_arn: 'REPLACE_WITH_ROLE_ARN',
      database_name: resourceName.replace(/-/g, '_'),
      description: `Glue crawler for ${resourceName}`,
      schedule: 'cron(0 1 * * ? *)',
      classifiers: [],
      configuration: JSON.stringify({
        Version: 1.0,
        CrawlerOutput: {
          Partitions: { AddOrUpdateBehavior: 'InheritFromTable' },
          Tables: { AddOrUpdateBehavior: 'MergeNewColumns' }
        },
        Grouping: { TableGroupingPolicy: 'CombineCompatibleSchemas' }
      }),
      delta_target: null,
      jdbc_target: null,
      mongodb_target: null,
      s3_target: [
        {
          path: `s3://${sourceBucketId}/data/`,
          exclusions: ['**.tmp', '**.temp', '**/_temporary/**'],
          sample_size: 100
        }
      ],
      schema_change_policy: {
        delete_behavior: 'LOG',
        update_behavior: 'UPDATE_IN_DATABASE'
      },
      recrawl_policy: {
        recrawl_behavior: 'CRAWL_EVERYTHING'
      },
      lineage_configuration: {
        crawler_lineage_settings: 'ENABLE'
      },
      lake_formation_configuration: {
        use_lake_formation_credentials: false,
        account_id: null
      },
      security_configuration: null,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_s3_bucket.${sourceBucketId}`
      ]
    }

    return attributes
  }
} 