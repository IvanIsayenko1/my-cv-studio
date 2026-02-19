import Link from "next/link";

import { Menu, MoreHorizontalIcon } from "lucide-react";

import { ROUTES } from "@/config/routes";

import LoginSignupButton from "../auth/login-signup-button";
import { ThemeSwitcher } from "../layout/theme-switcher";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function HeaderMobile() {
  return (
    <div className="flex items-center space-x-1 gap-3 sm:hidden">
      <ThemeSwitcher />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" aria-label="Open menu">
            <Menu />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 py-2 space-y-1">
          <DropdownMenuGroup>
            <DropdownMenuItem className="flex items-center gap-3 py-3 text-base active:bg-accent">
              <span>Maker</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 py-3 text-base active:bg-accent">
              <span>Checker</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LoginSignupButton />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
