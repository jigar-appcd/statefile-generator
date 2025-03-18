import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class QuickSightAnalysisHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      aws_account_id: '${data.aws_caller_identity.current.account_id}',
      analysis_id: `${resourceName}-${generateResourceId()}`,
      name: resourceName,
      theme_arn: '${aws_quicksight_theme.main.arn}',
      source_entity: {
        source_template: {
          arn: '${aws_quicksight_template.main.arn}',
          data_set_references: [
            {
              data_set_arn: '${aws_quicksight_data_set.main.arn}',
              data_set_placeholder: 'sales_data'
            }
          ]
        }
      },
      parameters: {
        string_parameters: [
          {
            name: 'region',
            values: [region.code]
          }
        ],
        decimal_parameters: [
          {
            name: 'threshold',
            values: [1000.0]
          }
        ],
        date_time_parameters: [
          {
            name: 'start_date',
            values: ['2023-01-01T00:00:00Z']
          }
        ]
      },
      permissions: [
        {
          principal: '${aws_iam_role.quicksight_user.arn}',
          actions: [
            'quicksight:DescribeAnalysis',
            'quicksight:UpdateAnalysis',
            'quicksight:DeleteAnalysis',
            'quicksight:QueryAnalysis',
            'quicksight:CreateAnalysis'
          ]
        }
      ],
      definition: {
        data_set_identifiers: ['sales_data'],
        analysis_defaults: {
          new_sheet_default: {
            interactivity: {
              filter_control: {
                visibility: 'EXPANDED'
              },
              drill_down_control: {
                visibility: 'COLLAPSED'
              }
            },
            sheet_control: {
              visibility: 'EXPANDED'
            }
          }
        },
        sheets: [
          {
            sheet_id: 'sheet1',
            name: 'Sales Overview',
            visuals: [
              {
                bar_chart_visual: {
                  visual_id: 'bar1',
                  title: {
                    format_text: {
                      plain_text: 'Monthly Sales'
                    }
                  },
                  chart_configuration: {
                    field_wells: {
                      bar_chart_aggregated_field_wells: {
                        category: [{
                          categorical_dimension_field: {
                            field_id: 'month',
                            column_name: 'sale_month'
                          }
                        }],
                        values: [{
                          numerical_measure_field: {
                            field_id: 'sales',
                            column_name: 'sale_amount',
                            aggregation_function: 'SUM'
                          }
                        }]
                      }
                    }
                  }
                }
              }
            ]
          }
        ]
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
        'aws_quicksight_theme.main',
        'aws_quicksight_template.main',
        'aws_quicksight_data_set.main',
        'aws_iam_role.quicksight_user'
      ]
    }

    return attributes
  }
} 