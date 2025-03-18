import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class ECSServiceConnectVPCEndpointServiceHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const vpcId = generateResourceId('vpc')
    const subnetId = generateResourceId('subnet')
    const sgId = generateResourceId('sg')

    const attributes: ResourceAttributes = {
      vpc_id: vpcId,
      acceptance_required: false,
      allowed_principals: [],
      gateway_load_balancer_arns: [],
      network_load_balancer_arns: [],
      private_dns_name: '',
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_vpc.${vpcId}`,
        `aws_subnet.${subnetId}`,
        `aws_security_group.${sgId}`
      ]
    }

    return attributes
  }
} 