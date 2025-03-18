import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateKmsKeyId
} from '../base-handler'

export class AWSCodeArtifactDomainHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const kmsKeyId = generateKmsKeyId()
    
    const attributes: ResourceAttributes = {
      domain: resourceName.toLowerCase(),
      encryption_key: kmsKeyId,
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