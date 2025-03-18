import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureCDNEndpointHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      profile_name: '${azurerm_cdn_profile.main.name}',
      is_http_allowed: false,
      is_https_allowed: true,
      content_types_to_compress: [
        'text/plain',
        'text/html',
        'text/css',
        'text/javascript',
        'application/x-javascript',
        'application/javascript',
        'application/json',
        'application/xml'
      ],
      is_compression_enabled: true,
      optimization_type: 'GeneralWebDelivery',
      querystring_caching_behaviour: 'IgnoreQueryString',
      origin: {
        name: 'primary',
        host_name: '${azurerm_storage_account.main.primary_web_host}',
        http_port: 80,
        https_port: 443
      },
      origin_host_header: '${azurerm_storage_account.main.primary_web_host}',
      global_delivery_rule: {
        cache_expiration_action: {
          behavior: 'SetIfMissing',
          duration: '1.12:00:00'
        },
        cache_key_query_string_action: {
          behavior: 'ExcludeSpecifiedQueryStrings',
          parameters: ['fbclid', 'utm_source', 'utm_medium', 'utm_campaign']
        },
        modify_request_header_action: {
          action: 'Append',
          name: 'X-CDN-Endpoint',
          value: resourceName
        }
      },
      delivery_rule: {
        name: 'EnforceHTTPS',
        order: 1,
        request_scheme_condition: {
          operator: 'Equal',
          match_values: ['HTTP']
        },
        url_redirect_action: {
          redirect_type: 'Found',
          protocol: 'Https'
        }
      },
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 