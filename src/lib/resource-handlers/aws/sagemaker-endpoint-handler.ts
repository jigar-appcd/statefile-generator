import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class AWSSageMakerEndpointHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const configId = generateResourceId('config')
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      endpoint_config_name: configId,
      deployment_config: {
        auto_rollback_configuration: {
          alarms: [
            {
              alarm_name: 'REPLACE_WITH_ALARM_NAME'
            }
          ]
        },
        blue_green_update_policy: {
          traffic_routing_configuration: {
            type: 'LINEAR',
            wait_interval_in_seconds: 300,
            canary_size: {
              type: 'CAPACITY_PERCENT',
              value: 10
            },
            linear_step_size: {
              type: 'CAPACITY_PERCENT',
              value: 20
            }
          },
          maximum_execution_timeout_in_seconds: 3600,
          termination_wait_in_seconds: 300
        }
      },
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_sagemaker_endpoint_configuration.${configId}`
      ]
    }

    return attributes
  }
} 