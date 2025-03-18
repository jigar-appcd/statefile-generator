import { Region } from '@/types/cloud'
import {
    generateGcpProjectId,
    generateGcpServiceAccountEmail
} from '../../utils/id-generator'
import { ResourceAttributes, ResourceHandler } from '../base-handler'

export class GCPCloudRunHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const projectId = generateGcpProjectId()
    
    const attributes: ResourceAttributes = {
      name: resourceName.toLowerCase(),
      location: region.code,
      template: {
        spec: {
          containers: [
            {
              image: 'gcr.io/cloudrun/hello',
              ports: [
                {
                  container_port: 8080
                }
              ],
              resources: {
                limits: {
                  cpu: '1000m',
                  memory: '512Mi'
                }
              },
              env: [
                {
                  name: 'NODE_ENV',
                  value: 'production'
                }
              ]
            }
          ],
          service_account_name: generateGcpServiceAccountEmail(),
          timeout_seconds: 300
        },
        metadata: {
          annotations: {
            'autoscaling.knative.dev/maxScale': '10',
            'autoscaling.knative.dev/minScale': '1',
            'run.googleapis.com/client-name': 'cloud-console'
          }
        }
      },
      traffic: [
        {
          percent: 100,
          latest_revision: true
        }
      ],
      autogenerate_revision_name: true,
      project: projectId,
      labels: {
        environment: 'production'
      }
    }

    return attributes
  }
} 