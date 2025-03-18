import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class ECSServiceConnectConfigHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const sgId = generateResourceId('sg')
    const subnetId1 = generateResourceId('subnet')
    const subnetId2 = generateResourceId('subnet')
    const logGroupId = generateResourceId('log')
    const roleId = generateResourceId('role')
    const namespaceId = generateResourceId('namespace')
    const accountId = '123456789012'
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      namespace: `${resourceName}-${namespaceId}`,
      service_connect_configuration: {
        enabled: true,
        namespace: `${resourceName}-${namespaceId}`,
        service: {
          client_alias: [
            {
              dns_name: resourceName,
              port: 8080
            }
          ],
          discovery_name: resourceName,
          ingress_port_override: 8080,
          port_name: resourceName
        }
      },
      network_configuration: {
        subnets: [
          subnetId1,
          subnetId2
        ],
        security_groups: [sgId],
        assign_public_ip: true
      },
      log_configuration: {
        log_driver: 'awslogs',
        options: {
          'awslogs-group': `${resourceName}-${logGroupId}`,
          'awslogs-region': 'us-west-2',
          'awslogs-stream-prefix': resourceName
        }
      },
      task_role_arn: `arn:aws:iam::${accountId}:role/${resourceName}-task-${roleId}`,
      execution_role_arn: `arn:aws:iam::${accountId}:role/${resourceName}-execution-${roleId}`,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_security_group.${sgId}`,
        `aws_subnet.${subnetId1}`,
        `aws_subnet.${subnetId2}`,
        `aws_cloudwatch_log_group.${logGroupId}`,
        `aws_iam_role.${roleId}`,
        `aws_service_discovery_private_dns_namespace.${namespaceId}`
      ]
    }

    return attributes
  }
} 