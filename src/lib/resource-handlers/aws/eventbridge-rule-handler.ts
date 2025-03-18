import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class EventBridgeRuleHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: `${resourceName}-${generateResourceId()}`,
      description: `EventBridge rule for ${resourceName}`,
      event_bus_name: 'default',
      event_pattern: JSON.stringify({
        source: ['aws.ec2'],
        'detail-type': ['EC2 Instance State-change Notification'],
        detail: {
          state: ['running', 'stopped']
        }
      }),
      schedule_expression: 'rate(5 minutes)',
      state: 'ENABLED',
      role_arn: '${aws_iam_role.eventbridge.arn}',
      is_enabled: true,
      target: [
        {
          arn: '${aws_lambda_function.target.arn}',
          target_id: 'primary',
          input_transformer: {
            input_paths: {
              instance: '$.detail.instance-id',
              state: '$.detail.state'
            },
            input_template: '{"instance_id": <instance>, "state": <state>}'
          },
          retry_policy: {
            maximum_event_age_in_seconds: 86400,
            maximum_retry_attempts: 3
          },
          dead_letter_config: {
            arn: '${aws_sqs_queue.dlq.arn}'
          },
          role_arn: '${aws_iam_role.eventbridge_target.arn}'
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
        'aws_iam_role.eventbridge',
        'aws_lambda_function.target',
        'aws_sqs_queue.dlq',
        'aws_iam_role.eventbridge_target'
      ]
    }

    return attributes
  }
} 