import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPCloudMonitoringHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      project: '${data.google_project.current.project_id}',
      display_name: `${resourceName} Monitoring`,
      alert_policy: {
        display_name: 'High CPU Usage',
        combiner: 'OR',
        conditions: [
          {
            display_name: 'CPU usage > 80%',
            condition_threshold: {
              filter: 'metric.type="compute.googleapis.com/instance/cpu/utilization" resource.type="gce_instance"',
              duration: '60s',
              comparison: 'COMPARISON_GT',
              threshold_value: 0.8,
              trigger: {
                count: 1
              },
              aggregations: [
                {
                  alignment_period: '60s',
                  per_series_aligner: 'ALIGN_MEAN',
                  cross_series_reducer: 'REDUCE_MEAN',
                  group_by_fields: ['resource.label.instance_id']
                }
              ]
            }
          }
        ],
        notification_channels: ['${google_monitoring_notification_channel.email.name}'],
        enabled: true,
        documentation: {
          content: 'Alert triggered when CPU usage exceeds 80%',
          mime_type: 'text/markdown'
        }
      },
      notification_channel: {
        display_name: 'Email Notification',
        type: 'email',
        labels: {
          email_address: 'alerts@example.com'
        },
        enabled: true,
        verification_status: 'VERIFIED'
      },
      uptime_check_config: {
        display_name: 'HTTPS Uptime Check',
        monitored_resource: {
          type: 'uptime_url',
          labels: {
            project_id: '${data.google_project.current.project_id}',
            host: 'example.com'
          }
        },
        http_check: {
          path: '/health',
          port: 443,
          use_ssl: true,
          validate_ssl: true
        },
        period: '60s',
        timeout: '10s',
        selected_regions: [region.code]
      },
      dashboard: {
        display_name: `${resourceName} Dashboard`,
        grid_layout: {
          columns: 2,
          widgets: [
            {
              title: 'CPU Usage',
              xy_chart: {
                data_sets: [
                  {
                    time_series_query: {
                      time_series_filter: {
                        filter: 'metric.type="compute.googleapis.com/instance/cpu/utilization"',
                        aggregation: {
                          per_series_aligner: 'ALIGN_MEAN',
                          alignment_period: '60s'
                        }
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      group: {
        display_name: `${resourceName} Group`,
        filter: 'resource.labels.project_id = "${data.google_project.current.project_id}"',
        parent_name: '',
        is_cluster: false
      },
      metric_descriptor: {
        display_name: 'Custom Metric',
        metric_kind: 'GAUGE',
        value_type: 'DOUBLE',
        unit: '1',
        description: 'Custom monitoring metric',
        labels: [
          {
            key: 'environment',
            value_type: 'STRING',
            description: 'Environment label'
          }
        ]
      },
      labels: {
        name: resourceName.toLowerCase(),
        ...commonTags
      }
    }

    return attributes
  }
} 