import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateResourceId,
    generateS3BucketId
} from '../base-handler'

export class AWSCloudFrontDistributionHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const bucketId = generateS3BucketId()
    const oaiId = generateResourceId('oai')
    const wafAclId = generateResourceId('waf')
    
    const attributes: ResourceAttributes = {
      enabled: true,
      is_ipv6_enabled: true,
      comment: `CloudFront distribution for ${resourceName}`,
      default_root_object: 'index.html',
      price_class: 'PriceClass_100',
      http_version: 'http2and3',
      web_acl_id: wafAclId,
      origin: [
        {
          domain_name: `${bucketId}.s3.amazonaws.com`,
          origin_id: bucketId,
          origin_path: '',
          s3_origin_config: {
            origin_access_identity: `origin-access-identity/cloudfront/${oaiId}`
          }
        }
      ],
      default_cache_behavior: {
        allowed_methods: ['GET', 'HEAD', 'OPTIONS'],
        cached_methods: ['GET', 'HEAD'],
        target_origin_id: bucketId,
        viewer_protocol_policy: 'redirect-to-https',
        min_ttl: 0,
        default_ttl: 3600,
        max_ttl: 86400,
        compress: true,
        cache_policy_id: 'REPLACE_WITH_CACHE_POLICY_ID',
        origin_request_policy_id: 'REPLACE_WITH_ORIGIN_REQUEST_POLICY_ID'
      },
      ordered_cache_behavior: [
        {
          path_pattern: '/api/*',
          allowed_methods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'POST', 'PATCH', 'DELETE'],
          cached_methods: ['GET', 'HEAD'],
          target_origin_id: bucketId,
          viewer_protocol_policy: 'https-only',
          min_ttl: 0,
          default_ttl: 0,
          max_ttl: 0,
          compress: true,
          cache_policy_id: 'REPLACE_WITH_API_CACHE_POLICY_ID',
          origin_request_policy_id: 'REPLACE_WITH_API_ORIGIN_REQUEST_POLICY_ID'
        }
      ],
      custom_error_response: [
        {
          error_code: 403,
          response_code: 200,
          response_page_path: '/index.html',
          error_caching_min_ttl: 10
        },
        {
          error_code: 404,
          response_code: 200,
          response_page_path: '/index.html',
          error_caching_min_ttl: 10
        }
      ],
      restrictions: {
        geo_restriction: {
          restriction_type: 'none'
        }
      },
      viewer_certificate: {
        cloudfront_default_certificate: true,
        minimum_protocol_version: 'TLSv1.2_2021',
        ssl_support_method: 'sni-only'
      },
      wait_for_deployment: false,
      retain_on_delete: false,
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_s3_bucket.${bucketId}`,
        `aws_cloudfront_origin_access_identity.${oaiId}`,
        `aws_wafv2_web_acl.${wafAclId}`
      ]
    }

    return attributes
  }
} 