import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureContainerGroupHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      ip_address_type: 'Private',
      dns_name_label: resourceName.toLowerCase(),
      os_type: 'Linux',
      restart_policy: 'Always',
      container: [
        {
          name: 'main',
          image: 'mcr.microsoft.com/azuredocs/aci-helloworld:latest',
          cpu: 1,
          memory: 2,
          environment_variables: {
            NODE_ENV: 'production'
          },
          secure_environment_variables: {
            API_KEY: '${random_password.api_key.result}'
          },
          ports: [
            {
              port: 80,
              protocol: 'TCP'
            }
          ],
          volume: [
            {
              name: 'config',
              mount_path: '/config',
              secret: {
                'config.json': '${base64encode(file("config.json"))}'
              }
            }
          ],
          liveness_probe: {
            http_get: {
              path: '/health',
              port: 80,
              scheme: 'Http'
            },
            initial_delay_seconds: 30,
            period_seconds: 10
          }
        }
      ],
      exposed_port: [
        {
          port: 80,
          protocol: 'TCP'
        }
      ],
      identity: {
        type: 'SystemAssigned'
      },
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 