
import { useEffect } from "react";
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

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    },
  });

  useEffect(() => {
    if (employee) {
      // Populate department IDs
      const departmentIds = departmentEmployees
        .filter((de) => de.employeeId === employee.id)
        .map((de) => de.departmentId);
      form.setValue("departmentIds", departmentIds);

      // Populate position IDs
      const positionIds = positionEmployees
        .filter((pe) => pe.employeeId === employee.id)
        .map((pe) => pe.positionId);
      form.setValue("positionIds", positionIds);
      
      // Populate academic degree and title
      if (employee.academicDegreeId) {
        form.setValue("academicDegreeId", employee.academicDegreeId);
      }
      if (employee.academicTitleId) {
        form.setValue("academicTitleId", employee.academicTitleId);
      }
    }
  }, [employee, departmentEmployees, positionEmployees, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

        <Accordion type="single" collapsible className="w-full">
          <DepartmentsSection form={form} departments={departments} />
          <PositionsSection form={form} positions={positions} />
        </Accordion>

        <FormActions onCancel={onCancel} />
      </form>
    </Form>
  );
}
