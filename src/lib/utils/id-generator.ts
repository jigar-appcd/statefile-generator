import { randomBytes } from 'crypto'
import { v4 as uuidv4 } from 'uuid'

export function generateResourceId(length = 8): string {
  return randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
    .toLowerCase()
}

export function generateValidPassword(length = 16): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''

  // Ensure at least one of each required character type
  password += 'A' // uppercase
  password += 'a' // lowercase
  password += '1' // number
  password += '!' // special

  // Fill the rest randomly
  while (password.length < length) {
    const randomChar = charset[Math.floor(Math.random() * charset.length)]
    password += randomChar
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

export function generateAwsAccountId(): string {
  return randomBytes(6).toString('hex').slice(0, 12).padStart(12, '0')
}

export function generateAwsArn(service: string, resourceType: string, resourceId: string, region?: string): string {
  const accountId = generateAwsAccountId()
  if (region) {
    return `arn:aws:${service}:${region}:${accountId}:${resourceType}/${resourceId}`
  }
  return `arn:aws:${service}::${accountId}:${resourceType}/${resourceId}`
}

export function generateVpcId(): string {
  return `vpc-${randomBytes(8).toString('hex')}`
}

export function generateSubnetId(): string {
  return `subnet-${randomBytes(8).toString('hex')}`
}

export function generateSecurityGroupId(): string {
  return `sg-${randomBytes(8).toString('hex')}`
}

export function generateInstanceId(): string {
  return `i-${randomBytes(8).toString('hex')}`
}

export function generateVolumeId(): string {
  return `vol-${randomBytes(8).toString('hex')}`
}

export function generateSnapshotId(): string {
  return `snap-${randomBytes(8).toString('hex')}`
}

export function generateKeyPairName(prefix: string): string {
  return `${prefix}-key-${randomBytes(4).toString('hex')}`
}

export function generateS3BucketName(prefix: string): string {
  return `${prefix}-${randomBytes(8).toString('hex')}`
}

export function generateDynamoTableName(prefix: string): string {
  return `${prefix}-table-${randomBytes(4).toString('hex')}`
}

export function generateLambdaFunctionName(prefix: string): string {
  return `${prefix}-function-${randomBytes(4).toString('hex')}`
}

export function generateApiGatewayName(prefix: string): string {
  return `${prefix}-api-${randomBytes(4).toString('hex')}`
}

export function generateCloudWatchLogGroupName(prefix: string): string {
  return `/aws/resource/${prefix}/${randomBytes(4).toString('hex')}`
}

export function generateEcsClusterName(prefix: string): string {
  return `${prefix}-cluster-${randomBytes(4).toString('hex')}`
}

export function generateEcsServiceName(prefix: string): string {
  return `${prefix}-service-${randomBytes(4).toString('hex')}`
}

export function generateEcsTaskDefinitionName(prefix: string): string {
  return `${prefix}-task-${randomBytes(4).toString('hex')}`
}

export function generateRdsInstanceId(prefix: string): string {
  return `${prefix}-db-${randomBytes(4).toString('hex')}`
}

export function generateElastiCacheClusterId(prefix: string): string {
  return `${prefix}-cache-${randomBytes(4).toString('hex')}`
}

export function generateResourceGroupName(prefix: string, purpose: string): string {
  const randomSuffix = randomBytes(2).toString('hex')
  return `rg-${prefix}-${purpose}-${randomSuffix}`
}

export function generateVnetName(prefix: string): string {
  const randomSuffix = randomBytes(2).toString('hex')
  return `vnet-${prefix}-${randomSuffix}`
}

export function generateServiceBusName(prefix: string): string {
  const randomSuffix = randomBytes(3).toString('hex')
  return `sb-${prefix}-${randomSuffix}`
}

export function generateSubscriptionId(): string {
  return uuidv4()
}

export function generateTenantId(): string {
  return uuidv4()
}

export function generateObjectId(): string {
  return uuidv4()
}

export function generateKeyVaultKeyId(subscriptionId: string, resourceGroupName: string, keyVaultName: string, keyName: string): string {
  return `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.KeyVault/vaults/${keyVaultName}/keys/${keyName}`
}

export function generateManagedIdentityId(subscriptionId: string, resourceGroupName: string, identityName: string): string {
  return `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/${identityName}`
}

// GCP specific generators
export function generateGcpProjectId(): string {
  return `project-${randomBytes(4).toString('hex')}`
}

export function generateGcpInstanceName(prefix: string): string {
  return `${prefix}-vm-${randomBytes(4).toString('hex')}`
}

export function generateGcpDiskName(prefix: string): string {
  return `${prefix}-disk-${randomBytes(4).toString('hex')}`
}

export function generateGcpNetworkName(prefix: string): string {
  return `${prefix}-net-${randomBytes(4).toString('hex')}`
}

export function generateGcpSubnetworkName(prefix: string): string {
  return `${prefix}-subnet-${randomBytes(4).toString('hex')}`
}

export function generateGcpFirewallName(prefix: string): string {
  return `${prefix}-fw-${randomBytes(4).toString('hex')}`
}

export function generateGcpServiceAccountEmail(): string {
  const id = randomBytes(4).toString('hex')
  return `sa-${id}@${generateGcpProjectId()}.iam.gserviceaccount.com`
}

export function generateGcpKmsKeyRingName(prefix: string): string {
  return `${prefix}-keyring-${randomBytes(4).toString('hex')}`
}

export function generateGcpKmsKeyName(prefix: string): string {
  return `${prefix}-key-${randomBytes(4).toString('hex')}`
} 