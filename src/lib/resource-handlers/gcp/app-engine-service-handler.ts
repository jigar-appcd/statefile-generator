import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPAppEngineServiceHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      service: resourceName.toLowerCase(),
      project: '${data.google_project.current.project_id}',
      runtime: 'nodejs18',
      entrypoint: {
        shell: 'npm start'
      },
      deployment: {
        zip: {
          source_url: '${google_storage_bucket.app.url}/source.zip',
          files_count: 1
        }
      },
      version_id: 'v1',
      inbound_services: ['WARMUP'],
      instance_class: 'F1',
      automatic_scaling: {
        target_cpu_utilization: 0.65,
        target_throughput_utilization: 0.65,
        min_idle_instances: 1,
        max_idle_instances: 3,
        min_pending_latency: '30ms',
        max_pending_latency: '300ms',
        max_concurrent_requests: 10,
        min_instances: 1,
        max_instances: 10
      },
      network: {
        name: '${google_compute_network.main.name}',
        subnetwork: '${google_compute_subnetwork.main.name}',
        forwarded_ports: ['8080']
      },
      env_variables: {
        NODE_ENV: 'production',
        APP_VERSION: 'v1'
      },
      vpc_access_connector: {
        name: '${google_vpc_access_connector.main.id}'
      },
      handlers: [
        {
          url_regex: '.*',
          script: {
            script_path: 'auto'
          },
          security_level: 'SECURE_ALWAYS',
          login: 'LOGIN_REQUIRED',
          auth_fail_action: 'AUTH_FAIL_ACTION_REDIRECT'
        }
      ],
      labels: {
        name: resourceName.toLowerCase(),
        ...commonTags
      },
      depends_on: [
        'google_compute_network.main',
        'google_compute_subnetwork.main',
        'google_vpc_access_connector.main',
        'google_storage_bucket.app'
      ]
    }

    return attributes
  }
} 