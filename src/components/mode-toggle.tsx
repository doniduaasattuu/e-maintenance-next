"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "./ui/dropdown-menu";
import { Check } from "lucide-react";
import { Switch } from "./ui/switch";
import { useEffect, useState } from "react";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </Button>
  );
}

export function ModeDropdown() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <div className="flex justify-between items-center w-full">
                <span>Dark</span>
                {theme === "dark" ? <Check /> : undefined}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <div className="flex justify-between items-center w-full">
                <span>Light</span>
                {theme === "light" ? <Check /> : undefined}
              </div>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  );
}

export function ModeSwitch() {
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  // Sync state when theme changes
  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  return (
    <Switch
      id="darkmode"
      checked={isDark}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
    />
  );
}
