import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class ECSServiceConnectSecurityGroupHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const vpcId = generateResourceId('vpc')
    const sourceSgId = generateResourceId('sg')
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      description: `Security group for ${resourceName} Service Connect`,
      vpc_id: vpcId,
      ingress: [
        {
          description: 'Allow inbound Service Connect traffic',
          from_port: 8080,
          to_port: 8080,
          protocol: 'tcp',
          security_groups: [sourceSgId]
        }
      ],
      egress: [
        {
          description: 'Allow all outbound traffic',
          from_port: 0,
          to_port: 0,
          protocol: '-1',
          cidr_blocks: ['0.0.0.0/0']
        }
      ],
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_vpc.${vpcId}`,
        `aws_security_group.${sourceSgId}`
      ]
    }

    return attributes
  }
} 