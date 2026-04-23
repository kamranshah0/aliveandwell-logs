import { Link, useLocation } from "react-router-dom";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import {
  UsersRound,
  FileText,
  Settings,
  ShieldUser,
  HandHeart,
  Tags,
  Tablets,
  ClipboardList,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider/theme-provider";
import { RiCapsuleLine } from "react-icons/ri";
import { LuBuilding2 } from "react-icons/lu";
import { GiMedicines } from "react-icons/gi";
import { PermissionGate } from "@/auth/PermissionGate";
import { usePermissions } from "@/auth/usePermissions";
import { NAV_ITEMS, type NavItem } from "@/constants/navigation";
import { useState, useEffect, type ReactNode } from "react";

const ICON_MAP: Record<string, ReactNode> = {
  "/": <HiOutlineSquares2X2 className="size-5" />,
  "/patients": <UsersRound className="size-5" />,
  "/programs-dashboard": <HandHeart className="size-5" />,
  "/medicines": <GiMedicines className="size-5" />,
  "/medications": <RiCapsuleLine className="size-5" />,
  "/pharmacies": <LuBuilding2 className="size-5" />,
  "/drug-categories": <Tags className="size-5" />,
  "/dosage-forms": <Tablets className="size-5" />,
  "/medication-dosages": <ClipboardList className="size-5" />,
  "/reports": <FileText className="size-5" />,
  "/team-users": <UsersRound className="size-5" />,
  "/roles": <ShieldUser className="size-5" />,
  "/settings": <Settings className="size-5" />,
  "/daily-log": <FileText className="size-5" />,
  "/log-reports": <FileText className="size-5" />,
};

const mapNavItems = (items: NavItem[]): any[] => {
  return items.map((item) => ({
    ...item,
    icon: ICON_MAP[item.path],
    children: item.children ? mapNavItems(item.children) : undefined,
  }));
};

const navItems = mapNavItems(NAV_ITEMS);

type SidebarProps = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
};

const Sidebar = ({ collapsed }: SidebarProps) => {
  const pathname = useLocation().pathname;
  const { theme } = useTheme();
  const { can } = usePermissions();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Auto-expand parent if child is active
    navItems.forEach((item) => {
      if (item.children?.some((child: any) => pathname === child.path)) {
        setExpandedItems((prev) => ({ ...prev, [item.path]: true }));
      }
    });
  }, [pathname]);

  const hasPermission = (item: any): boolean => {
    if (!item.permission || can(item.permission)) return true;
    if (item.children && item.children.length > 0) {
      return item.children.some((child: any) => hasPermission(child));
    }
    return false;
  };

  const toggleExpand = (path: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const isItemActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  const getLinkClasses = (path: string, isSubItem = false) =>
    `${
      pathname === path
        ? "bg-secondary text-white"
        : "hover:bg-secondary/20 text-white/90 text-summary-nav hover:text-white"
    } flex items-center gap-3 font-medium text-sm p-3 rounded-xl transition-all ${
      isSubItem ? "pl-11" : ""
    }`;

  const renderNavItem = (item: any) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.path];
    const active = isItemActive(item.path);

    if (hasChildren) {
      return (
        <li key={item.path} className="flex flex-col gap-0.5">
          <button
            onClick={() => toggleExpand(item.path)}
            className={`${
              active
                ? "bg-secondary/10 text-white font-semibold"
                : "text-white/90 hover:bg-secondary/20 hover:text-white"
            } flex items-center justify-between w-full gap-3 text-sm p-3 rounded-xl transition-all cursor-pointer`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </div>
            {!collapsed && (
              isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />
            )}
          </button>
          {isExpanded && !collapsed && (
            <ul className="flex flex-col gap-0.5 mt-0.5">
              {item.children.map((child: any) => (
                <PermissionGate key={child.path} permission={child.permission}>
                  <li>
                    <Link to={child.path} className={getLinkClasses(child.path, true)}>
                      {child.icon}
                      {!collapsed && <span>{child.name}</span>}
                    </Link>
                  </li>
                </PermissionGate>
              ))}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li key={item.path}>
        <Link to={item.path} className={getLinkClasses(item.path)}>
          {item.icon}
          {!collapsed && <span>{item.name}</span>}
        </Link>
      </li>
    );
  };

  return (
    <div
      className={`fixed left-0 top-0 z-50 h-screen border-r-1 border-r-outline-low-em transition-all duration-300 bg-primary
      ${collapsed ? "w-[72px]" : "w-[200px]"}`}
    >
      {/* Logo */}
      <div className="p-4 flex items-center border-b-1 border-outline-primary h-[72px]">
        <img
          src={theme === "dark" ? "/images/logo-dark.png" : "/images/logo.png"}
          alt="logo"
          className={`object-contain transition-all duration-300 
          ${collapsed ? "w-[40px]" : "w-[155px]"}`}
        />
      </div>

      {/* Navigation */}
      <div className=" overflow-y-auto h-[calc(100vh-72px)] scrollbar-hidden">
        <ul className="flex flex-col gap-0.5 p-4">
          {navItems.map((item) => (
            hasPermission(item) && <div key={item.path}>{renderNavItem(item)}</div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
