import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateArn,
    generateBeanstalkAppId,
    generateBeanstalkInstanceProfileId,
    generateBeanstalkRoleId,
    generateSecurityGroupId,
    generateSubnetId
} from '../base-handler'

export class AWSElasticBeanstalkEnvironmentHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const appId = generateBeanstalkAppId()
    const roleId = generateBeanstalkRoleId()
    const instanceProfileId = generateBeanstalkInstanceProfileId()
    const sgId = generateSecurityGroupId()
    const subnetId1 = generateSubnetId()
    const subnetId2 = generateSubnetId()
    const accountId = '123456789012' // Using a static account ID for consistency
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      application: appId,
      solution_stack_name: '64bit Amazon Linux 2 v5.8.0 running Node.js 18',
      tier: 'WebServer',
      setting: [
        {
          namespace: 'aws:autoscaling:launchconfiguration',
          name: 'IamInstanceProfile',
          value: generateArn('iam', region, accountId, 'instance-profile', `aws-elasticbeanstalk-ec2-role-${instanceProfileId}`)
        },
        {
          namespace: 'aws:autoscaling:launchconfiguration',
          name: 'SecurityGroups',
          value: sgId
        },
        {
          namespace: 'aws:ec2:vpc',
          name: 'Subnets',
          value: `${subnetId1},${subnetId2}`
        },
        {
          namespace: 'aws:elasticbeanstalk:environment',
          name: 'ServiceRole',
          value: generateArn('iam', region, accountId, 'role', `aws-elasticbeanstalk-service-role-${roleId}`)
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          name: 'NODE_ENV',
          value: 'production'
        },
        {
          namespace: 'aws:autoscaling:asg',
          name: 'MinSize',
          value: '1'
        },
        {
          namespace: 'aws:autoscaling:asg',
          name: 'MaxSize',
          value: '4'
        },
        {
          namespace: 'aws:elasticbeanstalk:environment',
          name: 'EnvironmentType',
          value: 'LoadBalanced'
        }
      ],
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_elastic_beanstalk_application.${appId}`,
        `aws_iam_role.${roleId}`,
        `aws_iam_instance_profile.${instanceProfileId}`,
        `aws_security_group.${sgId}`,
        `aws_subnet.${subnetId1}`,
        `aws_subnet.${subnetId2}`
      ]
    }

    return attributes
  }
} 