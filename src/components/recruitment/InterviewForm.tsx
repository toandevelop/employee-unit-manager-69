
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppStore } from '@/store';
import { Interview } from '@/types';
import { Form } from '@/components/ui/form';
import { interviewFormSchema, InterviewFormValues } from './schemas/interviewFormSchema';
import InterviewDateTimeFields from './form-fields/InterviewDateTimeFields';
import InterviewTypeField from './form-fields/InterviewTypeField';
import InterviewLocationField from './form-fields/InterviewLocationField';
import InterviewersField from './form-fields/InterviewersField';
import InterviewNotesField from './form-fields/InterviewNotesField';
import InterviewStatusField from './form-fields/InterviewStatusField';
import InterviewFeedbackFields from './form-fields/InterviewFeedbackFields';
import FormActions from './form-fields/FormActions';

interface InterviewFormProps {
  applicationId: string;
  interview?: Interview;
  onSuccess: () => void;
}

const InterviewForm = ({ applicationId, interview, onSuccess }: InterviewFormProps) => {
  const addInterview = useAppStore((state) => state.addInterview);
  const updateInterview = useAppStore((state) => state.updateInterview);
  
  const defaultValues: InterviewFormValues = interview
    ? {
        ...interview,
        interviewDate: new Date(interview.interviewDate),
        interviewersInput: interview.interviewers.join(', '),
      }
    : {
        applicationId,
        interviewDate: new Date(),
        interviewTime: '09:00',
        interviewType: 'in-person' as const,
        interviewersInput: '',
        location: '',
        meetingLink: '',
        notes: '',
        status: 'scheduled' as const,
        feedback: '',
        rating: undefined,
      };
  
  const form = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues,
  });
  
  const watchInterviewType = form.watch('interviewType');
  const watchStatus = form.watch('status');
  
  const onSubmit = (data: InterviewFormValues) => {
    // Convert the comma-separated interviewers string to an array
    const interviewers = data.interviewersInput
      .split(',')
      .map((name: string) => name.trim())
      .filter((name: string) => name !== '');
    
    const submitData = {
      ...data,
      interviewDate: data.interviewDate.toISOString().split('T')[0],
      interviewers,
    };
    
    // Remove the temporary interviewersInput field
    delete submitData.interviewersInput;
    
    if (interview) {
      updateInterview(interview.id, submitData);
    } else {
      addInterview(submitData);
    }
    
    onSuccess();
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InterviewDateTimeFields form={form} />
        <InterviewTypeField form={form} />
        <InterviewLocationField form={form} interviewType={watchInterviewType} />
        <InterviewersField form={form} />
        <InterviewNotesField form={form} />
        <InterviewStatusField form={form} />
        <InterviewFeedbackFields form={form} status={watchStatus} />
        <FormActions onCancel={onSuccess} isEditing={!!interview} />
      </form>
    </Form>
  );
};

export default InterviewForm;
