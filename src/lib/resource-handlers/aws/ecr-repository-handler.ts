import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateKmsKeyId
} from '../base-handler'

export class AWSECRRepositoryHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const kmsKeyId = generateKmsKeyId()
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      image_tag_mutability: 'IMMUTABLE',
      image_scanning_configuration: {
        scan_on_push: true
      },
      encryption_configuration: {
        encryption_type: 'KMS',
        kms_key: kmsKeyId
      },
      force_delete: true,
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