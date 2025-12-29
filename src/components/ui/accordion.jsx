import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { Plus, Minus } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border border-primary-1006 bg-white mb-0 data-[state=open]:shadow-md", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 px-4 font-medium transition-all",
        "data-[state=closed]:bg-white data-[state=closed]:text-primary-900",
        "data-[state=open]:bg-primary-50 data-[state=open]:text-white",
        "[&_.icon-plus]:block [&_.icon-minus]:hidden",
        "data-[state=open]:[&_.icon-plus]:hidden data-[state=open]:[&_.icon-minus]:block",
        className
      )}
      {...props}
    >
      <span className="text-left">{children}</span>
      <div className="shrink-0 ml-4">
        <Plus className="icon-plus h-5 w-5 text-primary-400" />
        <Minus className="icon-minus h-5 w-5 text-white hidden" />
      </div>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down bg-white border-l border-r border-b border-primary-1020"
    {...props}
  >
    <div className={cn("pb-4 pt-4 px-4 text-gray-700", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

