import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId
} from '../base-handler'

export class AWSCloudWatchDashboardHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const instanceId = generateResourceId('i')
    const dbId = generateResourceId('db')
    const lbId = generateResourceId('lb')
    
    const attributes: ResourceAttributes = {
      name: resourceName,
      dashboard_name: resourceName.toLowerCase(),
      dashboard_body: JSON.stringify({
        widgets: [
          {
            type: 'metric',
            x: 0,
            y: 0,
            width: 12,
            height: 6,
            properties: {
              metrics: [
                ['AWS/EC2', 'CPUUtilization', 'InstanceId', instanceId],
                ['AWS/RDS', 'CPUUtilization', 'DBInstanceIdentifier', dbId],
                ['AWS/ApplicationELB', 'RequestCount', 'LoadBalancer', lbId]
              ],
              period: 300,
              stat: 'Average',
              region: 'us-west-2',
              title: 'Resource Metrics'
            }
          },
          {
            type: 'text',
            x: 0,
            y: 6,
            width: 12,
            height: 2,
            properties: {
              markdown: `# ${resourceName} Dashboard\nKey performance metrics for the application infrastructure.`
            }
          }
        ]
      }),
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_instance.${instanceId}`,
        `aws_db_instance.${dbId}`,
        `aws_lb.${lbId}`
      ]
    }

    return attributes
  }
} 