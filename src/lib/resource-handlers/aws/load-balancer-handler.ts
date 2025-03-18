import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class LoadBalancerHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName.toLowerCase(),
      internal: false,
      load_balancer_type: 'application',
      security_groups: ['${aws_security_group.lb.id}'],
      subnets: ['${aws_subnet.public_1.id}', '${aws_subnet.public_2.id}'],
      enable_deletion_protection: false,
      enable_cross_zone_load_balancing: true,
      enable_http2: true,
      idle_timeout: 60,
      ip_address_type: 'ipv4',
      customer_owned_ipv4_pool: '',
      desync_mitigation_mode: 'defensive',
      drop_invalid_header_fields: false,
      enable_waf_fail_open: false,
      preserve_host_header: false,
      subnet_mapping: [
        {
          subnet_id: '${aws_subnet.public_1.id}',
          allocation_id: '${aws_eip.lb_1.id}',
          private_ipv4_address: '',
          ipv6_address: ''
        },
        {
          subnet_id: '${aws_subnet.public_2.id}',
          allocation_id: '${aws_eip.lb_2.id}',
          private_ipv4_address: '',
          ipv6_address: ''
        }
      ],
      access_logs: {
        bucket: '${aws_s3_bucket.lb_logs.bucket}',
        prefix: 'lb-logs',
        enabled: true
      },
      timeouts: {
        create: '10m',
        update: '10m',
        delete: '10m'
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