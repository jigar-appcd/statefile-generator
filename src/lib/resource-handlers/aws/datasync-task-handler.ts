import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class DataSyncTaskHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: `${resourceName}-${generateResourceId(resourceName)}`,
      source_location_arn: '${aws_datasync_location_s3.source.arn}',
      destination_location_arn: '${aws_datasync_location_s3.destination.arn}',
      cloudwatch_log_group_arn: '${aws_cloudwatch_log_group.datasync.arn}',
      schedule: {
        schedule_expression: 'cron(0 12 ? * SUN *)'
      },
      excludes: [
        {
          filter_type: 'SIMPLE_PATTERN',
          value: '/tmp/*'
        },
        {
          filter_type: 'SIMPLE_PATTERN',
          value: '*.bak'
        }
      ],
      includes: [
        {
          filter_type: 'SIMPLE_PATTERN',
          value: '*.{jpg,png,pdf}'
        }
      ],
      options: {
        atime: 'BEST_EFFORT',
        bytes_per_second: -1,
        gid: 'NONE',
        log_level: 'TRANSFER',
        mtime: 'PRESERVE',
        overwrite_mode: 'ALWAYS',
        posix_permissions: 'PRESERVE',
        preserve_deleted_files: 'REMOVE',
        preserve_devices: 'NONE',
        task_queueing: 'ENABLED',
        transfer_mode: 'CHANGED',
        uid: 'NONE',
        verify_mode: 'POINT_IN_TIME_CONSISTENT'
      },
      task_report_config: {
        report_level: 'DETAILED',
        output_s3_uri: 's3://${aws_s3_bucket.datasync_reports.id}/reports/'
      },
      tags: {
        Name: resourceName,
        ...commonTags
      },
      tags_all: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        'aws_datasync_location_s3.source',
        'aws_datasync_location_s3.destination',
        'aws_cloudwatch_log_group.datasync',
        'aws_s3_bucket.datasync_reports'
      ]
    }
    return attributes
  }
}
 