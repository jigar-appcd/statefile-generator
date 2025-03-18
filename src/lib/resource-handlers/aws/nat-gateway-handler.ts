import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId,
    generateSubnetId
} from '../base-handler'

export class AWSNatGatewayHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const subnetId = generateSubnetId()
    const eipId = generateResourceId('eip')
    
    const attributes: ResourceAttributes = {
      subnet_id: subnetId,
      allocation_id: `eipalloc-${eipId}`,
      connectivity_type: 'public',
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_subnet.${subnetId}`,
        `aws_eip.${eipId}`
      ]
    }

    return attributes
  }
}