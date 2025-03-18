import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class AWSDBSubnetGroupHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const groupId = generateResourceId('group')
    const subnet1Id = generateResourceId('subnet')
    const subnet2Id = generateResourceId('subnet')
    
    const attributes: ResourceAttributes = {
      name: `${resourceName}-${groupId}`,
      description: `Subnet group for ${resourceName} RDS instances`,
      subnet_ids: [
        subnet1Id,
        subnet2Id
      ],
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_subnet.${subnet1Id}`,
        `aws_subnet.${subnet2Id}`
      ]
    }

    return attributes
  }
} 