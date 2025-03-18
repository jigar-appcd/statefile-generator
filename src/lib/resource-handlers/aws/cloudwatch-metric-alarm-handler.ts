import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class CloudWatchMetricAlarmHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      alarm_name: `${resourceName}-${generateResourceId()}`,
      comparison_operator: 'GreaterThanThreshold',
      evaluation_periods: 2,
      metric_name: 'CPUUtilization',
      namespace: 'AWS/EC2',
      period: 300,
      statistic: 'Average',
      threshold: 80,
      alarm_description: `Alarm when CPU exceeds 80% for ${resourceName}`,
      dimensions: {
        AutoScalingGroupName: '${aws_autoscaling_group.main.name}'
      },
      alarm_actions: ['${aws_autoscaling_policy.scale_up.arn}'],
      ok_actions: ['${aws_autoscaling_policy.scale_down.arn}'],
      insufficient_data_actions: [],
      treat_missing_data: 'missing',
      datapoints_to_alarm: 1,
      unit: 'Percent',
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