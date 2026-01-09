import {
  IsArray,
  IsEmail,
  IsEnum,
  IsIn,
  IsUUID,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import type { ResourceType } from '../types/resource-type';
import type { RoleType } from '../types/role-type';

class PermissionUserDto {
  @IsEmail()
  email: string;

  @IsIn(['viewer', 'editor'])
  role: RoleType;
}

export class CreatePermissionsDto {
  @IsUUID()
  resourceId: string;

  @IsIn(['file', 'folder'])
  resourceType: ResourceType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionUserDto)
  users: PermissionUserDto[];
}