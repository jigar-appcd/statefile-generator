import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class ECSServiceConnectVPCEndpointHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const serviceId = generateResourceId('vpce-service')
    const vpcId = generateResourceId('vpc')
    const subnetId = generateResourceId('subnet')
    const securityGroupId = generateResourceId('sg')
    
    const attributes: ResourceAttributes = {
      service_name: `com.amazonaws.${region}.ecs-sc`,
      vpc_id: vpcId,
      subnet_ids: [subnetId],
      security_group_ids: [securityGroupId],
      vpc_endpoint_type: 'Interface',
      private_dns_enabled: true,
      auto_accept: true,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_vpc.${vpcId}`,
        `aws_subnet.${subnetId}`,
        `aws_security_group.${securityGroupId}`,
        `aws_vpc_endpoint_service.${serviceId}`
      ]
    }

    return attributes
  }
} 