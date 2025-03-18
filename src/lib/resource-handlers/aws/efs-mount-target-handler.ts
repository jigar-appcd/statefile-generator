import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    generateEcsServiceId,
    generateSecurityGroupId,
    generateSubnetId
} from '../base-handler'

export class AWSEFSMountTargetHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const fsId = generateEcsServiceId()
    const sgId = generateSecurityGroupId()
    const subnetId = generateSubnetId()
    
    const attributes: ResourceAttributes = {
      file_system_id: fsId,
      subnet_id: subnetId,
      security_groups: [sgId],
      ip_address: '10.0.1.100',
      depends_on: [
        `aws_efs_file_system.${fsId}`,
        `aws_security_group.${sgId}`,
        `aws_subnet.${subnetId}`
      ]
    }

    return attributes
  }
} 