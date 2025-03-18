import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class KMSKeyHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      description: `KMS key for ${resourceName}`,
      deletion_window_in_days: 30,
      enable_key_rotation: true,
      is_enabled: true,
      key_usage: 'ENCRYPT_DECRYPT',
      customer_master_key_spec: 'SYMMETRIC_DEFAULT',
      multi_region: false,
      policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'Enable IAM User Permissions',
            Effect: 'Allow',
            Principal: {
              AWS: '${data.aws_caller_identity.current.arn}'
            },
            Action: 'kms:*',
            Resource: '*'
          }
        ]
      }),
      bypass_policy_lockout_safety_check: false,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      tags_all: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 