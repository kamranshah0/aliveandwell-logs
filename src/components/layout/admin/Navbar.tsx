import { Button } from "@/components/ui/button";
import {
  Sun,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Bell,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  
} from "@/components/ui/dropdown-menu";
 
import proifleImage from "@/assets/images/profile.png";
// import { useTheme } from "@/components/theme-provider/theme-provider";
// import FormInput from "@/components/molecules/FormInput";
import { Link } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { useNotificationStore } from "@/stores/notification.store";


type NavbarProps = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
};

const Navbar = ({ collapsed, setCollapsed }: NavbarProps) => {
  // const { theme, setTheme } = useTheme();
  const {logout} = useAuth();

  
 const hasUnread = useNotificationStore((s) => s.hasUnread);

  const handleLogout = async () => {
  await logout();
};

  return (
    <div
      className={`fixed top-0 z-40 bg-side-panel transition-all duration-300 
      ${collapsed ? "w-[calc(100%-72px)] ps-[20px]" : "w-[calc(100%-200px)]  "}
      py-3 px-6 text-text-high-em text-lg font-semibold flex items-center justify-between h-[72px] border-b-1 border-b-outline-high-em`}
    >
      <div className="flex items-center gap-3">
        {/* Sidebar toggle button */}
        <Button
          size="icon"
          variant="outline"
          onClick={() => setCollapsed(!collapsed)}
          className="border border-outline-base-em"
        >
          {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
        </Button>
      </div>

      {/* <div>
        <FormInput
          placeholder="Search customer by name, company"
          leftIcon={<Search className="size-4 text-text-low-em" />}
          className="md:w-[430px] w-[380px]"
        />
      </div> */}

      <div className="flex items-center gap-3">
        {/* Dark Mode  */}
        {/* <Button
          size="custom"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="bg-side-panel text-text-high-em border border-outline-base-em hover:bg-primary hover:text-white py-2.5 px-3 rounded-xl size-11"
        >
          <Sun />
        </Button> */}

         {/* 🔔 NOTIFICATION ICON */}
        <Link to="/notifications">
          <div className="relative">
            {hasUnread && (
              <span className="absolute -top-1 -right-1 size-2.5 bg-yellow rounded-full" />
            )}
            <Bell className="size-5 text-text-med-em hover:text-primary" />
          </div>
        </Link>

        {/* profile menu  */}
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="px-4 py-1.5 rounded-xl border border-outline-base-em bg-side-panel cursor-pointer"
          >
            <div className="flex gap-3 items-center">
              <img src={proifleImage} alt="" className="size-7 rounded-full" />
              <ChevronDown className="size-4 text-text-high-em" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Billing
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Keyboard shortcuts
                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
            {/* <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Email</DropdownMenuItem>
                    <DropdownMenuItem>Message</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>More...</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem>
                New Team
                <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>GitHub</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuItem disabled>API</DropdownMenuItem>
            <DropdownMenuSeparator /> */}
            <Link to="/profile">
              <DropdownMenuItem className="cursor-pointer">
                Profile
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;


