import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPCloudRunDomainMappingHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName.toLowerCase(),
      location: region.code,
      service: '${google_cloud_run_service.main.name}',
      metadata: {
        namespace: '${data.google_project.current.project_id}',
        annotations: {
          'run.googleapis.com/launch-stage': 'BETA'
        },
        labels: {
          name: resourceName.toLowerCase(),
          ...commonTags
        }
      },
      spec: {
        route_name: '${google_cloud_run_service.main.name}',
        force_override: false,
        certificate_mode: 'AUTOMATIC'
      },
      depends_on: [
        'google_cloud_run_service.main'
      ]
    }

    return attributes
  }
} 