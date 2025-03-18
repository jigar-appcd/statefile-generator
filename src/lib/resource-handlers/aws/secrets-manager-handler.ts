import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateKmsKeyId
} from '../base-handler'

export class AWSSecretsManagerHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const kmsKeyId = generateKmsKeyId()
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      description: `Secret for ${resourceName}`,
      kms_key_id: kmsKeyId,
      recovery_window_in_days: 7,
      force_overwrite_replica_secret: false,
      replica: [
        {
          region: 'us-west-2',
          kms_key_id: kmsKeyId
        }
      ],
      rotation_rules: {
        automatically_after_days: 30
      },
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_kms_key.${kmsKeyId}`
      ]
    }

    return attributes
  }
} 