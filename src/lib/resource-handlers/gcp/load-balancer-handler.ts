import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPLoadBalancerHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      load_balancing_scheme: 'EXTERNAL_MANAGED',
      ip_version: 'IPV4',
      url_map: {
        name: resourceName,
        default_service: '${google_compute_backend_service.default.id}',
        host_rule: [
          {
            hosts: ['*'],
            path_matcher: 'main'
          }
        ],
        path_matcher: [
          {
            name: 'main',
            default_service: '${google_compute_backend_service.default.id}',
            path_rule: [
              {
                paths: ['/api/*'],
                service: '${google_compute_backend_service.api.id}'
              },
              {
                paths: ['/static/*'],
                service: '${google_compute_backend_bucket.static.id}'
              }
            ]
          }
        ]
      },
      backend_service: [
        {
          name: 'default',
          protocol: 'HTTP',
          port_name: 'http',
          timeout_sec: 30,
          enable_cdn: true,
          connection_draining_timeout_sec: 300,
          custom_request_headers: [
            'X-Client-Geo-Location: {client_region}',
            'X-Client-IP-Address: {client_ip_address}'
          ],
          security_policy: '${google_compute_security_policy.main.id}',
          log_config: {
            enable: true,
            sample_rate: 1.0
          },
          backend: [
            {
              group: '${google_compute_instance_group_manager.default.instance_group}',
              balancing_mode: 'UTILIZATION',
              max_utilization: 0.8,
              capacity_scaler: 1.0
            }
          ],
          health_check: {
            check_interval_sec: 5,
            timeout_sec: 5,
            healthy_threshold: 2,
            unhealthy_threshold: 2,
            http_health_check: {
              port: 80,
              request_path: '/health'
            }
          },
          cdn_policy: {
            cache_mode: 'USE_ORIGIN_HEADERS',
            client_ttl: 3600,
            default_ttl: 3600,
            max_ttl: 86400,
            negative_caching: true,
            serve_while_stale: 86400
          }
        }
      ],
      ssl_certificate: [
        {
          name: resourceName,
          private_key: '${file("ssl/private.key")}',
          certificate: '${file("ssl/certificate.crt")}'
        }
      ],
      target_https_proxy: {
        name: resourceName,
        url_map: resourceName,
        ssl_certificates: [resourceName],
        quic_override: 'ENABLE',
        ssl_policy: '${google_compute_ssl_policy.main.id}'
      },
      forwarding_rule: {
        name: resourceName,
        target: '${google_compute_target_https_proxy.main.id}',
        port_range: '443',
        ip_protocol: 'TCP',
        load_balancing_scheme: 'EXTERNAL_MANAGED',
        network_tier: 'PREMIUM'
      },
      labels: {
        name: resourceName.toLowerCase(),
        ...commonTags
      }
    }

    return attributes
  }
} 