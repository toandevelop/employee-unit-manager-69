
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { EmployeeFormValues } from "./types";
import { Position } from "@/types";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PositionsSectionProps {
  form: UseFormReturn<EmployeeFormValues>;
  positions: Position[];
}

export const PositionsSection = ({
  form,
  positions,
}: PositionsSectionProps) => {
  return (
    <AccordionItem value="positions">
      <AccordionTrigger>Chức vụ</AccordionTrigger>
      <AccordionContent>
        <FormField
          control={form.control}
          name="positionIds"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Chọn chức vụ</FormLabel>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {positions.map((position) => (
                  <FormField
                    key={position.id}
                    control={form.control}
                    name="positionIds"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={position.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <input
                              type="checkbox"
                              className="h-4 w-4 mt-1 text-primary focus:ring-primary"
                              checked={field.value?.includes(position.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange([
                                    ...(field.value || []),
                                    position.id,
                                  ]);
                                } else {
                                  field.onChange(
                                    field.value?.filter(
                                      (value) => value !== position.id
                                    )
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {position.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </AccordionContent>
    </AccordionItem>
  );
};
