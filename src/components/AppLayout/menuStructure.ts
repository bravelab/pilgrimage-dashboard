import { commonMessages, sectionNames } from "@saleor/intl";
import { IntlShape } from "react-intl";
import catalogIcon from "@assets/images/menu-catalog-icon.svg";
import customerIcon from "@assets/images/menu-customers-icon.svg";
import discountsIcon from "@assets/images/menu-discounts-icon.svg";
import homeIcon from "@assets/images/menu-home-icon.svg";
import ordersIcon from "@assets/images/menu-orders-icon.svg";
import translationIcon from "@assets/images/menu-translation-icon.svg";
import useUser from "@saleor/hooks/useUser";
import { User_permissionGroups } from "@saleor/auth/types/User";
import { categoryListUrl } from "../../categories/urls";
import { collectionListUrl } from "../../collections/urls";
import { customerListUrl } from "../../customers/urls";
import { orderDraftListUrl, orderListUrl } from "../../orders/urls";
import { productListUrl } from "../../products/urls";
import { saleListUrl, voucherListUrl } from "../../discounts/urls";
import { languageListUrl } from "../../translations/urls";
import { PermissionEnum, PermissionGroupEnum } from "../../types/globalTypes";

export interface IMenuItem {
  ariaLabel: string;
  children?: IMenuItem[];
  icon?: any;
  label: string;
  permission?: PermissionEnum;
  url?: string;
}

function getPermission(
  permission: PermissionEnum,
  permissionGroups: User_permissionGroups[]
): PermissionEnum {
  return permissionGroups
    .map(perm => perm.name)
    .includes(PermissionGroupEnum.VOLUNTEER)
    ? PermissionEnum.MANAGE_NONE
    : permission;
}

function createMenuStructure(intl: IntlShape): IMenuItem[] {
  const { user } = useUser();
  return [
    {
      ariaLabel: "home",
      icon: homeIcon,
      label: intl.formatMessage(sectionNames.home),
      url: "/"
    },
    {
      ariaLabel: "catalogue",
      children: [
        {
          ariaLabel: "products",
          label: intl.formatMessage(sectionNames.products),
          url: productListUrl()
        },
        {
          ariaLabel: "categories",
          label: intl.formatMessage(sectionNames.categories),
          url: categoryListUrl()
        },
        {
          ariaLabel: "collections",
          label: intl.formatMessage(sectionNames.collections),
          url: collectionListUrl()
        }
      ],
      icon: catalogIcon,
      label: intl.formatMessage(commonMessages.catalog),
      permission: getPermission(
        PermissionEnum.MANAGE_PRODUCTS,
        user.permissionGroups
      )
    },
    {
      ariaLabel: "orders",
      children: [
        {
          ariaLabel: "orders",
          label: intl.formatMessage(sectionNames.orders),
          permission: PermissionEnum.MANAGE_ORDERS,
          url: orderListUrl()
        },
        {
          ariaLabel: "order drafts",
          label: intl.formatMessage(commonMessages.drafts),
          permission: getPermission(
            PermissionEnum.MANAGE_ORDERS,
            user.permissionGroups
          ),
          url: orderDraftListUrl()
        }
      ],
      icon: ordersIcon,
      label: intl.formatMessage(sectionNames.orders),
      permission: PermissionEnum.MANAGE_ORDERS
    },
    {
      ariaLabel: "customers",
      icon: customerIcon,
      label: intl.formatMessage(sectionNames.customers),
      permission: getPermission(
        PermissionEnum.MANAGE_USERS,
        user.permissionGroups
      ),
      url: customerListUrl()
    },
    {
      ariaLabel: "discounts",
      children: [
        {
          ariaLabel: "sales",
          label: intl.formatMessage(sectionNames.sales),
          url: saleListUrl()
        },
        {
          ariaLabel: "vouchers",
          label: intl.formatMessage(sectionNames.vouchers),
          url: voucherListUrl()
        }
      ],
      icon: discountsIcon,
      label: intl.formatMessage(commonMessages.discounts),
      permission: getPermission(
        PermissionEnum.MANAGE_DISCOUNTS,
        user.permissionGroups
      )
    },
    {
      ariaLabel: "translations",
      icon: translationIcon,
      label: intl.formatMessage(sectionNames.translations),
      permission: getPermission(
        PermissionEnum.MANAGE_TRANSLATIONS,
        user.permissionGroups
      ),
      url: languageListUrl
    }
  ];
}

export default createMenuStructure;
