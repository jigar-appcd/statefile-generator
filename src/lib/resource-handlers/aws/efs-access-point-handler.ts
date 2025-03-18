import { Region } from '@/types/cloud'
import {
    ResourceAttributes,
    ResourceHandler,
    commonTags,
    generateEcsServiceId
} from '../base-handler'

export class AWSEFSAccessPointHandler implements ResourceHandler {
  getAttributes(resourceName: string, region: Region): ResourceAttributes {
    const fsId = generateEcsServiceId()
    
    const attributes: ResourceAttributes = {
      file_system_id: fsId,
      posix_user: {
        uid: 1000,
        gid: 1000,
        secondary_gids: [1001, 1002]
      },
      root_directory: {
        path: '/data',
        creation_info: {
          owner_uid: 1000,
          owner_gid: 1000,
          permissions: '0755'
        }
      },
      tags: {
        Name: resourceName,
        ...commonTags
      },
      depends_on: [
        `aws_efs_file_system.${fsId}`
      ]
    }

    return attributes
  }
} 