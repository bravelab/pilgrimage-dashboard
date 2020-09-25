import React from "react";
import { Route, RouteProps } from "react-router-dom";

import useUser from "@saleor/hooks/useUser";
import NotFound from "../../NotFound";
import { PermissionEnum, PermissionGroupEnum } from "../../types/globalTypes";
import { hasPermission, hasPermissionGroup } from "../misc";

interface SectionRouteProps extends RouteProps {
  permissions?: PermissionEnum[];
  permissionsGroups?: PermissionGroupEnum[];
}

export const SectionRoute: React.FC<SectionRouteProps> = ({
  permissions,
  permissionsGroups,
  ...props
}) => {
  const { user } = useUser();

  const hasPermissions =
    !permissions ||
    permissions
      .map(permission => hasPermission(permission, user))
      .reduce((prev, curr) => prev && curr);
  const hasPermissionGroups =
    !permissionsGroups ||
    permissionsGroups
      .map(group => hasPermissionGroup(group, user))
      .reduce((prev, curr) => prev || curr);
  return hasPermissions && hasPermissionGroups ? (
    <Route {...props} />
  ) : (
    <NotFound />
  );
};
SectionRoute.displayName = "Route";
export default SectionRoute;
