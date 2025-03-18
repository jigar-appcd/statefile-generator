import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateEcrRepoId
} from '../base-handler'

export class AWSECRPullThroughCacheRuleHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const repoId = generateEcrRepoId()
    
    const attributes: ResourceAttributes = {
      ecr_repository_prefix: resourceName,
      upstream_registry_url: 'public.ecr.aws',
      registry_id: repoId,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_ecr_repository.${repoId}`
      ]
    }

    return attributes
  }
} 