import {
  ResourceAttributes,
  ResourceHandler,
  commonTags,
  generateResourceId
} from '../base-handler'

export class SecurityGroupHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const vpcId = generateResourceId('vpc')
    const sgId = generateResourceId('sg')
    const accountId = '123456789012'

    const attributes: ResourceAttributes = {
      description: 'Managed by Terraform',
      vpc_id: vpcId,
      owner_id: accountId,
      name_prefix: '',
      revoke_rules_on_delete: false,
      ingress: [
        {
          cidr_blocks: ['0.0.0.0/0'],
          description: 'Allow all inbound traffic',
          from_port: 0,
          ipv6_cidr_blocks: [],
          prefix_list_ids: [],
          protocol: '-1',
          security_groups: [],
          self: false,
          to_port: 0
        }
      ],
      egress: [
        {
          cidr_blocks: ['0.0.0.0/0'],
          description: 'Allow all outbound traffic',
          from_port: 0,
          ipv6_cidr_blocks: [],
          prefix_list_ids: [],
          protocol: '-1',
          security_groups: [],
          self: false,
          to_port: 0
        }
      ],
      tags: {
        Name: `${resourceName}-${sgId}`,
        ...commonTags
      },
      tags_all: {
        Name: `${resourceName}-${sgId}`,
        ...commonTags
      },
      depends_on: [
        `aws_vpc.${vpcId}`
      ]
    }

    return attributes
  }
} 