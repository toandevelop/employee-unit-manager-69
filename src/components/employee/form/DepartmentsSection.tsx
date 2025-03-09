
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { EmployeeFormValues } from "./types";
import { Department } from "@/types";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface DepartmentsSectionProps {
  form: UseFormReturn<EmployeeFormValues>;
  departments: Department[];
}

export const DepartmentsSection = ({
  form,
  departments,
}: DepartmentsSectionProps) => {
  return (
    <AccordionItem value="departments">
      <AccordionTrigger>Đơn vị công tác</AccordionTrigger>
      <AccordionContent>
        <FormField
          control={form.control}
          name="departmentIds"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">
                  Chọn đơn vị công tác
                </FormLabel>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {departments.map((department) => (
                  <FormField
                    key={department.id}
                    control={form.control}
                    name="departmentIds"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={department.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <input
                              type="checkbox"
                              className="h-4 w-4 mt-1 text-primary focus:ring-primary"
                              checked={field.value?.includes(
                                department.id
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange([
                                    ...(field.value || []),
                                    department.id,
                                  ]);
                                } else {
                                  field.onChange(
                                    field.value?.filter(
                                      (value) => value !== department.id
                                    )
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {department.name}
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
