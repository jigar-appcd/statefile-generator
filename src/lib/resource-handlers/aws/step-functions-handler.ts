import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class StepFunctionsHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: `${resourceName}-${generateResourceId()}`,
      role_arn: '${aws_iam_role.step_functions.arn}',
      definition: JSON.stringify({
        Comment: 'A sample Step Functions state machine',
        StartAt: 'ProcessData',
        States: {
          ProcessData: {
            Type: 'Task',
            Resource: '${aws_lambda_function.processor.arn}',
            Next: 'CheckResult'
          },
          CheckResult: {
            Type: 'Choice',
            Choices: [
              {
                Variable: '$.status',
                StringEquals: 'SUCCESS',
                Next: 'SuccessState'
              }
            ],
            Default: 'FailState'
          },
          SuccessState: {
            Type: 'Succeed'
          },
          FailState: {
            Type: 'Fail',
            Cause: 'Data processing failed'
          }
        }
      }),
      type: 'STANDARD',
      publish: true,
      logging_configuration: {
        level: 'ALL',
        include_execution_data: true,
        destinations: [
          {
            cloudwatch_logs_log_group: {
              log_group_arn: '${aws_cloudwatch_log_group.step_functions.arn}'
            }
          }
        ]
      },
      tracing_configuration: {
        enabled: true
      },
      state_machine_version_description: 'Initial version',
      tags: {
        Name: resourceName,
        ...commonTags
      },
      tags_all: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        'aws_iam_role.step_functions',
        'aws_lambda_function.processor',
        'aws_cloudwatch_log_group.step_functions'
      ]
    }

    return attributes
  }
} 