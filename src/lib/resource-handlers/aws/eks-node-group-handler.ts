import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateArn,
    generateBeanstalkRoleId,
    generateEksClusterId,
    generateLaunchTemplateId,
    generateSubnetId
} from '../base-handler'

export class AWSEKSNodeGroupHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const clusterId = generateEksClusterId()
    const roleId = generateBeanstalkRoleId()
    const subnetId1 = generateSubnetId()
    const subnetId2 = generateSubnetId()
    const launchTemplateId = generateLaunchTemplateId()
    const accountId = '123456789012' // Using a static account ID for consistency
    
    const attributes: ResourceAttributes = {
      cluster_name: clusterId,
      node_group_name: resourceName,
      node_role_arn: generateArn('iam', region, accountId, 'role', `eks-node-group-${roleId}`),
      subnet_ids: [
        subnetId1,
        subnetId2
      ],
      instance_types: ['t3.medium'],
      capacity_type: 'ON_DEMAND',
      scaling_config: {
        desired_size: 2,
        max_size: 4,
        min_size: 1
      },
      update_config: {
        max_unavailable: 1
      },
      launch_template: {
        id: launchTemplateId,
        version: '1'
      },
      remote_access: {
        ec2_ssh_key: 'eks-nodes',
        source_security_group_ids: []
      },
      taint: [
        {
          key: 'dedicated',
          value: 'gpuGroup',
          effect: 'NO_SCHEDULE'
        }
      ],
      labels: {
        role: 'general',
        ...commonTags
      },
      depends_on: [
        `aws_eks_cluster.${clusterId}`,
        `aws_iam_role.${roleId}`,
        `aws_subnet.${subnetId1}`,
        `aws_subnet.${subnetId2}`,
        `aws_launch_template.${launchTemplateId}`
      ]
    }

    return attributes
  }
} 