import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class GCPSpannerHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      config: `${region.code}-1`,
      display_name: `${resourceName} Spanner Instance`,
      processing_units: 1000,
      instance: {
        name: resourceName,
        config: `${region.code}-1`,
        display_name: `${resourceName} Instance`,
        num_nodes: 1,
        deletion_protection: true
      },
      database: {
        name: 'main',
        instance: resourceName,
        version_retention_period: '7d',
        deletion_protection: true,
        encryption_config: {
          kms_key_name: '${google_kms_crypto_key.spanner.id}'
        },
        ddl: [
          'CREATE TABLE users (id STRING(36) NOT NULL, name STRING(MAX), email STRING(MAX)) PRIMARY KEY (id)',
          'CREATE INDEX users_by_email ON users (email)',
          'CREATE TABLE orders (id STRING(36) NOT NULL, user_id STRING(36) NOT NULL, amount FLOAT64, status STRING(20)) PRIMARY KEY (id)',
          'CREATE INDEX orders_by_user ON orders (user_id)',
          'CREATE TABLE order_items (order_id STRING(36) NOT NULL, product_id STRING(36) NOT NULL, quantity INT64, price FLOAT64) PRIMARY KEY (order_id, product_id)',
        ]
      },
      backup: {
        name: 'daily',
        instance: resourceName,
        database: 'main',
        retention_period: '7d',
        encryption_config: {
          kms_key_name: '${google_kms_crypto_key.spanner.id}'
        }
      },
      iam_binding: [
        {
          role: 'roles/spanner.databaseAdmin',
          members: [
            'serviceAccount:${google_service_account.spanner.email}'
          ]
        }
      ],
      labels: {
        name: resourceName.toLowerCase(),
        ...commonTags
      }
    }

    return attributes
  }
} 