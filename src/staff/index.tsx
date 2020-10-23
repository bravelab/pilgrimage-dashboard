import { hasPermissionGroup } from "@saleor/auth/misc";
import NotFoundPage from "@saleor/components/NotFoundPage";
import useNavigator from "@saleor/hooks/useNavigator";
import useUser from "@saleor/hooks/useUser";
import { PermissionGroupEnum } from "@saleor/types/globalTypes";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { sectionNames } from "@saleor/intl";
import { asSortParams } from "@saleor/utils/sort";
import { WindowTitle } from "../components/WindowTitle";
import {
  staffListPath,
  StaffListUrlQueryParams,
  staffMemberDetailsPath,
  StaffMemberDetailsUrlQueryParams,
  StaffListUrlSortField
} from "./urls";
import StaffDetailsComponent from "./views/StaffDetails";
import StaffListComponent from "./views/StaffList";

const StaffList: React.FC<RouteComponentProps<{}>> = ({ location }) => {
  const qs = parseQs(location.search.substr(1));
  const params: StaffListUrlQueryParams = asSortParams(
    qs,
    StaffListUrlSortField
  );

  return <StaffListComponent params={params} />;
};

interface StaffDetailsRouteProps {
  id: string;
}

const StaffDetails: React.FC<RouteComponentProps<StaffDetailsRouteProps>> = ({
  match
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: StaffMemberDetailsUrlQueryParams = qs;
  const navigate = useNavigator();

  const { user } = useUser();
  const isNotVolunteer = !hasPermissionGroup(
    PermissionGroupEnum.VOLUNTEER,
    user
  );

  return isNotVolunteer || user.id === decodeURIComponent(match.params.id) ? (
    <StaffDetailsComponent
      id={decodeURIComponent(match.params.id)}
      params={params}
    />
  ) : (
    <NotFoundPage onBack={() => navigate("/")} />
  );
};

const Component = () => {
  const intl = useIntl();

  const { user } = useUser();
  const isNotVolunteer = !hasPermissionGroup(
    PermissionGroupEnum.VOLUNTEER,
    user
  );

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.staff)} />
      <Switch>
        <Route
          exact
          path={staffListPath}
          component={isNotVolunteer ? StaffList : NotFoundPage}
        />
        <Route path={staffMemberDetailsPath(":id")} component={StaffDetails} />
      </Switch>
    </>
  );
};

export default Component;
