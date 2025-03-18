import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateArn,
    generateResourceId
} from '../base-handler'

export class AWSConfigRuleHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const roleId = generateResourceId('role')
    const accountId = '123456789012'
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      description: `Config rule for ${resourceName}`,
      source: {
        owner: 'AWS',
        source_identifier: 'REQUIRED_TAGS',
        source_detail: [
          {
            message_type: 'ConfigurationItemChangeNotification'
          },
          {
            message_type: 'OversizedConfigurationItemChangeNotification'
          }
        ]
      },
      scope: {
        compliance_resource_types: [
          'AWS::EC2::Instance',
          'AWS::EC2::Volume',
          'AWS::RDS::DBInstance',
          'AWS::S3::Bucket'
        ]
      },
      input_parameters: JSON.stringify({
        tag1Key: 'Name',
        tag1Value: resourceName,
        tag2Key: 'Environment',
        tag2Value: commonTags.Environment
      }),
      maximum_execution_frequency: 'TwentyFour_Hours',
      role_arn: generateArn('iam', region, accountId, 'role', `${resourceName}-config-${roleId}`),
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_iam_role.${roleId}`
      ]
    }

    return attributes
  }
} 