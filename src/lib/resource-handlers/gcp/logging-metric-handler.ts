import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPLoggingMetricHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName.toLowerCase(),
      filter: 'resource.type="gce_instance" AND severity>=WARNING',
      description: `Custom metric for ${resourceName}`,
      metric_descriptor: {
        metric_kind: 'DELTA',
        value_type: 'INT64',
        unit: '1',
        display_name: resourceName,
        description: `Custom metric for ${resourceName}`,
        launch_stage: 'GA',
        labels: [
          {
            key: 'environment',
            value_type: 'STRING',
            description: 'Environment label'
          },
          {
            key: 'severity',
            value_type: 'STRING',
            description: 'Log severity'
          }
        ]
      },
      bucket_options: {
        linear_buckets: {
          num_finite_buckets: 3,
          width: 1,
          offset: 0
        }
      },
      value_extractor: '$.jsonPayload.value',
      label_extractors: {
        environment: 'EXTRACT($.resource.labels.environment)',
        severity: 'EXTRACT($.severity)'
      },
      labels: {
        name: resourceName.toLowerCase(),
        ...commonTags
      }
    }

    return attributes
  }
} 