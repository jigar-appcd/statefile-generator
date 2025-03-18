import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class TransferServerHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      identity_provider_type: 'AWS_DIRECTORY_SERVICE',
      directory_id: '${aws_directory_service_directory.main.id}',
      endpoint_type: 'VPC',
      protocols: ['SFTP', 'FTPS', 'FTP'],
      security_policy_name: 'TransferSecurityPolicy-2020-06',
      logging_role: '${aws_iam_role.transfer_logging.arn}',
      force_destroy: false,
      structured_log_destinations: [
        '${aws_cloudwatch_log_group.transfer.arn}'
      ],
      certificate: '${aws_acm_certificate.transfer.arn}',
      domain: 'S3',
      endpoint_details: {
        vpc_id: '${aws_vpc.main.id}',
        subnet_ids: ['${aws_subnet.private_1.id}', '${aws_subnet.private_2.id}'],
        security_group_ids: ['${aws_security_group.transfer.id}'],
        vpc_endpoint_id: '${aws_vpc_endpoint.transfer.id}'
      },
      host_key: '${file("ssh/transfer_key.pem")}',
      pre_authentication_login_banner: 'Welcome to our SFTP server. Unauthorized access is prohibited.',
      post_authentication_login_banner: 'Successfully authenticated. Please respect our usage policies.',
      protocol_details: {
        passive_ip: '0.0.0.0/0',
        set_stat_option: true,
        tls_session_resumption_mode: 'ENFORCED',
        as2_transports: ['HTTP']
      },
      workflow_details: {
        on_upload: [
          {
            execution_role: '${aws_iam_role.transfer_workflow.arn}',
            workflow_id: '${aws_transfer_workflow.main.id}'
          }
        ]
      },
      tags: {
        Name: resourceName,
        ...commonTags
      },
      tags_all: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        'aws_directory_service_directory.main',
        'aws_iam_role.transfer_logging',
        'aws_cloudwatch_log_group.transfer',
        'aws_acm_certificate.transfer',
        'aws_vpc.main',
        'aws_subnet.private_1',
        'aws_subnet.private_2',
        'aws_security_group.transfer',
        'aws_vpc_endpoint.transfer',
        'aws_iam_role.transfer_workflow',
        'aws_transfer_workflow.main'
      ]
    }

    return attributes
  }
} 