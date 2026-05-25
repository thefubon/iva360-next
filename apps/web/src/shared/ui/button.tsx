'use client'

import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/shared/lib/utils'

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3",
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'border border-transparent bg-muted text-foreground hover:bg-muted/75',
        outline:
          'border border-border bg-transparent text-foreground hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
        ghost:
          'border border-transparent bg-transparent text-foreground hover:bg-muted dark:hover:bg-muted/50',
        disabled: 'border border-transparent bg-muted text-muted-foreground opacity-50',
        green:
          'border border-primary bg-background text-primary hover:bg-brand-50 dark:hover:bg-brand-950',
        white: 'border border-border bg-background text-foreground hover:bg-muted',
        blue: 'border-transparent bg-additional-primary text-white hover:bg-additional-primary/90',
        indigo:
          'border-transparent bg-additional-secondary text-white hover:bg-additional-secondary/90',
        destructive: 'border-transparent bg-error text-white hover:bg-error/90',
        link: 'border-transparent bg-transparent text-primary no-underline underline-offset-4 hover:text-primary/90 hover:underline',
        'meetings-primary':
          'border-transparent bg-meetings-primary text-white hover:bg-meetings-primary/90',
        'meetings-secondary':
          'border-transparent bg-meetings-secondary text-meetings-primary hover:bg-meetings-primary/90 hover:text-white',
        'messenger-primary':
          'border-transparent bg-messenger-primary text-white hover:bg-messenger-primary/90',
        'messenger-secondary':
          'border-transparent bg-messenger-secondary text-messenger-primary hover:bg-messenger-primary/90 hover:text-white',
        'webinars-primary':
          'border-transparent bg-webinars-primary text-white hover:bg-webinars-primary/90',
        'webinars-secondary':
          'border-transparent bg-webinars-secondary text-webinars-primary hover:bg-webinars-primary/90 hover:text-white',
        'mail-primary': 'border-transparent bg-mail-primary text-white hover:bg-mail-primary/90',
        'mail-secondary':
          'border-transparent bg-mail-secondary text-mail-primary hover:bg-mail-primary/90 hover:text-white',
        'drive-primary': 'border-transparent bg-drive-primary text-white hover:bg-drive-primary/90',
        'drive-secondary':
          'border-transparent bg-drive-secondary text-drive-primary hover:bg-drive-primary/90 hover:text-white',
        'board-primary': 'border-transparent bg-board-primary text-white hover:bg-board-primary/90',
        'board-secondary':
          'border-transparent bg-board-secondary text-board-primary hover:bg-board-primary/90 hover:text-white',
        'broadcasts-primary':
          'border-transparent bg-broadcasts-primary text-white hover:bg-broadcasts-primary/90',
        'broadcasts-secondary':
          'border-transparent bg-broadcasts-secondary text-broadcasts-primary hover:bg-broadcasts-primary/90 hover:text-white',
        'ai-primary': 'border-transparent bg-ai-primary text-white hover:bg-ai-primary/90',
        'ai-secondary':
          'border-transparent bg-ai-secondary text-ai-primary hover:bg-ai-primary/90 hover:text-white',
        'rooms-primary': 'border-transparent bg-rooms-primary text-white hover:bg-rooms-primary/90',
        'rooms-secondary':
          'border-transparent bg-rooms-secondary text-rooms-primary hover:bg-rooms-primary/90 hover:text-white',
      },
      size: {
        xs: 'h-7 gap-1.5 rounded-sm px-2 text-xs has-[>svg]:px-2',
        sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
        default: 'h-9 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-4 text-base has-[>svg]:px-4',
        'icon-xs': 'size-7 rounded-sm',
        'icon-sm': 'size-8',
        icon: 'size-9',
        'icon-lg': 'size-10',
      },
    },
    compoundVariants: [
      { variant: 'link', size: 'xs', class: 'h-auto px-0 !text-xs' },
      { variant: 'link', size: 'sm', class: 'h-auto px-0 !text-sm' },
      { variant: 'link', size: 'default', class: 'h-auto px-0 !text-sm' },
      { variant: 'link', size: 'lg', class: 'h-auto px-0 !text-base' },
      { variant: 'link', size: 'icon-xs', class: 'size-auto px-0' },
      { variant: 'link', size: 'icon-sm', class: 'size-auto px-0' },
      { variant: 'link', size: 'icon', class: 'size-auto px-0' },
      { variant: 'link', size: 'icon-lg', class: 'size-auto px-0' },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonVariants = VariantProps<typeof buttonVariants>

function Button({
  className,
  variant,
  size,
  render,
  nativeButton,
  children,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-size={size}
      render={render}
      nativeButton={nativeButton ?? (render ? false : undefined)}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
export type { ButtonVariants }
