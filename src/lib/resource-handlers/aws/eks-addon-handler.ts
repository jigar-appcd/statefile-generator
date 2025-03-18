import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateArn,
    generateBeanstalkRoleId,
    generateEksClusterId
} from '../base-handler'

export class AWSEKSAddonHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const clusterId = generateEksClusterId()
    const roleId = generateBeanstalkRoleId()
    const accountId = '123456789012' // Using a static account ID for consistency
    
    const attributes: ResourceAttributes = {
      cluster_name: clusterId,
      addon_name: resourceName,
      addon_version: 'v1.12.6-eksbuild.1',
      resolve_conflicts_on_create: 'OVERWRITE',
      resolve_conflicts_on_update: 'PRESERVE',
      preserve: true,
      service_account_role_arn: generateArn('iam', region, accountId, 'role', `eks-addon-${roleId}`),
      configuration_values: JSON.stringify({
        env: {
          ENABLE_PREFIX_DELEGATION: 'true',
          WARM_PREFIX_TARGET: '1'
        }
      }),
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_eks_cluster.${clusterId}`,
        `aws_iam_role.${roleId}`
      ]
    }

    return attributes
  }
} 