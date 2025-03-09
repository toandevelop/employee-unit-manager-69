
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EmployeeFormValues } from "./types";

interface BasicInfoFieldsProps {
  form: UseFormReturn<EmployeeFormValues>;
}

export const BasicInfoFields = ({ form }: BasicInfoFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mã nhân viên</FormLabel>
            <FormControl>
              <Input placeholder="Nhập mã nhân viên..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tên nhân viên</FormLabel>
            <FormControl>
              <Input placeholder="Nhập tên nhân viên..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Địa chỉ</FormLabel>
            <FormControl>
              <Input placeholder="Nhập địa chỉ..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Số điện thoại</FormLabel>
            <FormControl>
              <Input placeholder="Nhập số điện thoại..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="identityCard"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Số CMND/CCCD</FormLabel>
            <FormControl>
              <Input placeholder="Nhập số CMND/CCCD..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
