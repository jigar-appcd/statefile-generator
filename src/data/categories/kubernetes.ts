import { ResourceCategory } from '@/types/cloud'

export const kubernetesCategories: ResourceCategory[] = [
  {
    id: 'workloads',
    name: 'Workloads',
    description: 'Core workload resources like Pods, Deployments, and StatefulSets',
    resources: [
      {
        id: 'kubernetes_pod',
        name: 'Pod',
        type: 'kubernetes_pod',
        category: 'workloads',
        description: 'Smallest deployable unit in Kubernetes',
        attributes: {},
      },
      {
        id: 'kubernetes_deployment',
        name: 'Deployment',
        type: 'kubernetes_deployment',
        category: 'workloads',
        description: 'Declarative updates for Pods and ReplicaSets',
        attributes: {},
      },
      {
        id: 'kubernetes_stateful_set',
        name: 'StatefulSet',
        type: 'kubernetes_stateful_set',
        category: 'workloads',
        description: 'Manages stateful applications',
        attributes: {},
      },
      {
        id: 'kubernetes_daemon_set',
        name: 'DaemonSet',
        type: 'kubernetes_daemon_set',
        category: 'workloads',
        description: 'Ensures all nodes run a copy of a Pod',
        attributes: {},
      },
      {
        id: 'kubernetes_job',
        name: 'Job',
        type: 'kubernetes_job',
        category: 'workloads',
        description: 'Runs a Pod to completion',
        attributes: {},
      },
      {
        id: 'kubernetes_cron_job',
        name: 'CronJob',
        type: 'kubernetes_cron_job',
        category: 'workloads',
        description: 'Creates Jobs on a schedule',
        attributes: {},
      },
    ],
  },
  {
    id: 'networking',
    name: 'Networking',
    description: 'Network resources like Services and Ingress',
    resources: [
      {
        id: 'kubernetes_service',
        name: 'Service',
        type: 'kubernetes_service',
        category: 'networking',
        description: 'Exposes applications running on Pods',
        attributes: {},
      },
      {
        id: 'kubernetes_ingress',
        name: 'Ingress',
        type: 'kubernetes_ingress',
        category: 'networking',
        description: 'HTTP/HTTPS routing to Services',
        attributes: {},
      },
      {
        id: 'kubernetes_network_policy',
        name: 'Network Policy',
        type: 'kubernetes_network_policy',
        category: 'networking',
        description: 'Pod network traffic rules',
        attributes: {},
      },
      {
        id: 'kubernetes_endpoint',
        name: 'Endpoint',
        type: 'kubernetes_endpoint',
        category: 'networking',
        description: 'Manual Service endpoint configuration',
        attributes: {},
      },
    ],
  },
  {
    id: 'storage',
    name: 'Storage',
    description: 'Storage resources like PersistentVolumes and ConfigMaps',
    resources: [
      {
        id: 'kubernetes_persistent_volume',
        name: 'PersistentVolume',
        type: 'kubernetes_persistent_volume',
        category: 'storage',
        description: 'Cluster-wide storage resource',
        attributes: {},
      },
      {
        id: 'kubernetes_persistent_volume_claim',
        name: 'PersistentVolumeClaim',
        type: 'kubernetes_persistent_volume_claim',
        category: 'storage',
        description: 'Storage request by a Pod',
        attributes: {},
      },
      {
        id: 'kubernetes_config_map',
        name: 'ConfigMap',
        type: 'kubernetes_config_map',
        category: 'storage',
        description: 'Non-confidential data storage',
        attributes: {},
      },
      {
        id: 'kubernetes_secret',
        name: 'Secret',
        type: 'kubernetes_secret',
        category: 'storage',
        description: 'Sensitive data storage',
        attributes: {},
      },
      {
        id: 'kubernetes_storage_class',
        name: 'StorageClass',
        type: 'kubernetes_storage_class',
        category: 'storage',
        description: 'Storage class configuration',
        attributes: {},
      },
    ],
  },
  {
    id: 'configuration',
    name: 'Configuration',
    description: 'Configuration resources like Namespaces and RBAC',
    resources: [
      {
        id: 'kubernetes_namespace',
        name: 'Namespace',
        type: 'kubernetes_namespace',
        category: 'configuration',
        description: 'Virtual cluster within a cluster',
        attributes: {},
      },
      {
        id: 'kubernetes_role',
        name: 'Role',
        type: 'kubernetes_role',
        category: 'configuration',
        description: 'Namespace-scoped permissions',
        attributes: {},
      },
      {
        id: 'kubernetes_role_binding',
        name: 'RoleBinding',
        type: 'kubernetes_role_binding',
        category: 'configuration',
        description: 'Binds Role to users/groups',
        attributes: {},
      },
      {
        id: 'kubernetes_cluster_role',
        name: 'ClusterRole',
        type: 'kubernetes_cluster_role',
        category: 'configuration',
        description: 'Cluster-wide permissions',
        attributes: {},
      },
      {
        id: 'kubernetes_cluster_role_binding',
        name: 'ClusterRoleBinding',
        type: 'kubernetes_cluster_role_binding',
        category: 'configuration',
        description: 'Binds ClusterRole to users/groups',
        attributes: {},
      },
      {
        id: 'kubernetes_service_account',
        name: 'ServiceAccount',
        type: 'kubernetes_service_account',
        category: 'configuration',
        description: 'Pod identity for API access',
        attributes: {},
      },
    ],
  },
  {
    id: 'autoscaling',
    name: 'Autoscaling',
    description: 'Autoscaling resources for dynamic scaling',
    resources: [
      {
        id: 'kubernetes_horizontal_pod_autoscaler',
        name: 'HorizontalPodAutoscaler',
        type: 'kubernetes_horizontal_pod_autoscaler',
        category: 'autoscaling',
        description: 'Automatically scales Pod replicas',
        attributes: {},
      },
      {
        id: 'kubernetes_vertical_pod_autoscaler',
        name: 'VerticalPodAutoscaler',
        type: 'kubernetes_vertical_pod_autoscaler',
        category: 'autoscaling',
        description: 'Automatically adjusts Pod resources',
        attributes: {},
      },
      {
        id: 'kubernetes_cluster_autoscaler',
        name: 'ClusterAutoscaler',
        type: 'kubernetes_cluster_autoscaler',
        category: 'autoscaling',
        description: 'Automatically adjusts cluster size',
        attributes: {},
      },
    ],
  },
  {
    id: 'policy',
    name: 'Policy',
    description: 'Policy and security resources',
    resources: [
      {
        id: 'kubernetes_pod_security_policy',
        name: 'PodSecurityPolicy',
        type: 'kubernetes_pod_security_policy',
        category: 'policy',
        description: 'Pod security restrictions',
        attributes: {},
      },
      {
        id: 'kubernetes_resource_quota',
        name: 'ResourceQuota',
        type: 'kubernetes_resource_quota',
        category: 'policy',
        description: 'Resource usage limits per namespace',
        attributes: {},
      },
      {
        id: 'kubernetes_limit_range',
        name: 'LimitRange',
        type: 'kubernetes_limit_range',
        category: 'policy',
        description: 'Default resource limits per namespace',
        attributes: {},
      },
    ],
  },
] 