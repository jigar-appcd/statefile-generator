import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateSecurityGroupId,
    generateSubnetId,
    generateTargetGroupId
} from '../base-handler'

export class AWSELBv2Handler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const sgId = generateSecurityGroupId()
    const subnetId1 = generateSubnetId()
    const subnetId2 = generateSubnetId()
    const targetGroupId = generateTargetGroupId()
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      internal: false,
      load_balancer_type: 'application',
      security_groups: [sgId],
      subnets: [
        subnetId1,
        subnetId2
      ],
      enable_deletion_protection: true,
      enable_cross_zone_load_balancing: true,
      enable_http2: true,
      idle_timeout: 60,
      drop_invalid_header_fields: true,
      preserve_host_header: false,
      enable_waf_fail_open: false,
      desync_mitigation_mode: 'defensive',
      xff_header_processing_mode: 'append',
      listener: [
        {
          port: 80,
          protocol: 'HTTP',
          default_action: {
            type: 'redirect',
            redirect: {
              port: '443',
              protocol: 'HTTPS',
              status_code: 'HTTP_301'
            }
          }
        },
        {
          port: 443,
          protocol: 'HTTPS',
          ssl_policy: 'ELBSecurityPolicy-TLS-1-2-2017-01',
          certificate_arn: 'REPLACE_WITH_CERTIFICATE_ARN',
          default_action: {
            type: 'forward',
            target_group_arn: targetGroupId
          }
        }
      ],
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_security_group.${sgId}`,
        `aws_subnet.${subnetId1}`,
        `aws_subnet.${subnetId2}`,
        `aws_lb_target_group.${targetGroupId}`
      ]
    }

    return attributes
  }
} 