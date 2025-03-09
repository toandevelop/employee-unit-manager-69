
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { EmployeeFormValues } from "./types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ChevronsUpDown } from "lucide-react";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface ContractDateFieldProps {
  form: UseFormReturn<EmployeeFormValues>;
  initialDate?: string;
}

export const ContractDateField = ({ form, initialDate }: ContractDateFieldProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDate ? new Date(initialDate) : undefined
  );

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      form.setValue("contractDate", format(date, "yyyy-MM-dd"));
    }
  };

  useEffect(() => {
    if (initialDate) {
      setSelectedDate(new Date(initialDate));
    }
  }, [initialDate]);

  return (
    <FormField
      control={form.control}
      name="contractDate"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Ngày hợp đồng</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(new Date(field.value), "dd/MM/yyyy")
                  ) : (
                    <span>Chọn ngày hợp đồng</span>
                  )}
                  <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                locale={vi}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
