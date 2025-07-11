import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function TooltipContext({
  trigger,
  description,
}: {
  trigger: any;
  description?: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="m-0 p-0 bg-transparent hover:bg-transparent">{trigger}</Button>
        </TooltipTrigger>
        {description && (
          <TooltipContent className="bg-black-80">
            {description}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
