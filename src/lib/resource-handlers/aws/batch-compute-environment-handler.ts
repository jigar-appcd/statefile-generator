import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId,
    generateSecurityGroupId,
    generateSubnetId
} from '../base-handler'

export class AWSBatchComputeEnvironmentHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const sgId = generateSecurityGroupId()
    const subnetId1 = generateSubnetId()
    const subnetId2 = generateSubnetId()
    const roleId = generateResourceId('role')
    const instanceProfileId = generateResourceId('profile')
    
    const attributes: ResourceAttributes = {
      compute_environment_name: resourceName,
      type: 'MANAGED',
      service_role: `REPLACE_WITH_ROLE_ARN_${roleId}`,
      state: 'ENABLED',
      compute_resources: {
        type: 'EC2',
        allocation_strategy: 'BEST_FIT_PROGRESSIVE',
        min_vcpus: 0,
        max_vcpus: 16,
        desired_vcpus: 0,
        instance_type: [
          'optimal'
        ],
        security_group_ids: [sgId],
        subnets: [
          subnetId1,
          subnetId2
        ],
        instance_role: `REPLACE_WITH_INSTANCE_PROFILE_${instanceProfileId}`,
        tags: {
          Name: resourceName,
          ...commonTags
        }
      },
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_security_group.${sgId}`,
        `aws_subnet.${subnetId1}`,
        `aws_subnet.${subnetId2}`,
        `aws_iam_role.${roleId}`,
        `aws_iam_instance_profile.${instanceProfileId}`
      ]
    }

    return attributes
  }
} 