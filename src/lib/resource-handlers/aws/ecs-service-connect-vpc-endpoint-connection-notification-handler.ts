import {
    ResourceAttributes,
    ResourceHandler,
    generateResourceId
} from '../base-handler'

export class AWSECSServiceConnectVPCEndpointConnectionNotificationHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const serviceId = generateResourceId('service')
    const topicId = generateResourceId('topic')
    
    const attributes: ResourceAttributes = {
      vpc_endpoint_service_id: serviceId,
      connection_notification_arn: `REPLACE_WITH_TOPIC_ARN_${resourceName}_${topicId}`,
      connection_events: [
        'Accept',
        'Connect',
        'Delete',
        'Reject'
      ],
      depends_on: [
        `aws_vpc_endpoint_service.${serviceId}`,
        `aws_sns_topic.${topicId}`
      ]
    }

    return attributes
  }
} 