import { LaptopMinimal, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/Sidebar/theme-provider"
import { useEffect, useState } from "react"


export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [position, setPosition] = useState(theme)

  useEffect(() => {
    setPosition(theme)
  }, [theme])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="focus:ring-0 focus-visible:ring-0">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Toggle theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={(value) => setPosition(value as "dark" | "light" | "system")}>
          <DropdownMenuRadioItem className="justify-between" value="light" onClick={() => setTheme("light")}>
              Light <Sun />
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="justify-between" value="dark" onClick={() => setTheme("dark")}>
            Dark <Moon />
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="justify-between" value="system" onClick={() => setTheme("system")}>
            System <LaptopMinimal />
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
