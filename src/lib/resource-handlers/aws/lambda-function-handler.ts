import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class LambdaFunctionHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region, index: number = 0): ResourceAttributes {
    const attributes: ResourceAttributes = {
      filename: null,
      function_name: `${resourceName}-${generateResourceId()}`,
      role: '${aws_iam_role.lambda_role.arn}',
      handler: 'index.handler',
      runtime: 'nodejs18.x',
      architectures: ['x86_64'],
      memory_size: 128,
      timeout: 3,
      reserved_concurrent_executions: -1,
      publish: true,
      package_type: 'Zip',
      vpc_config: {
        subnet_ids: ['${aws_subnet.main.id}'],
        security_group_ids: ['${aws_security_group.default.id}']
      },
      environment: {
        variables: {
          NODE_ENV: 'production',
          REGION: region.code
        }
      },
      dead_letter_config: null,
      tracing_config: {
        mode: 'Active'
      },
      layers: [],
      kms_key_arn: null,
      image_config: null,
      code_signing_config_arn: null,
      snap_start: {
        apply_on: 'None'
      },
      ephemeral_storage: {
        size: 512
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