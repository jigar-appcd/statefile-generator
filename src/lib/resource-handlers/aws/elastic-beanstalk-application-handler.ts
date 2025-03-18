import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateArn,
    generateBeanstalkRoleId
} from '../base-handler'

export class AWSElasticBeanstalkApplicationHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const roleId = generateBeanstalkRoleId()
    const accountId = '123456789012' // Using a static account ID for consistency
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      description: 'Elastic Beanstalk application',
      appversion_lifecycle: {
        service_role: generateArn('iam', region, accountId, 'role', `aws-elasticbeanstalk-service-role-${roleId}`),
        max_count: 128,
        delete_source_from_s3: true
      },
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