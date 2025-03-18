import { Region } from '@/types/cloud'
import { randomBytes } from 'crypto'

export interface ResourceAttributes {
  [key: string]: unknown
}

export interface ResourceHandler {
  getAttributes(resourceName: string, region?: Region): ResourceAttributes
}

export function generateResourceId(prefix = ''): string {
  const hash = randomBytes(4).toString('hex')
  return prefix ? `${prefix}-${hash}` : hash
}

export function generateAccountId(): string {
  return randomBytes(6).toString('hex').slice(0, 12).padStart(12, '0')
}

export const commonTags = {
  Environment: 'production',
  ManagedBy: 'terraform'
}

export function generateArn(service: string, region: Region, accountId: string, resourceType: string, resourceId: string): string {
  return `arn:aws:${service}:${region.code}:${accountId}:${resourceType}/${resourceId}`
}

// Resource-specific ID generators
export function generateVpcId(): string {
  return `vpc-${randomBytes(4).toString('hex')}`
}

export function generateSubnetId(): string {
  return `subnet-${randomBytes(4).toString('hex')}`
}

export function generateSecurityGroupId(): string {
  return `sg-${randomBytes(4).toString('hex')}`
}

export function generateInstanceId(): string {
  return `i-${randomBytes(4).toString('hex')}`
}

export function generateLaunchTemplateId(): string {
  return `lt-${randomBytes(4).toString('hex')}`
}

export function generateAutoScalingGroupId(): string {
  return `asg-${randomBytes(4).toString('hex')}`
}

export function generateEcsServiceId(): string {
  return `svc-${randomBytes(4).toString('hex')}`
}

export function generateEcsClusterId(): string {
  return `cluster-${randomBytes(4).toString('hex')}`
}

export function generateEcsTaskDefinitionId(): string {
  return `task-${randomBytes(4).toString('hex')}`
}

export function generateTargetGroupId(): string {
  return `tg-${randomBytes(4).toString('hex')}`
}

export function generateBeanstalkTemplateId(): string {
  return `template-${randomBytes(4).toString('hex')}`
}

export function generateBeanstalkAppId(): string {
  return `app-${randomBytes(4).toString('hex')}`
}

export function generateBeanstalkRoleId(): string {
  return `role-${randomBytes(4).toString('hex')}`
}

export function generateBeanstalkInstanceProfileId(): string {
  return `profile-${randomBytes(4).toString('hex')}`
}

export function generateKmsKeyId(): string {
  return `key-${randomBytes(4).toString('hex')}`
}

export function generateLogGroupId(): string {
  return `log-${randomBytes(4).toString('hex')}`
}

export function generateLambdaFunctionId(): string {
  return `func-${randomBytes(4).toString('hex')}`
}

export function generateS3BucketId(): string {
  return `bucket-${randomBytes(4).toString('hex')}`
}

export function generateEcrRepoId(): string {
  return `repo-${randomBytes(4).toString('hex')}`
}

export function generateDynamoTableId(): string {
  return `table-${randomBytes(4).toString('hex')}`
}

export function generateRdsInstanceId(): string {
  return `db-${randomBytes(4).toString('hex')}`
}

export function generateElastiCacheClusterId(): string {
  return `cache-${randomBytes(4).toString('hex')}`
}

export function generateRedshiftClusterId(): string {
  return `redshift-${randomBytes(4).toString('hex')}`
}

export function generateSageMakerNotebookId(): string {
  return `notebook-${randomBytes(4).toString('hex')}`
}

export function generateGlueJobId(): string {
  return `job-${randomBytes(4).toString('hex')}`
}

export function generateGlueCrawlerId(): string {
  return `crawler-${randomBytes(4).toString('hex')}`
}

// Azure Resource ID Generators
export function generateAzureResourceGroupId(): string {
  return `rg-${randomBytes(4).toString('hex')}`
}

export function generateAzureVnetId(): string {
  return `vnet-${randomBytes(4).toString('hex')}`
}

export function generateAzureSubnetId(): string {
  return `subnet-${randomBytes(4).toString('hex')}`
}

export function generateAzureNsgId(): string {
  return `nsg-${randomBytes(4).toString('hex')}`
}

export function generateAzureVmId(): string {
  return `vm-${randomBytes(4).toString('hex')}`
}

export function generateAzureStorageAccountId(): string {
  return `st${randomBytes(4).toString('hex')}`
}

export function generateAzureKeyVaultId(): string {
  return `kv-${randomBytes(4).toString('hex')}`
}

export function generateAzureFunctionAppId(): string {
  return `func-${randomBytes(4).toString('hex')}`
}

export function generateAzureAppServicePlanId(): string {
  return `plan-${randomBytes(4).toString('hex')}`
}

// GCP Resource ID Generators
export function generateGcpProjectId(): string {
  return `project-${randomBytes(4).toString('hex')}`
}

export function generateGcpInstanceId(): string {
  return `instance-${randomBytes(4).toString('hex')}`
}

export function generateGcpDiskId(): string {
  return `disk-${randomBytes(4).toString('hex')}`
}

export function generateGcpNetworkId(): string {
  return `network-${randomBytes(4).toString('hex')}`
}

export function generateGcpSubnetworkId(): string {
  return `subnetwork-${randomBytes(4).toString('hex')}`
}

export function generateGcpFirewallId(): string {
  return `fw-${randomBytes(4).toString('hex')}`
}

export function generateGcpServiceAccountId(): string {
  return `sa-${randomBytes(4).toString('hex')}`
}

export function generateGcpKmsKeyId(): string {
  return `key-${randomBytes(4).toString('hex')}`
}

export function generateGcpStorageBucketId(): string {
  return `bucket-${randomBytes(4).toString('hex')}`
}

export function generateGcpPubsubTopicId(): string {
  return `topic-${randomBytes(4).toString('hex')}`
}

export function generateGcpPubsubSubscriptionId(): string {
  return `sub-${randomBytes(4).toString('hex')}`
}

export function generateGcpCloudRunServiceId(): string {
  return `run-${randomBytes(4).toString('hex')}`
}

export function generateGcpCloudFunctionId(): string {
  return `func-${randomBytes(4).toString('hex')}`
}

// EKS Resource ID Generators
export function generateEksClusterId(): string {
  return `cluster-${randomBytes(4).toString('hex')}`
}

export function generateEksNodeGroupId(): string {
  return `ng-${randomBytes(4).toString('hex')}`
}

export function generateEksFargateProfileId(): string {
  return `fp-${randomBytes(4).toString('hex')}`
}

export function generateEksAddonId(): string {
  return `addon-${randomBytes(4).toString('hex')}`
}

export function generateEksIdentityProviderId(): string {
  return `idp-${randomBytes(4).toString('hex')}`
} 