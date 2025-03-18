import {
    ResourceAttributes,
    ResourceHandler,
    generateEcrRepoId
} from '../base-handler'

export class AWSECRLifecyclePolicyHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const repoId = generateEcrRepoId()
    
    const attributes: ResourceAttributes = {
      repository: repoId,
      policy: JSON.stringify({
        rules: [
          {
            rulePriority: 1,
            description: `Keep only the last 30 images for ${resourceName}`,
            selection: {
              tagStatus: 'any',
              countType: 'imageCountMoreThan',
              countNumber: 30
            },
            action: {
              type: 'expire'
            }
          }
        ]
      }),
      depends_on: [
        `aws_ecr_repository.${repoId}`
      ]
    }

    return attributes
  }
} 