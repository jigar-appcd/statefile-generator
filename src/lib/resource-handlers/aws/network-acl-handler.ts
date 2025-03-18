import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateSubnetId,
    generateVpcId
} from '../base-handler'

export class AWSNetworkACLHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const vpcId = generateVpcId()
    const subnetId1 = generateSubnetId()
    const subnetId2 = generateSubnetId()
    
    const attributes: ResourceAttributes = {
      vpc_id: vpcId,
      subnet_ids: [
        subnetId1,
        subnetId2
      ],
      ingress: [
        {
          rule_no: 100,
          protocol: 'tcp',
          action: 'allow',
          cidr_block: '0.0.0.0/0',
          from_port: 80,
          to_port: 80
        },
        {
          rule_no: 110,
          protocol: 'tcp',
          action: 'allow',
          cidr_block: '0.0.0.0/0',
          from_port: 443,
          to_port: 443
        }
      ],
      egress: [
        {
          rule_no: 100,
          protocol: '-1',
          action: 'allow',
          cidr_block: '0.0.0.0/0',
          from_port: 0,
          to_port: 0
        }
      ],
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_vpc.${vpcId}`,
        `aws_subnet.${subnetId1}`,
        `aws_subnet.${subnetId2}`
      ]
    }

    return attributes
  }
}