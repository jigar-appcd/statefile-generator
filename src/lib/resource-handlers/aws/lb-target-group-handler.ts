import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class LBTargetGroupHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: `${resourceName}-${generateResourceId()}`,
      port: 80,
      protocol: 'HTTP',
      protocol_version: 'HTTP1',
      vpc_id: '${aws_vpc.main.id}',
      target_type: 'instance',
      deregistration_delay: 300,
      slow_start: 0,
      proxy_protocol_v2: false,
      preserve_client_ip: true,
      connection_termination: false,
      lambda_multi_value_headers_enabled: false,
      load_balancing_algorithm_type: 'round_robin',
      stickiness: {
        enabled: false,
        type: 'lb_cookie',
        cookie_duration: 86400,
        cookie_name: null
      },
      health_check: {
        enabled: true,
        path: '/health',
        port: 'traffic-port',
        protocol: 'HTTP',
        healthy_threshold: 3,
        unhealthy_threshold: 3,
        timeout: 5,
        interval: 30,
        matcher: '200'
      },
      tags: {
        Name: resourceName,
        ...commonTags
      },
      tags_all: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        'aws_vpc.main'
      ]
    }

    return attributes
  }
} 