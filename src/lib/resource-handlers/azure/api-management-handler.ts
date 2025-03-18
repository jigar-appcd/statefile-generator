import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class AzureAPIManagementHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      location: region.code,
      resource_group_name: '${azurerm_resource_group.main.name}',
      publisher_name: 'Example Organization',
      publisher_email: 'admin@example.com',
      sku_name: 'Premium_1',
      zones: ['1', '2', '3'],
      virtual_network_type: 'Internal',
      virtual_network_configuration: {
        subnet_id: '${azurerm_subnet.apim.id}'
      },
      public_ip_address_id: '${azurerm_public_ip.apim.id}',
      private_ip_addresses: [],
      additional_location: [
        {
          location: '${data.azurerm_resource_group.dr.location}',
          virtual_network_configuration: {
            subnet_id: '${azurerm_subnet.apim_dr.id}'
          },
          public_ip_address_id: '${azurerm_public_ip.apim_dr.id}',
          private_ip_addresses: []
        }
      ],
      certificate_configuration: {
        certificate_source: 'KeyVault',
        key_vault_secret_identity_client_id: '${azurerm_user_assigned_identity.apim.client_id}',
        key_vault_secret_id: '${azurerm_key_vault_certificate.apim.secret_id}'
      },
      client_certificate_enabled: true,
      gateway_disabled: false,
      min_api_version: '2019-12-01',
      notification_sender_email: 'no-reply@example.com',
      policy: {
        xml_content: '${file("policies/api-management-policy.xml")}'
      },
      protocols: {
        enable_http2: true
      },
      security: {
        enable_backend_ssl30: false,
        enable_backend_tls10: false,
        enable_backend_tls11: false,
        enable_frontend_ssl30: false,
        enable_frontend_tls10: false,
        enable_frontend_tls11: false,
        tls_ecdhe_ecdsa_with_aes128_cbc_sha_ciphers_enabled: false,
        tls_ecdhe_ecdsa_with_aes256_cbc_sha_ciphers_enabled: false,
        tls_ecdhe_rsa_with_aes128_cbc_sha_ciphers_enabled: false,
        tls_ecdhe_rsa_with_aes256_cbc_sha_ciphers_enabled: false,
        tls_rsa_with_aes128_cbc_sha256_ciphers_enabled: false,
        tls_rsa_with_aes128_cbc_sha_ciphers_enabled: false,
        tls_rsa_with_aes128_gcm_sha256_ciphers_enabled: false,
        tls_rsa_with_aes256_cbc_sha256_ciphers_enabled: false,
        tls_rsa_with_aes256_cbc_sha_ciphers_enabled: false,
        triple_des_ciphers_enabled: false
      },
      sign_in: {
        enabled: true
      },
      sign_up: {
        enabled: true,
        terms_of_service: {
          consent_required: true,
          enabled: true,
          text: 'Terms of Service'
        }
      },
      identity: {
        type: 'SystemAssigned, UserAssigned',
        identity_ids: ['${azurerm_user_assigned_identity.apim.id}']
      },
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 