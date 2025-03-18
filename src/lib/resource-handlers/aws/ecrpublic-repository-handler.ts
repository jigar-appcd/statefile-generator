import { Region } from '@/types/cloud'
import { generateResourceId } from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class AWSECRPublicRepositoryHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const repoId = generateResourceId()
    
    const attributes: ResourceAttributes = {
      repository_name: `public-repo-${repoId}`,
      catalog_data: {
        about_text: 'Public container repository for sharing images',
        architectures: ['x86-64', 'ARM'],
        description: 'Contains public container images for various applications',
        operating_systems: ['Linux'],
        usage_text: 'docker pull public.ecr.aws/example/repo-name:latest',
        logo_image_blob: 'base64-encoded-logo-data'
      },
      force_destroy: true,
      tags: {
        environment: 'production'
      }
    }

    return attributes
  }
} 