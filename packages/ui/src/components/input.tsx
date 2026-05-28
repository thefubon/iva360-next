"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "#lib/utils"

const inputBase =
  "file:text-foreground placeholder:text-text-placeholder text-foreground focus:text-foreground active:text-foreground selection:bg-primary selection:text-white dark:bg-input/30 w-full min-w-0 rounded-md border bg-background px-3 py-1 text-base outline-none transition-colors duration-200 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted aria-invalid:border-destructive aria-invalid:text-destructive aria-invalid:placeholder:text-destructive/70 data-[state=error]:border-destructive data-[state=error]:text-destructive data-[state=error]:placeholder:text-destructive/70 data-[state=warning]:border-warning data-[state=warning]:text-warning data-[state=warning]:placeholder:text-warning/70 data-[state=success]:border-primary data-[state=success]:text-primary data-[state=success]:placeholder:text-primary/70"

const inputVariants = cva(inputBase, {
  variants: {
    variant: {
      default: "border-input hover:border-secondary focus:border-primary active:border-input",
      primary: "border-input hover:border-primary focus:border-primary active:border-primary",
      secondary:
        "border-border bg-muted placeholder:text-secondary hover:bg-background hover:border-primary focus:bg-background focus:border-primary active:bg-background active:border-primary aria-invalid:bg-background data-[state=error]:bg-background data-[state=warning]:bg-background data-[state=success]:bg-background",
    },
    size: {
      sm: "h-8 px-2.5 text-sm",
      default: "h-9 text-base",
      lg: "h-10 px-4 text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

type InputVariants = VariantProps<typeof inputVariants>

interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  variant?: InputVariants["variant"]
  size?: InputVariants["size"]
  state?: "default" | "error" | "warning" | "success"
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  iconRightInteractive?: boolean
  iconRightAriaLabel?: string
  onIconRightClick?: () => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      state,
      iconLeft,
      iconRight,
      iconRightInteractive,
      iconRightAriaLabel,
      onIconRightClick,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isInvalid = props["aria-invalid"] === true || props["aria-invalid"] === "true"
    const visualState = isInvalid ? "error" : (state ?? "default")

    const iconToneClass = (() => {
      if (visualState === "error") return "text-destructive"
      if (visualState === "warning") return "text-warning"
      if (visualState === "success") return "text-primary"
      return variant === "secondary" ? "text-secondary" : "text-text-placeholder"
    })()

    return (
      <div className="group relative w-full min-w-0">
        {iconLeft ? (
          <span
            className={cn(
              "pointer-events-none absolute top-1/2 left-3 -translate-y-1/2",
              iconToneClass,
              "group-focus-within:text-foreground group-active:text-foreground",
              isInvalid && "text-destructive",
              disabled && "opacity-50",
            )}
            aria-hidden="true"
          >
            {iconLeft}
          </span>
        ) : null}

        <input
          ref={ref}
          data-slot="input"
          data-variant={variant}
          data-size={size}
          data-state={visualState !== "default" ? visualState : undefined}
          disabled={disabled}
          className={cn(
            inputVariants({ variant, size }),
            iconLeft && "pl-9",
            iconRight && "pr-9",
            className,
          )}
          {...props}
        />

        {iconRight && iconRightInteractive ? (
          <button
            type="button"
            className={cn(
              "absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer",
              iconToneClass,
              "group-focus-within:text-foreground group-active:text-foreground",
              isInvalid && "text-destructive",
              disabled && "opacity-50",
            )}
            aria-label={iconRightAriaLabel ?? "Toggle"}
            disabled={disabled}
            tabIndex={-1}
            onClick={onIconRightClick}
          >
            {iconRight}
          </button>
        ) : iconRight ? (
          <span
            className={cn(
              "pointer-events-none absolute top-1/2 right-3 -translate-y-1/2",
              iconToneClass,
              "group-focus-within:text-foreground group-active:text-foreground",
              isInvalid && "text-destructive",
              disabled && "opacity-50",
            )}
            aria-hidden="true"
          >
            {iconRight}
          </span>
        ) : null}
      </div>
    )
  },
)

Input.displayName = "Input"

export { Input, inputVariants }
export type { InputVariants, InputProps }
