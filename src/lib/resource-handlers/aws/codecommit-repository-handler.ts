import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class CodeCommitRepositoryHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      repository_name: resourceName,
      description: `CodeCommit repository for ${resourceName}`,
      default_branch: 'main',
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