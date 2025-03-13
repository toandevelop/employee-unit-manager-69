
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppStore } from '@/store';
import { Form } from '@/components/ui/form';
import { applicationFormSchema, ApplicationFormValues, defaultValues } from './schemas/applicationFormSchema';
import JobPostingField from './form-fields/JobPostingField';
import PersonalInfoFields from './form-fields/PersonalInfoFields';
import ResumeField from './form-fields/ResumeField';
import CoverLetterField from './form-fields/CoverLetterField';
import StatusField from './form-fields/StatusField';
import FormActions from './form-fields/FormActions';

interface ApplicationFormProps {
  onSuccess: () => void;
}

const ApplicationForm = ({ onSuccess }: ApplicationFormProps) => {
  const addJobApplication = useAppStore((state) => state.addJobApplication);
  
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues,
  });
  
  const onSubmit = (data: ApplicationFormValues) => {
    addJobApplication(data);
    onSuccess();
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <JobPostingField form={form} />
        <PersonalInfoFields form={form} />
        <ResumeField form={form} />
        <CoverLetterField form={form} />
        <StatusField form={form} />
        <FormActions onCancel={onSuccess} />
      </form>
    </Form>
  );
};

export default ApplicationForm;
