import { GraduationCapIcon } from "lucide-react"

import { SignupForm } from "./components/ui/Signup-form"

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 relative z-10">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <GraduationCapIcon className="size-4" />
          </div>
          Intelliquest.
        </a>
        <SignupForm />
      </div>
    </div>
  )
}
