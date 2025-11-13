import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AssignPermissionToRoleDTO {
  @ApiProperty({
    description: 'ID da permissão a ser atribuída',
    example: 'uuid-permission-id',
  })
  @IsNotEmpty()
  permissionId: string;
}
