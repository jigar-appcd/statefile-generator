import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateArn,
    generateBeanstalkRoleId,
    generateEksClusterId,
    generateSubnetId
} from '../base-handler'

export class AWSEKSFargateProfileHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const clusterId = generateEksClusterId()
    const roleId = generateBeanstalkRoleId()
    const subnetId1 = generateSubnetId()
    const subnetId2 = generateSubnetId()
    const accountId = '123456789012' // Using a static account ID for consistency
    
    const attributes: ResourceAttributes = {
      cluster_name: clusterId,
      fargate_profile_name: resourceName,
      pod_execution_role_arn: generateArn('iam', region, accountId, 'role', `eks-fargate-${roleId}`),
      subnet_ids: [
        subnetId1,
        subnetId2
      ],
      selector: [
        {
          namespace: 'default',
          labels: {
            ...commonTags,
            workload: 'fargate'
          }
        },
        {
          namespace: 'kube-system',
          labels: {
            'k8s-app': 'kube-dns'
          }
        }
      ],
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_eks_cluster.${clusterId}`,
        `aws_iam_role.${roleId}`,
        `aws_subnet.${subnetId1}`,
        `aws_subnet.${subnetId2}`
      ]
    }

    return attributes
  }
} 