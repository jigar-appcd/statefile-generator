import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class WAFWebACLHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: `${resourceName}-${generateResourceId()}`,
      description: `Web ACL for ${resourceName}`,
      scope: 'REGIONAL',
      default_action: {
        allow: {}
      },
      visibility_config: {
        cloudwatch_metrics_enabled: true,
        metric_name: `${resourceName}Metrics`,
        sampled_requests_enabled: true
      },
      rule: [
        {
          name: 'AWSManagedRulesCommonRuleSet',
          priority: 1,
          override_action: {
            none: {}
          },
          statement: {
            managed_rule_group_statement: {
              name: 'AWSManagedRulesCommonRuleSet',
              vendor_name: 'AWS'
            }
          },
          visibility_config: {
            cloudwatch_metrics_enabled: true,
            metric_name: 'AWSManagedRulesCommonRuleSetMetric',
            sampled_requests_enabled: true
          }
        },
        {
          name: 'IPRateLimit',
          priority: 2,
          action: {
            block: {}
          },
          statement: {
            rate_based_statement: {
              limit: 2000,
              aggregate_key_type: 'IP'
            }
          },
          visibility_config: {
            cloudwatch_metrics_enabled: true,
            metric_name: 'IPRateLimitMetric',
            sampled_requests_enabled: true
          }
        },
        {
          name: 'BlockMaliciousIPs',
          priority: 3,
          action: {
            block: {}
          },
          statement: {
            ip_set_reference_statement: {
              arn: '${aws_wafv2_ip_set.malicious.arn}'
            }
          },
          visibility_config: {
            cloudwatch_metrics_enabled: true,
            metric_name: 'BlockMaliciousIPsMetric',
            sampled_requests_enabled: true
          }
        },
        {
          name: 'SQLInjectionProtection',
          priority: 4,
          action: {
            block: {}
          },
          statement: {
            sql_injection_match_statement: {
              field_to_match: {
                body: {}
              },
              text_transformations: [
                {
                  priority: 1,
                  type: 'URL_DECODE'
                },
                {
                  priority: 2,
                  type: 'HTML_ENTITY_DECODE'
                }
              ]
            }
          },
          visibility_config: {
            cloudwatch_metrics_enabled: true,
            metric_name: 'SQLInjectionProtectionMetric',
            sampled_requests_enabled: true
          }
        }
      ],
      custom_response_body: {
        'block-response': {
          content_type: 'TEXT_HTML',
          content: '<html><body><h1>Access Denied</h1><p>Your request has been blocked.</p></body></html>'
        }
      },
      association: {
        resource_arn: '${aws_lb.main.arn}',
        web_acl_arn: '${aws_wafv2_web_acl.main.arn}'
      },
      logging_configuration: {
        log_destination_configs: ['${aws_kinesis_firehose_delivery_stream.waf_logs.arn}'],
        redacted_fields: [
          {
            single_header: {
              name: 'authorization'
            }
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
        'aws_wafv2_ip_set.malicious',
        'aws_lb.main',
        'aws_kinesis_firehose_delivery_stream.waf_logs'
      ]
    }

    return attributes
  }
} 