import { User } from "@saleor/auth/types/User";
import { PermissionEnum, PermissionGroupEnum } from "../types/globalTypes";

export const hasPermission = (permission: PermissionEnum, user: User) =>
  user.userPermissions.map(perm => perm.code).includes(permission);

export const hasPermissionGroup = (
  permissionGroup: PermissionGroupEnum,
  user: User
) => user.permissionGroups.map(group => group.name).includes(permissionGroup);
