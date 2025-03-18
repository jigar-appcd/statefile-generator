import {
    ResourceAttributes,
    ResourceHandler,
    generateResourceId
} from '../base-handler'

export class ECSServiceConnectSecurityGroupRuleHandler implements ResourceHandler {
  getAttributes(): ResourceAttributes {
    const sgId = generateResourceId('sg')
    const sourceSgId = generateResourceId('source-sg')
    
    const attributes: ResourceAttributes = {
      type: 'ingress',
      description: 'Allow inbound traffic from source security group',
      from_port: 0,
      to_port: 65535,
      protocol: 'tcp',
      security_group_id: sgId,
      source_security_group_id: sourceSgId,
      depends_on: [
        `aws_security_group.${sgId}`,
        `aws_security_group.${sourceSgId}`
      ]
    }

    return attributes
  }
} 