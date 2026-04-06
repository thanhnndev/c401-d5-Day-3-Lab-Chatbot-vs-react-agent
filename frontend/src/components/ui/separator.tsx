import { Separator } from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";

interface SeparatorProps extends React.ComponentPropsWithoutRef<typeof Separator> {}

function SeparatorLine({ className, ...props }: SeparatorProps) {
  return (
    <Separator
      className={cn("shrink-0 bg-border h-[1px] w-full", className)}
      {...props}
    />
  );
}

export { SeparatorLine as Separator }
