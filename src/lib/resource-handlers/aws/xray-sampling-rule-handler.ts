import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class XRaySamplingRuleHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      rule_name: resourceName,
      priority: 1000,
      version: 1,
      reservoir_size: 60,
      fixed_rate: 0.05,
      url_path: '*',
      host: '*',
      http_method: '*',
      service_name: '*',
      service_type: '*',
      resource_arn: '*',
      attributes: {
        environment: 'production'
      },
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