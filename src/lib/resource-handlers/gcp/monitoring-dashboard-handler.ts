import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPMonitoringDashboardHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      dashboard_json: JSON.stringify({
        displayName: resourceName,
        gridLayout: {
          columns: '2',
          widgets: [
            {
              title: 'CPU Usage',
              xyChart: {
                dataSets: [
                  {
                    timeSeriesQuery: {
                      timeSeriesFilter: {
                        filter: 'metric.type="compute.googleapis.com/instance/cpu/utilization"',
                        aggregation: {
                          alignmentPeriod: '60s',
                          perSeriesAligner: 'ALIGN_MEAN'
                        }
                      }
                    }
                  }
                ]
              }
            },
            {
              title: 'Memory Usage',
              xyChart: {
                dataSets: [
                  {
                    timeSeriesQuery: {
                      timeSeriesFilter: {
                        filter: 'metric.type="compute.googleapis.com/instance/memory/utilization"',
                        aggregation: {
                          alignmentPeriod: '60s',
                          perSeriesAligner: 'ALIGN_MEAN'
                        }
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      }),
      labels: {
        name: resourceName.toLowerCase(),
        ...commonTags
      }
    }

    return attributes
  }
} 