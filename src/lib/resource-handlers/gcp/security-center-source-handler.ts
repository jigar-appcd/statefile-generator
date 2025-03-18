import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPSecurityCenterSourceHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      display_name: resourceName,
      description: `Security findings source for ${resourceName}`,
      organization: '${data.google_organization.current.name}',
      enable_finding_notifications: true,
      finding_notification_config: {
        pubsub_topic: '${google_pubsub_topic.security_findings.id}',
        filter: 'severity = "HIGH" OR severity = "CRITICAL"'
      },
      finding_config: {
        finding_type: 'CUSTOM_FINDING',
        finding_category: 'SECURITY_ASSESSMENT',
        severity: 'HIGH',
        indicator: {
          signatures: [
            {
              name: 'Suspicious Activity',
              description: 'Detected suspicious activity in the environment'
            }
          ]
        }
      },
      labels: {
        name: resourceName.toLowerCase(),
        ...commonTags
      },
      depends_on: [
        'google_pubsub_topic.security_findings'
      ]
    }

    return attributes
  }
} 