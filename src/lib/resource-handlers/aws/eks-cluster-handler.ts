import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateArn,
    generateBeanstalkRoleId,
    generateKmsKeyId,
    generateSecurityGroupId,
    generateSubnetId,
    generateVpcId
} from '../base-handler'

export class AWSEKSClusterHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const roleId = generateBeanstalkRoleId()
    const vpcId = generateVpcId()
    const subnetId1 = generateSubnetId()
    const subnetId2 = generateSubnetId()
    const sgId = generateSecurityGroupId()
    const kmsKeyId = generateKmsKeyId()
    const accountId = '123456789012' // Using a static account ID for consistency
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      role_arn: generateArn('iam', region, accountId, 'role', `eks-cluster-${roleId}`),
      version: '1.27',
      vpc_config: {
        subnet_ids: [
          subnetId1,
          subnetId2
        ],
        security_groups: [sgId],
        endpoint_private_access: true,
        endpoint_public_access: true,
        public_access_cidrs: ['0.0.0.0/0']
      },
      encryption_config: [
        {
          provider: {
            key_arn: generateArn('kms', region, accountId, 'key', kmsKeyId)
          },
          resources: ['secrets']
        }
      ],
      enabled_cluster_log_types: [
        'api',
        'audit',
        'authenticator',
        'controllerManager',
        'scheduler'
      ],
      kubernetes_network_config: {
        service_ipv4_cidr: '172.20.0.0/16',
        ip_family: 'ipv4'
      },
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_iam_role.${roleId}`,
        `aws_vpc.${vpcId}`,
        `aws_subnet.${subnetId1}`,
        `aws_subnet.${subnetId2}`,
        `aws_security_group.${sgId}`,
        `aws_kms_key.${kmsKeyId}`
      ]
    }

    return attributes
  }
} 