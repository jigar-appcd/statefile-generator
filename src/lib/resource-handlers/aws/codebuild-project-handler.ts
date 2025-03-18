import { ResourceAttributes, ResourceHandler, commonTags, generateResourceId } from '../base-handler'

export class CodeBuildProjectHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: `${resourceName}-${generateResourceId()}`,
      description: `CodeBuild project for ${resourceName}`,
      build_timeout: '60',
      service_role: '${aws_iam_role.codebuild.arn}',
      artifacts: {
        type: 'S3',
        location: '${aws_s3_bucket.artifacts.id}',
        name: resourceName,
        packaging: 'ZIP',
        namespace_type: 'BUILD_ID',
        encryption_disabled: false
      },
      cache: {
        type: 'S3',
        location: '${aws_s3_bucket.cache.id}/codebuild'
      },
      environment: {
        compute_type: 'BUILD_GENERAL1_SMALL',
        image: 'aws/codebuild/amazonlinux2-x86_64-standard:3.0',
        type: 'LINUX_CONTAINER',
        image_pull_credentials_type: 'CODEBUILD',
        privileged_mode: true,
        environment_variables: [
          {
            name: 'ENVIRONMENT',
            value: 'production',
            type: 'PLAINTEXT'
          }
        ]
      },
      logs_config: {
        cloudwatch_logs: {
          status: 'ENABLED',
          group_name: '/aws/codebuild/${resourceName}',
          stream_name: 'build-log'
        },
        s3_logs: {
          status: 'ENABLED',
          location: '${aws_s3_bucket.logs.id}/codebuild/${resourceName}'
        }
      },
      source: {
        type: 'CODECOMMIT',
        location: '${aws_codecommit_repository.source.clone_url_http}',
        git_clone_depth: 1,
        git_submodules_config: {
          fetch_submodules: true
        },
        buildspec: 'buildspec.yml',
        report_build_status: true
      },
      vpc_config: {
        vpc_id: '${aws_vpc.main.id}',
        subnets: ['${aws_subnet.private_1.id}', '${aws_subnet.private_2.id}'],
        security_group_ids: ['${aws_security_group.codebuild.id}']
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
        'aws_iam_role.codebuild',
        'aws_s3_bucket.artifacts',
        'aws_s3_bucket.cache',
        'aws_s3_bucket.logs',
        'aws_codecommit_repository.source',
        'aws_vpc.main',
        'aws_subnet.private_1',
        'aws_subnet.private_2',
        'aws_security_group.codebuild'
      ]
    }

    return attributes
  }
} 