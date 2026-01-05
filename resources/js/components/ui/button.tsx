import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer btn-modern",
  {
    variants: {
      variant: {
        default:
          "bg-[#F58E18] text-white",
        destructive:
          "bg-destructive text-white focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "bg-transparent border border-[#F58E18] text-[#F58E18]",
        secondary:
          "bg-gray-100 dark:bg-[#262626] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800",
        ghost: "bg-transparent",
        link: "text-[#F58E18] underline-offset-4",
        accent: "bg-[#F58E18] text-white",
        green: "bg-green-600 text-white",
        greenOutline: "bg-transparent border border-green-600 text-green-600",
        red: "bg-red-600 text-white",
        redOutline: "bg-transparent border border-red-600 text-red-600",
        orange: "bg-[#F58E18] text-white",
        orangeOutline: "bg-transparent border border-[#F58E18] text-[#F58E18]",
        purple: "bg-purple-600 text-white",
        purpleOutline: "bg-transparent border border-purple-600 text-purple-600",
        yellow: "bg-yellow-600 text-white",
        yellowOutline: "bg-transparent border border-yellow-600 text-yellow-600",
        pink: "bg-pink-600 text-white",
        pinkOutline: "bg-transparent border border-pink-600 text-pink-600",
        blue: "bg-blue-600 text-white",
        blueOutline: "bg-transparent border border-blue-600 text-blue-600",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
