import {
    ResourceAttributes,
    ResourceHandler,
    generateResourceId,
    generateSubnetId
} from '../base-handler'

export class AWSRouteTableAssociationHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const subnetId = generateSubnetId()
    const routeTableId = generateResourceId('rtb')
    
    const attributes: ResourceAttributes = {
      subnet_id: subnetId,
      route_table_id: routeTableId,
      depends_on: [
        `aws_subnet.${subnetId}`,
        `aws_route_table.${routeTableId}`
      ]
    }

    return attributes
  }
} 