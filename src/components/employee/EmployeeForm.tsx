import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Employee } from "@/types";
import { useAppStore } from "@/store";
import { Form } from "@/components/ui/form";
import { Accordion } from "@/components/ui/accordion";
import { formSchema, EmployeeFormValues } from "./form/types";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { ContractDateField } from "./form/ContractDateField";
import { AcademicFields } from "./form/AcademicFields";
import { DepartmentsSection } from "./form/DepartmentsSection";
import { PositionsSection } from "./form/PositionsSection";
import { FormActions } from "./form/FormActions";
import { EmployeeFormContent } from "./form/EmployeeFormContent";

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (values: EmployeeFormValues) => void;
  onCancel: () => void;
}

export default function EmployeeForm({
  employee,
  onSubmit,
  onCancel,
}: EmployeeFormProps) {
  const { 
    departments, 
    positions, 
    departmentEmployees, 
    positionEmployees, 
    academicDegrees, 
    academicTitles 
  } = useAppStore();

  // Use state to manage the form data, allowing both controlled components and react-hook-form
  const [formData, setFormData] = useState<EmployeeFormValues>({
    code: employee?.code || "",
    name: employee?.name || "",
    address: employee?.address || "",
    phone: employee?.phone || "",
    identityCard: employee?.identityCard || "",
    contractDate: employee?.contractDate || "",
    departmentIds: employee
      ? departmentEmployees
          .filter((de) => de.employeeId === employee.id)
          .map((de) => de.departmentId)
      : [],
    positionIds: employee
      ? positionEmployees
          .filter((pe) => pe.employeeId === employee.id)
          .map((pe) => pe.positionId)
      : [],
    academicDegreeId: employee?.academicDegreeId || "",
    academicTitleId: employee?.academicTitleId || "",
  });

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  });

  // Keep react-hook-form synchronized with our formData state
  useEffect(() => {
    if (formData) {
      Object.entries(formData).forEach(([key, value]) => {
        form.setValue(key as any, value);
      });
    }
  }, [formData, form]);

  // Handle form submission both from tag-based input and react-hook-form
  const handleSubmitForm = () => {
    form.handleSubmit((values) => {
      // Merge values with formData to ensure all tag-based selections are included
      onSubmit({
        ...values,
        departmentIds: formData.departmentIds,
        positionIds: formData.positionIds
      });
    })();
  };

  return (
    <Form {...form}>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmitForm(); }} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BasicInfoFields form={form} />
          
          <ContractDateField 
            form={form} 
            initialDate={employee?.contractDate} 
          />
          
          <AcademicFields 
            form={form} 
            academicDegrees={academicDegrees} 
            academicTitles={academicTitles}
          />
        </div>

        {/* Use the new EmployeeFormContent component for tag-based selection */}
        <EmployeeFormContent 
          formData={formData}
          setFormData={setFormData}
        />

        <FormActions onCancel={onCancel} />
      </form>
    </Form>
  );
}
