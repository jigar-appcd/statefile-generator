import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateSubnetId
} from '../base-handler'

export class AWSRedshiftSubnetGroupHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const subnetId1 = generateSubnetId()
    const subnetId2 = generateSubnetId()
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      description: `Subnet group for ${resourceName}`,
      subnet_ids: [
        subnetId1,
        subnetId2
      ],
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_subnet.${subnetId1}`,
        `aws_subnet.${subnetId2}`
      ]
    }

    return attributes
  }
} 