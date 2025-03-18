import { ResourceAttributes } from '@/types/cloud'

export const kubernetesResourceAttributes: Record<string, ResourceAttributes> = {
  // Workload Resources
  kubernetes_pod: {
    metadata: {
      name: 'example-pod',
      namespace: 'default',
      labels: {
        app: 'example',
      },
    },
    spec: {
      container: [
        {
          name: 'main',
          image: 'nginx:latest',
          port: [
            {
              container_port: 80,
            },
          ],
          resources: {
            limits: {
              cpu: '500m',
              memory: '512Mi',
            },
            requests: {
              cpu: '250m',
              memory: '256Mi',
            },
          },
          env: [
            {
              name: 'ENVIRONMENT',
              value: 'production',
            },
          ],
        },
      ],
    },
  },

  kubernetes_deployment: {
    metadata: {
      name: 'example-deployment',
      namespace: 'default',
      labels: {
        app: 'example',
      },
    },
    spec: {
      replicas: 3,
      selector: {
        match_labels: {
          app: 'example',
        },
      },
      template: {
        metadata: {
          labels: {
            app: 'example',
          },
        },
        spec: {
          container: [
            {
              name: 'main',
              image: 'nginx:latest',
              port: [
                {
                  container_port: 80,
                },
              ],
            },
          ],
        },
      },
    },
  },

  kubernetes_stateful_set: {
    metadata: {
      name: 'example-statefulset',
      namespace: 'default',
    },
    spec: {
      replicas: 3,
      service_name: 'example-headless',
      selector: {
        match_labels: {
          app: 'example',
        },
      },
      template: {
        metadata: {
          labels: {
            app: 'example',
          },
        },
        spec: {
          container: [
            {
              name: 'main',
              image: 'mysql:5.7',
              port: [
                {
                  container_port: 3306,
                },
              ],
              volume_mount: [
                {
                  name: 'data',
                  mount_path: '/var/lib/mysql',
                },
              ],
            },
          ],
        },
      },
      volume_claim_template: [
        {
          metadata: {
            name: 'data',
          },
          spec: {
            access_modes: ['ReadWriteOnce'],
            resources: {
              requests: {
                storage: '10Gi',
              },
            },
          },
        },
      ],
    },
  },

  kubernetes_daemon_set: {
    metadata: {
      name: 'example-daemonset',
      namespace: 'default',
    },
    spec: {
      selector: {
        match_labels: {
          app: 'example',
        },
      },
      template: {
        metadata: {
          labels: {
            app: 'example',
          },
        },
        spec: {
          container: [
            {
              name: 'main',
              image: 'fluentd:v1.14',
            },
          ],
          toleration: [
            {
              key: 'node-role.kubernetes.io/master',
              effect: 'NoSchedule',
            },
          ],
        },
      },
    },
  },

  kubernetes_job: {
    metadata: {
      name: 'example-job',
      namespace: 'default',
    },
    spec: {
      template: {
        spec: {
          container: [
            {
              name: 'main',
              image: 'perl:5.34.0',
              command: ['perl', '-Mbignum=bpi', '-wle', 'print bpi(2000)'],
            },
          ],
          restart_policy: 'Never',
        },
      },
      backoff_limit: 4,
    },
  },

  kubernetes_cron_job: {
    metadata: {
      name: 'example-cronjob',
      namespace: 'default',
    },
    spec: {
      schedule: '*/1 * * * *',
      job_template: {
        spec: {
          template: {
            spec: {
              container: [
                {
                  name: 'main',
                  image: 'busybox:1.28',
                  command: ['/bin/sh', '-c', 'date; echo Hello from the Kubernetes cluster'],
                },
              ],
              restart_policy: 'OnFailure',
            },
          },
        },
      },
    },
  },

  // Networking Resources
  kubernetes_service: {
    metadata: {
      name: 'example-service',
      namespace: 'default',
    },
    spec: {
      selector: {
        app: 'example',
      },
      port: [
        {
          port: 80,
          target_port: 80,
          protocol: 'TCP',
        },
      ],
      type: 'ClusterIP',
    },
  },

  kubernetes_ingress: {
    metadata: {
      name: 'example-ingress',
      namespace: 'default',
      annotations: {
        'kubernetes.io/ingress.class': 'nginx',
      },
    },
    spec: {
      rule: [
        {
          host: 'example.com',
          http: {
            path: [
              {
                path: '/',
                backend: {
                  service_name: 'example-service',
                  service_port: 80,
                },
              },
            ],
          },
        },
      ],
    },
  },

  kubernetes_network_policy: {
    metadata: {
      name: 'example-policy',
      namespace: 'default',
    },
    spec: {
      pod_selector: {
        match_labels: {
          app: 'example',
        },
      },
      ingress: [
        {
          from: [
            {
              namespace_selector: {
                match_labels: {
                  name: 'prod',
                },
              },
            },
          ],
          ports: [
            {
              port: 80,
              protocol: 'TCP',
            },
          ],
        },
      ],
    },
  },

  // Storage Resources
  kubernetes_persistent_volume: {
    metadata: {
      name: 'example-pv',
    },
    spec: {
      capacity: {
        storage: '10Gi',
      },
      access_modes: ['ReadWriteOnce'],
      persistent_volume_reclaim_policy: 'Retain',
      storage_class_name: 'standard',
      host_path: {
        path: '/mnt/data',
      },
    },
  },

  kubernetes_persistent_volume_claim: {
    metadata: {
      name: 'example-pvc',
      namespace: 'default',
    },
    spec: {
      access_modes: ['ReadWriteOnce'],
      resources: {
        requests: {
          storage: '5Gi',
        },
      },
      storage_class_name: 'standard',
    },
  },

  kubernetes_config_map: {
    metadata: {
      name: 'example-config',
      namespace: 'default',
    },
    data: {
      'app.properties': 'property1=value1\nproperty2=value2',
      'config.json': '{\n  "key": "value"\n}',
    },
  },

  kubernetes_secret: {
    metadata: {
      name: 'example-secret',
      namespace: 'default',
    },
    type: 'Opaque',
    data: {
      username: 'YWRtaW4=',  // base64 encoded "admin"
      password: 'cGFzc3dvcmQxMjM=',  // base64 encoded "password123"
    },
  },

  kubernetes_storage_class: {
    metadata: {
      name: 'example-storage-class',
    },
    storage_provisioner: 'kubernetes.io/aws-ebs',
    reclaim_policy: 'Delete',
    volume_binding_mode: 'WaitForFirstConsumer',
    parameters: {
      type: 'gp2',
    },
  },

  // Configuration Resources
  kubernetes_namespace: {
    metadata: {
      name: 'example-namespace',
      labels: {
        name: 'example',
      },
    },
  },

  kubernetes_role: {
    metadata: {
      name: 'example-role',
      namespace: 'default',
    },
    rule: [
      {
        api_groups: [''],
        resources: ['pods', 'services'],
        verbs: ['get', 'list', 'watch'],
      },
    ],
  },

  kubernetes_role_binding: {
    metadata: {
      name: 'example-rolebinding',
      namespace: 'default',
    },
    role_ref: {
      api_group: 'rbac.authorization.k8s.io',
      kind: 'Role',
      name: 'example-role',
    },
    subject: [
      {
        kind: 'ServiceAccount',
        name: 'example-sa',
        namespace: 'default',
      },
    ],
  },

  kubernetes_cluster_role: {
    metadata: {
      name: 'example-clusterrole',
    },
    rule: [
      {
        api_groups: [''],
        resources: ['nodes'],
        verbs: ['get', 'list', 'watch'],
      },
    ],
  },

  kubernetes_cluster_role_binding: {
    metadata: {
      name: 'example-clusterrolebinding',
    },
    role_ref: {
      api_group: 'rbac.authorization.k8s.io',
      kind: 'ClusterRole',
      name: 'example-clusterrole',
    },
    subject: [
      {
        kind: 'ServiceAccount',
        name: 'example-sa',
        namespace: 'default',
      },
    ],
  },

  kubernetes_service_account: {
    metadata: {
      name: 'example-sa',
      namespace: 'default',
    },
    secret: [
      {
        name: 'example-sa-token',
      },
    ],
  },

  // Autoscaling Resources
  kubernetes_horizontal_pod_autoscaler: {
    metadata: {
      name: 'example-hpa',
      namespace: 'default',
    },
    spec: {
      scale_target_ref: {
        api_version: 'apps/v1',
        kind: 'Deployment',
        name: 'example-deployment',
      },
      min_replicas: 1,
      max_replicas: 10,
      target_cpu_utilization_percentage: 80,
    },
  },

  kubernetes_vertical_pod_autoscaler: {
    metadata: {
      name: 'example-vpa',
      namespace: 'default',
    },
    spec: {
      target_ref: {
        api_version: 'apps/v1',
        kind: 'Deployment',
        name: 'example-deployment',
      },
      update_policy: {
        update_mode: 'Auto',
      },
    },
  },

  // Policy Resources
  kubernetes_pod_security_policy: {
    metadata: {
      name: 'example-psp',
    },
    spec: {
      privileged: false,
      allow_privilege_escalation: false,
      run_as_user: {
        rule: 'MustRunAsNonRoot',
      },
      se_linux: {
        rule: 'RunAsAny',
      },
      supplemental_groups: {
        rule: 'RunAsAny',
      },
      fs_group: {
        rule: 'RunAsAny',
      },
      volume_types: ['configMap', 'emptyDir', 'persistentVolumeClaim', 'secret'],
    },
  },

  kubernetes_resource_quota: {
    metadata: {
      name: 'example-quota',
      namespace: 'default',
    },
    spec: {
      hard: {
        'requests.cpu': '4',
        'requests.memory': '4Gi',
        'limits.cpu': '8',
        'limits.memory': '8Gi',
        'pods': '10',
      },
    },
  },

  kubernetes_limit_range: {
    metadata: {
      name: 'example-limit-range',
      namespace: 'default',
    },
    spec: {
      limit: [
        {
          type: 'Container',
          default: {
            cpu: '500m',
            memory: '512Mi',
          },
          default_request: {
            cpu: '250m',
            memory: '256Mi',
          },
          max: {
            cpu: '2',
            memory: '2Gi',
          },
          min: {
            cpu: '100m',
            memory: '128Mi',
          },
        },
      ],
    },
  },
} 