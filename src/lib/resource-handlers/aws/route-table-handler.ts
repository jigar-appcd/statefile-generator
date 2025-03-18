import {
  ResourceAttributes,
  ResourceHandler,
  commonTags,
  generateResourceId
} from '../base-handler'

export class RouteTableHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const vpcId = generateResourceId('vpc')
    const igwId = generateResourceId('igw')
    const rtbId = generateResourceId('rtb')

    const attributes: ResourceAttributes = {
      vpc_id: vpcId,
      route: [
        {
          carrier_gateway_id: '',
          cidr_block: '0.0.0.0/0',
          core_network_arn: '',
          destination_prefix_list_id: '',
          egress_only_gateway_id: '',
          gateway_id: igwId,
          instance_id: '',
          ipv6_cidr_block: '',
          local_gateway_id: '',
          nat_gateway_id: '',
          network_interface_id: '',
          transit_gateway_id: '',
          vpc_endpoint_id: '',
          vpc_peering_connection_id: ''
        }
      ],
      tags: {
        Name: `${resourceName}-${rtbId}`,
        ...commonTags
      },
      tags_all: {
        Name: `${resourceName}-${rtbId}`,
        ...commonTags
      },
      depends_on: [
        `aws_vpc.${vpcId}`,
        `aws_internet_gateway.${igwId}`
      ]
    }

    return attributes
  }
} 