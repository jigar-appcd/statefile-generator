import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class IoTThingHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: `${resourceName}-${generateResourceId()}`,
      thing_type_name: '${aws_iot_thing_type.main.name}',
      attributes: {
        model: 'v1',
        manufacturer: 'Example Corp',
        serial_number: generateResourceId()
      },
      certificate_arn: '${aws_iot_certificate.main.arn}',
      policy_attachments: [
        '${aws_iot_policy.publish.name}',
        '${aws_iot_policy.subscribe.name}'
      ],
      principal_attachment: {
        principal: '${aws_iot_certificate.main.arn}',
        thing: '${aws_iot_thing.main.name}'
      },
      billing_group_name: '${aws_iot_billing_group.main.name}',
      thing_groups: [
        '${aws_iot_thing_group.sensors.name}',
        '${aws_iot_thing_group.devices.name}'
      ],
      tags: {
        Name: resourceName,
        ...commonTags
      },
      tags_all: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        'aws_iot_thing_type.main',
        'aws_iot_certificate.main',
        'aws_iot_policy.publish',
        'aws_iot_policy.subscribe',
        'aws_iot_billing_group.main',
        'aws_iot_thing_group.sensors',
        'aws_iot_thing_group.devices'
      ]
    }

    return attributes
  }
} 