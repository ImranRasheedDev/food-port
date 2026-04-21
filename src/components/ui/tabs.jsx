import * as React from "react";
import { cn } from "@/lib/utils";

const TabsContext = React.createContext(null);

function Tabs({ defaultValue, value, onValueChange, children, className }) {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue);

  const handleValueChange = React.useCallback(
    (newValue) => {
      if (onValueChange) {
        onValueChange(newValue);
      } else {
        setActiveTab(newValue);
      }
    },
    [onValueChange]
  );

  const currentValue = value !== undefined ? value : activeTab;

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ children, className }) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-start gap-4 border-b border-gray-200 w-full",
        className
      )}
    >
      {children}
    </div>
  );
}

function TabsTrigger({ value, children, className }) {
  const context = React.useContext(TabsContext);
  const isActive = context?.value === value;

  return (
    <button
      type="button"
      onClick={() => context?.onValueChange(value)}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-all relative cursor-pointer",
        "focus:outline-none",
        isActive
          ? "text-primary-50 border-b-2 border-primary-50 -mb-[1px]"
          : "text-gray-500 hover:text-gray-700",
        className
      )}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, children, className }) {
  const context = React.useContext(TabsContext);
  const isActive = context?.value === value;

  if (!isActive) return null;

  return <div className={cn("mt-4", className)}>{children}</div>;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
