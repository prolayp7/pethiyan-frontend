"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// modal={false} prevents DismissableLayer from setting body.style.pointerEvents="none"
// when forceMount keeps DialogContent permanently in the DOM while closed.
// Without this, a forceMount+modal sheet would block all page interactions.
const Sheet = (
  props: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>
) => <DialogPrimitive.Root modal={false} {...props} />;
Sheet.displayName = "Sheet";

const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
// Kept for API compatibility only — SheetContent manages its own portal.
const SheetPortal = DialogPrimitive.Portal;

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: "top" | "bottom" | "left" | "right";
  hideOverlay?: boolean;
  overlayClassName?: string;
  /** Mirror of the Sheet's open prop — drives CSS transitions and scroll lock. */
  open?: boolean;
  /** Called when the overlay is clicked to close the sheet. */
  onClose?: () => void;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(
  (
    {
      side = "right",
      className,
      children,
      hideOverlay,
      overlayClassName,
      open = false,
      onClose,
      ...props
    },
    ref
  ) => {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
      setMounted(true);
    }, []);

    // Prevent body scroll while the sheet is open.
    React.useEffect(() => {
      if (!mounted) return;
      if (open) {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.overflow = prev;
        };
      }
    }, [open, mounted]);

    if (!mounted) return null;

    const translateClass = {
      right: open ? "translate-x-0" : "translate-x-full",
      left: open ? "translate-x-0" : "-translate-x-full",
      top: open ? "translate-y-0" : "-translate-y-full",
      bottom: open ? "translate-y-0" : "translate-y-full",
    }[side];

    return createPortal(
      <>
        {/* Plain div overlay — no Radix Presence, no removeChild lifecycle */}
        {!hideOverlay && (
          <div
            className={cn(
              "fixed inset-0 z-50 transition-opacity duration-300",
              open
                ? "bg-black/40 opacity-100"
                : "pointer-events-none opacity-0",
              overlayClassName
            )}
            onClick={onClose}
            aria-hidden="true"
          />
        )}

        {/*
         * forceMount keeps this element permanently in the DOM — Presence never
         * calls removeChild, which eliminates the React 19 concurrent-mode race
         * where n.stateNode.parentNode becomes null during navigation.
         *
         * CSS transitions handle the visual open/close instead of CSS animations,
         * so there is no animationend event for Presence to wait on.
         *
         * inert hides the closed panel from keyboard and assistive tech without
         * removing it from the DOM.
         */}
        <DialogPrimitive.Content
          ref={ref}
          forceMount
          // @ts-expect-error — inert is a valid HTML attribute in modern browsers
          inert={open ? undefined : ""}
          aria-modal="true"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className={cn(
            "fixed z-50 flex flex-col bg-white shadow-xl",
            "transition-transform duration-300 ease-in-out",
            !open && "pointer-events-none",
            side === "right" && "inset-y-0 right-0 h-full w-full max-w-sm",
            side === "left" && "inset-y-0 left-0 h-full w-full max-w-sm",
            side === "top" && "inset-x-0 top-0",
            side === "bottom" && "inset-x-0 bottom-0",
            translateClass,
            className
          )}
          {...props}
        >
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-1 opacity-70 ring-offset-white transition-all hover:bg-gray-100 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-(--color-primary)">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
          {children}
        </DialogPrimitive.Content>
      </>,
      document.body
    );
  }
);
SheetContent.displayName = DialogPrimitive.Content.displayName;

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-2 text-left", className)}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-gray-900", className)}
    {...props}
  />
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
