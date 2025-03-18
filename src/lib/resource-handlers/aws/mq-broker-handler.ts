import { Region } from '@/types/cloud'
import {
    generateAwsArn,
    generateResourceId,
    generateSecurityGroupId,
    generateSubnetId,
    generateValidPassword
} from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AWSMQBrokerHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const brokerId = generateResourceId()
    const kmsKeyId = generateResourceId()
    const configId = generateResourceId()
    
    const attributes: ResourceAttributes = {
      broker_name: `${resourceName}-${brokerId}`,
      engine_type: 'ActiveMQ',
      engine_version: '5.16.5',
      host_instance_type: 'mq.m5.large',
      deployment_mode: 'ACTIVE_STANDBY_MULTI_AZ',
      publicly_accessible: false,
      subnet_ids: [generateSubnetId(), generateSubnetId()],
      security_groups: [generateSecurityGroupId()],
      users: [
        {
          username: 'mqadmin',
          password: generateValidPassword(),
          groups: ['admin']
        }
      ],
      maintenance_window_start_time: {
        day_of_week: 'MONDAY',
        time_of_day: '02:00',
        time_zone: 'UTC'
      },
      encryption_options: {
        use_aws_owned_key: false,
        kms_key_id: generateAwsArn('kms', 'key', kmsKeyId, region.code)
      },
      configuration: {
        id: `mq-config-${configId}`,
        revision: 1
      },
      auto_minor_version_upgrade: true,
      logs: {
        general: true,
        audit: true
      },
      tags: {
        environment: 'production'
      },
      depends_on: [
        `aws_kms_key.${kmsKeyId}`,
        `aws_mq_configuration.${configId}`
      ]
    }

    return attributes
  }
} 