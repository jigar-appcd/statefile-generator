import { Region } from '@/types/cloud'
import { ResourceAttributes, ResourceHandler, commonTags } from '../base-handler'

export class CodePipelineHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName.toLowerCase(),
      role_arn: '${aws_iam_role.codepipeline.arn}',
      artifact_store: [
        {
          location: '${aws_s3_bucket.artifacts.bucket}',
          type: 'S3',
          encryption_key: {
            id: '${aws_kms_key.artifacts.arn}',
            type: 'KMS'
          }
        }
      ],
      stage: [
        {
          name: 'Source',
          action: [
            {
              name: 'Source',
              category: 'Source',
              owner: 'AWS',
              provider: 'CodeCommit',
              version: '1',
              configuration: {
                RepositoryName: '${aws_codecommit_repository.app.repository_name}',
                BranchName: 'main'
              },
              output_artifacts: ['source_output'],
              namespace: 'SourceVariables'
            }
          ]
        },
        {
          name: 'Build',
          action: [
            {
              name: 'Build',
              category: 'Build',
              owner: 'AWS',
              provider: 'CodeBuild',
              version: '1',
              configuration: {
                ProjectName: '${aws_codebuild_project.app.name}'
              },
              input_artifacts: ['source_output'],
              output_artifacts: ['build_output'],
              namespace: 'BuildVariables'
            }
          ]
        },
        {
          name: 'Deploy',
          action: [
            {
              name: 'Deploy',
              category: 'Deploy',
              owner: 'AWS',
              provider: 'CodeDeploy',
              version: '1',
              configuration: {
                ApplicationName: '${aws_codedeploy_app.app.name}',
                DeploymentGroupName: '${aws_codedeploy_deployment_group.app.deployment_group_name}'
              },
              input_artifacts: ['build_output'],
              namespace: 'DeployVariables'
            }
          ]
        }
      ],
      tags: {
        Name: resourceName,
        ...commonTags
      },
      tags_all: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 