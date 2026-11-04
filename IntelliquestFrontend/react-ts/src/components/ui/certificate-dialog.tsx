"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

// Root dialog components
const CertificateDialog = DialogPrimitive.Root
const CertificateDialogTrigger = DialogPrimitive.Trigger
const CertificateDialogPortal = DialogPrimitive.Portal
const CertificateDialogClose = DialogPrimitive.Close

// CertificateDialogOverlay: must be defined before usage
const CertificateDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
CertificateDialogOverlay.displayName = DialogPrimitive.Overlay.displayName

// CertificateDialogContent: now uses Overlay correctly
const CertificateDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    courseTitle?: string
    userName?: string
  }
>(({ className, children, courseTitle, userName, ...props }, ref) => (
  <CertificateDialogPortal>
    <CertificateDialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children ?? (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Congratulations, {userName || "Student"}!</h1>
          <p className="text-sm">
            You’ve completed <strong>{courseTitle || "this course"}</strong>.
          </p>
        </div>
      )}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </CertificateDialogPortal>
))
CertificateDialogContent.displayName = DialogPrimitive.Content.displayName

// Optional structured subcomponents
const CertificateDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)
CertificateDialogHeader.displayName = "CertificateDialogHeader"

const CertificateDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)
CertificateDialogFooter.displayName = "CertificateDialogFooter"

const CertificateDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CertificateDialogTitle.displayName = DialogPrimitive.Title.displayName

const CertificateDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CertificateDialogDescription.displayName = DialogPrimitive.Description.displayName

// Export all components
export {
  CertificateDialog,
  CertificateDialogTrigger,
  CertificateDialogPortal,
  CertificateDialogOverlay,
  CertificateDialogClose,
  CertificateDialogContent,
  CertificateDialogHeader,
  CertificateDialogFooter,
  CertificateDialogTitle,
  CertificateDialogDescription,
}
