import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateInstanceId,
    generateSecurityGroupId,
    generateSubnetId
} from '../base-handler'

export class AWSELBHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const sgId = generateSecurityGroupId()
    const subnetId1 = generateSubnetId()
    const subnetId2 = generateSubnetId()
    const instanceId = generateInstanceId()
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      internal: false,
      security_groups: [sgId],
      subnets: [
        subnetId1,
        subnetId2
      ],
      cross_zone_load_balancing: true,
      idle_timeout: 60,
      connection_draining: true,
      connection_draining_timeout: 300,
      instances: [instanceId],
      listener: [
        {
          instance_port: 80,
          instance_protocol: 'http',
          lb_port: 80,
          lb_protocol: 'http'
        },
        {
          instance_port: 443,
          instance_protocol: 'https',
          lb_port: 443,
          lb_protocol: 'https',
          ssl_certificate_id: 'REPLACE_WITH_CERTIFICATE_ARN'
        }
      ],
      health_check: {
        healthy_threshold: 2,
        unhealthy_threshold: 2,
        timeout: 3,
        target: 'HTTP:80/health',
        interval: 30
      },
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_security_group.${sgId}`,
        `aws_subnet.${subnetId1}`,
        `aws_subnet.${subnetId2}`,
        `aws_instance.${instanceId}`
      ]
    }

    return attributes
  }
} 