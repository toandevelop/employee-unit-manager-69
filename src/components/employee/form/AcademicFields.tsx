
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { EmployeeFormValues } from "./types";
import { AcademicDegree, AcademicTitle } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AcademicFieldsProps {
  form: UseFormReturn<EmployeeFormValues>;
  academicDegrees: AcademicDegree[];
  academicTitles: AcademicTitle[];
}

export const AcademicFields = ({
  form,
  academicDegrees,
  academicTitles,
}: AcademicFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="academicDegreeId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Học vị</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn học vị" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {academicDegrees.map((degree) => (
                  <SelectItem key={degree.id} value={degree.id}>
                    {degree.name} ({degree.shortName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="academicTitleId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Học hàm</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn học hàm (không bắt buộc)" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="">Không có</SelectItem>
                {academicTitles.map((title) => (
                  <SelectItem key={title.id} value={title.id}>
                    {title.name} ({title.shortName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
