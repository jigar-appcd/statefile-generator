import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPLoggingProjectSinkHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName.toLowerCase(),
      destination: '${google_storage_bucket.logs.id}',
      filter: 'severity >= WARNING',
      description: `Log sink for ${resourceName}`,
      disabled: false,
      exclusions: [
        {
          name: 'exclude_debug',
          description: 'Exclude debug logs',
          filter: 'severity <= DEBUG',
          disabled: false
        }
      ],
      unique_writer_identity: true,
      bigquery_options: {
        use_partitioned_tables: true
      },
      labels: {
        name: resourceName.toLowerCase(),
        ...commonTags
      },
      depends_on: [
        'google_storage_bucket.logs'
      ]
    }

    return attributes
  }
} 