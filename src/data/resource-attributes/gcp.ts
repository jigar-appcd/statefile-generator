import { ResourceAttributes } from '@/types/cloud'

export const gcpResourceAttributes: Record<string, ResourceAttributes> = {
  // Compute Resources
  google_compute_instance: {
    provider: 'google',
    name: '${var.instance_name}',
    machine_type: 'e2-medium',
    zone: '${var.zone}',
    project: '${var.project_id}',
    boot_disk: {
      initialize_params: {
        image: 'debian-cloud/debian-10',
        size: 50,
        type: 'pd-ssd',
      },
    },
    network_interface: [{
      network: '${google_compute_network.main.self_link}',
      subnetwork: '${google_compute_subnetwork.main.self_link}',
      access_config: [{
        // Ephemeral public IP
      }],
    }],
    service_account: {
      email: '${google_service_account.compute.email}',
      scopes: ['cloud-platform'],
    },
    metadata: {
      ssh_keys: '${var.ssh_user}:${var.ssh_pub_key}',
    },
    labels: {
      environment: '${var.environment}',
    },
    depends_on: [
      'google_compute_network.main',
      'google_compute_subnetwork.main',
      'google_service_account.compute'
    ],
  },

  google_cloudfunctions_function: {
    provider: 'google',
    name: '${var.function_name}',
    project: '${var.project_id}',
    region: '${var.region}',
    runtime: 'nodejs16',
    available_memory_mb: 256,
    source_archive_bucket: '${google_storage_bucket.function_source.name}',
    source_archive_object: '${google_storage_bucket_object.function_source.name}',
    trigger_http: true,
    entry_point: '${var.function_entry_point}',
    service_account_email: '${google_service_account.function.email}',
    environment_variables: {
      PROJECT_ID: '${var.project_id}',
    },
    depends_on: [
      'google_storage_bucket.function_source',
      'google_storage_bucket_object.function_source',
      'google_service_account.function'
    ],
  },

  google_compute_disk: {
    name: 'example-disk',
    type: 'pd-ssd',
    zone: 'us-central1-a',
    size: 50,
    labels: {
      environment: 'production',
    },
  },

  // Networking Resources
  google_compute_network: {
    provider: 'google',
    name: '${var.network_name}',
    project: '${var.project_id}',
    auto_create_subnetworks: false,
    routing_mode: 'REGIONAL',
  },

  google_compute_subnetwork: {
    provider: 'google',
    name: '${var.subnet_name}',
    project: '${var.project_id}',
    region: '${var.region}',
    network: '${google_compute_network.main.self_link}',
    ip_cidr_range: '10.0.0.0/24',
    private_ip_google_access: true,
    secondary_ip_range: [{
      range_name: 'pod-range',
      ip_cidr_range: '10.1.0.0/16',
    }],
    depends_on: ['google_compute_network.main'],
  },

  google_compute_firewall: {
    name: '${var.firewall_name}',
    network: '${google_compute_network.main.self_link}',
    allow: [
      {
        protocol: 'tcp',
        ports: ['22', '80', '443'],
      },
    ],
    source_ranges: ['${var.allowed_ip_ranges}'],
    target_tags: ['${var.environment}'],
    depends_on: ['google_compute_network.main'],
  },

  google_compute_router: {
    name: 'example-router',
    network: 'example-network',
    region: 'us-central1',
    bgp: {
      asn: 64514,
    },
  },

  // Storage Resources
  google_storage_bucket: {
    provider: 'google',
    name: '${var.bucket_name}',
    project: '${var.project_id}',
    location: '${var.region}',
    storage_class: 'STANDARD',
    uniform_bucket_level_access: true,
    versioning: {
      enabled: true,
    },
    lifecycle_rule: [{
      condition: {
        age: 30,
      },
      action: {
        type: 'SetStorageClass',
        storage_class: 'NEARLINE',
      },
    }],
    labels: {
      environment: '${var.environment}',
    },
  },

  google_filestore_instance: {
    provider: 'google',
    name: 'example-filestore',
    tier: 'BASIC_HDD',
    file_shares: [
      {
        name: 'share1',
        capacity_gb: 1024,
      },
    ],
    networks: [
      {
        network: 'default',
        modes: ['MODE_IPV4'],
      },
    ],
  },

  // Database Resources
  google_sql_database_instance: {
    provider: 'google',
    name: '${var.db_instance_name}',
    project: '${var.project_id}',
    region: '${var.region}',
    database_version: 'POSTGRES_13',
    settings: {
      tier: 'db-f1-micro',
      availability_type: 'REGIONAL',
      backup_configuration: {
        enabled: true,
        start_time: '02:00',
      },
      ip_configuration: {
        ipv4_enabled: false,
        private_network: '${google_compute_network.main.self_link}',
      },
    },
    depends_on: ['google_compute_network.main'],
  },

  google_spanner_instance: {
    name: 'example-spanner',
    config: 'regional-us-central1',
    display_name: 'Example Spanner Instance',
    num_nodes: 1,
    labels: {
      environment: 'production',
    },
  },

  // Container Resources
  google_container_cluster: {
    provider: 'google',
    name: '${var.cluster_name}',
    project: '${var.project_id}',
    location: '${var.region}',
    network: '${google_compute_network.main.self_link}',
    subnetwork: '${google_compute_subnetwork.main.self_link}',
    remove_default_node_pool: true,
    initial_node_count: 1,
    networking_mode: 'VPC_NATIVE',
    private_cluster_config: {
      enable_private_nodes: true,
      enable_private_endpoint: false,
      master_ipv4_cidr_block: '172.16.0.0/28',
    },
    ip_allocation_policy: {
      cluster_secondary_range_name: 'pod-range',
      services_secondary_range_name: 'svc-range',
    },
    master_authorized_networks_config: {
      cidr_blocks: [{
        cidr_block: '${var.authorized_networks}',
        display_name: 'authorized-network',
      }],
    },
    depends_on: [
      'google_compute_network.main',
      'google_compute_subnetwork.main'
    ],
  },

  google_container_node_pool: {
    provider: 'google',
    name: '${var.node_pool_name}',
    project: '${var.project_id}',
    location: '${var.region}',
    cluster: '${google_container_cluster.main.name}',
    node_count: 1,
    node_config: {
      machine_type: 'e2-standard-2',
      disk_size_gb: 100,
      disk_type: 'pd-standard',
      service_account: '${google_service_account.gke.email}',
      oauth_scopes: [
        'https://www.googleapis.com/auth/cloud-platform',
      ],
    },
    management: {
      auto_repair: true,
      auto_upgrade: true,
    },
    depends_on: [
      'google_container_cluster.main',
      'google_service_account.gke'
    ],
  },

  // Machine Learning Resources
  google_ai_platform_model: {
    name: 'example-model',
    description: 'Example AI Platform model',
    regions: ['us-central1'],
    online_prediction_logging: true,
    labels: {
      environment: 'production',
    },
  },

  google_notebooks_instance: {
    name: 'example-notebook',
    location: 'us-central1-a',
    machine_type: 'e2-medium',
    vm_image: {
      project: 'deeplearning-platform-release',
      image_family: 'tf-latest-cpu',
    },
  },

  google_notebooks_runtime: {
    name: 'example-runtime',
    location: 'us-central1',
    access_config: {
      runtime_owner: 'user@example.com',
    },
    software_config: {
      idle_shutdown: true,
      idle_shutdown_timeout: 180,
    },
    virtual_machine: {
      virtual_machine_config: {
        machine_type: 'n1-standard-4',
      },
    },
  },

  // Serverless Resources
  google_cloud_run_service: {
    provider: 'google',
    name: '${var.service_name}',
    location: '${var.region}',
    project: '${var.project_id}',
    template: {
      spec: {
        containers: [{
          image: '${var.container_image}',
          resources: {
            limits: {
              cpu: '1000m',
              memory: '512Mi',
            },
          },
          env: [{
            name: 'PROJECT_ID',
            value: '${var.project_id}',
          }],
        }],
        service_account_name: '${google_service_account.cloudrun.email}',
      },
    },
    traffic: [{
      percent: 100,
      latest_revision: true,
    }],
    depends_on: ['google_service_account.cloudrun'],
  },

  google_cloud_run_domain_mapping: {
    name: 'example.com',
    location: 'us-central1',
    metadata: {
      namespace: 'example-project',
    },
    spec: {
      route_name: 'example-service',
    },
  },

  google_app_engine_application: {
    location_id: 'us-central',
    database_type: 'CLOUD_FIRESTORE',
    serving_status: 'SERVING',
  },

  google_app_engine_service: {
    service: 'default',
    runtime: 'nodejs14',
    entrypoint: {
      shell: 'npm start',
    },
    deployment: {
      zip: {
        source_url: 'https://storage.googleapis.com/example-bucket/app.zip',
      },
    },
    env_variables: {
      NODE_ENV: 'production',
    },
  },

  // Security Resources
  google_service_account: {
    provider: 'google',
    account_id: '${var.service_account_id}',
    project: '${var.project_id}',
    display_name: '${var.service_account_display_name}',
  },

  google_kms_key_ring: {
    provider: 'google',
    name: '${var.keyring_name}',
    project: '${var.project_id}',
    location: '${var.region}',
  },

  google_kms_crypto_key: {
    name: '${var.key_name}',
    key_ring: '${google_kms_key_ring.main.self_link}',
    rotation_period: '7776000s', // 90 days
    depends_on: ['google_kms_key_ring.main'],
  },

  google_secret_manager_secret: {
    provider: 'google',
    secret_id: 'example-secret',
    replication: {
      automatic: true,
    },
    labels: {
      environment: 'production',
    },
  },

  google_security_center_source: {
    display_name: 'Example Source',
    description: 'Example security source',
  },

  // Monitoring Resources
  google_monitoring_alert_policy: {
    provider: 'google',
    display_name: '${var.alert_policy_name}',
    project: '${var.project_id}',
    combiner: 'OR',
    conditions: [{
      display_name: 'test condition',
      condition_threshold: {
        filter: 'metric.type="compute.googleapis.com/instance/cpu/utilization" AND resource.type="gce_instance"',
        duration: '60s',
        comparison: 'COMPARISON_GT',
        threshold_value: 0.8,
        trigger: {
          count: 1,
        },
      },
    }],
    notification_channels: ['${google_monitoring_notification_channel.email.name}'],
    depends_on: ['google_monitoring_notification_channel.email'],
  },

  google_monitoring_dashboard: {
    dashboard_json: JSON.stringify({
      displayName: 'Example Dashboard',
      gridLayout: {
        columns: '2',
        widgets: [
          {
            title: 'CPU Usage',
            xyChart: {
              dataSets: [{
                timeSeriesQuery: {
                  timeSeriesFilter: {
                    filter: 'metric.type="compute.googleapis.com/instance/cpu/utilization"',
                  },
                },
              }],
            },
          },
        ],
      },
    }),
  },

  google_logging_metric: {
    name: 'example-metric',
    filter: 'resource.type="gce_instance"',
    metric_descriptor: {
      metric_kind: 'DELTA',
      value_type: 'INT64',
      unit: '1',
      labels: [
        {
          key: 'environment',
          value_type: 'STRING',
          description: 'Environment label',
        },
      ],
    },
  },

  google_logging_project_sink: {
    name: 'example-sink',
    destination: 'storage.googleapis.com/example-bucket',
    filter: 'severity >= WARNING',
    unique_writer_identity: true,
  },

  // Pub/Sub Resources
  google_pubsub_topic: {
    provider: 'google',
    name: '${var.topic_name}',
    project: '${var.project_id}',
    labels: {
      environment: '${var.environment}',
    },
    message_retention_duration: '86600s',
  },

  google_pubsub_subscription: {
    provider: 'google',
    name: '${var.subscription_name}',
    project: '${var.project_id}',
    topic: '${google_pubsub_topic.main.name}',
    ack_deadline_seconds: 20,
    message_retention_duration: '604800s',
    retain_acked_messages: true,
    expiration_policy: {
      ttl: '2592000s',
    },
    depends_on: ['google_pubsub_topic.main'],
  },

  // Load Balancing Resources
  google_compute_global_address: {
    provider: 'google',
    name: '${var.address_name}',
    project: '${var.project_id}',
  },

  google_compute_global_forwarding_rule: {
    provider: 'google',
    name: '${var.forwarding_rule_name}',
    project: '${var.project_id}',
    target: '${google_compute_target_https_proxy.main.self_link}',
    port_range: '443',
    ip_address: '${google_compute_global_address.main.address}',
    depends_on: [
      'google_compute_target_https_proxy.main',
      'google_compute_global_address.main'
    ],
  },

  google_bigquery_dataset: {
    provider: 'google',
    name: 'example-dataset',
    project: '${var.project_id}',
    location: '${var.region}',
  },

  google_bigquery_table: {
    provider: 'google',
    name: 'example-table',
    project: '${var.project_id}',
    dataset: '${google_bigquery_dataset.main.name}',
    schema: JSON.stringify({
      fields: [
        { name: 'id', type: 'INTEGER' },
        { name: 'name', type: 'STRING' },
        { name: 'age', type: 'INTEGER' },
      ],
    }),
  },

  google_dataflow_job: {
    provider: 'google',
    name: 'example-dataflow-job',
    project: '${var.project_id}',
    region: '${var.region}',
    template_gcs_path: 'gs://example-bucket/templates/word_count.json',
    parameters: {
      inputFile: 'gs://example-bucket/input.txt',
      outputFile: 'gs://example-bucket/output.txt',
    },
    depends_on: ['google_bigquery_dataset.main'],
  },

  google_dataproc_cluster: {
    provider: 'google',
    name: 'example-dataproc-cluster',
    project: '${var.project_id}',
    region: '${var.region}',
    cluster_config: {
      master_config: {
        num_instances: 1,
        machine_type_uri: 'n1-standard-2',
      },
      worker_config: {
        num_instances: 2,
        machine_type_uri: 'n1-standard-2',
      },
    },
    depends_on: ['google_bigquery_dataset.main'],
  },

  google_redis_instance: {
    provider: 'google',
    name: 'example-redis',
    project: '${var.project_id}',
    region: '${var.region}',
    tier: 'STANDARD',
    memory_size_gb: 1,
  },

  google_dns_managed_zone: {
    provider: 'google',
    name: 'example-zone',
    project: '${var.project_id}',
    dns_name: 'example.com.',
    description: 'Example DNS zone',
  },

  google_dns_record_set: {
    provider: 'google',
    name: 'example.com',
    project: '${var.project_id}',
    type: 'A',
    ttl: 300,
    managed_zone: '${google_dns_managed_zone.main.name}',
    rrdatas: ['192.168.1.1'],
  },

  google_certificate_manager_certificate: {
    provider: 'google',
    name: 'example-certificate',
    project: '${var.project_id}',
    managed: {
      domains: ['example.com'],
      dns_names: ['example.com'],
    },
    certificate_authority: '${google_certificate_authority.main.name}',
  },

  google_cloud_armor_security_policy: {
    provider: 'google',
    name: 'example-policy',
    project: '${var.project_id}',
    description: 'Example security policy',
  },

  google_cloud_scheduler_job: {
    provider: 'google',
    name: 'example-job',
    project: '${var.project_id}',
    region: '${var.region}',
    schedule: '0 * * * *',
    http_target: {
      http_method: 'GET',
      uri: 'https://example.com/api',
    },
    depends_on: ['google_service_account.cloudrun'],
  },

  google_cloud_tasks_queue: {
    provider: 'google',
    name: 'example-queue',
    project: '${var.project_id}',
    location: '${var.region}',
    task_type: 'http',
    depends_on: ['google_service_account.cloudrun'],
  },

  google_service_directory_namespace: {
    provider: 'google',
    name: 'example-namespace',
    project: '${var.project_id}',
    location: '${var.region}',
  },

  google_network_connectivity_hub: {
    provider: 'google',
    name: 'example-hub',
    project: '${var.project_id}',
    location: '${var.region}',
  },

  google_compute_interconnect_attachment: {
    provider: 'google',
    name: 'example-attachment',
    project: '${var.project_id}',
    region: '${var.region}',
    edge_availability_domain: 'AVAILABILITY_DOMAIN_1',
    interconnect: '${google_compute_interconnect.main.name}',
    router: '${google_compute_router.main.name}',
    type: 'TRANSIT'
  },
} 