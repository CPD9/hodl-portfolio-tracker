'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { auth } from '@/lib/better-auth/auth-client';
import { createConsultation } from '@/lib/actions/consultation.actions';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface NewConsultationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  advisors: AIAdvisor[];
}

export default function NewConsultationDialog({
  open,
  onOpenChange,
  advisors,
}: NewConsultationDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { data: session } = auth.useSession();

  const form = useForm<ConsultationFormData>({
    defaultValues: {
      name: '',
      advisorId: '',
    },
  });

  const onSubmit = (data: ConsultationFormData) => {
    if (!session?.user?.id) {
      toast.error('You must be logged in to create a consultation');
      return;
    }

    startTransition(async () => {
      try {
        const consultation = await createConsultation(session.user.id, data);
        toast.success('Consultation created successfully!');
        onOpenChange(false);
        form.reset();
  router.push(`/dashboard/call/${consultation._id}`);
        router.refresh();
      } catch (error: any) {
        toast.error(error.message || 'Failed to create consultation');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-yellow-500">
            Schedule AI Consultation
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a new video consultation with your AI financial advisor
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: 'Consultation name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">
                    Consultation Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Portfolio Review Q1"
                      className="bg-gray-700 border-gray-600 text-gray-100"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="advisorId"
              rules={{ required: 'Please select an advisor' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">AI Advisor</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
                        <SelectValue placeholder="Select an advisor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {advisors && advisors.length > 0 ? (
                        advisors.map((advisor) => (
                          <SelectItem
                            key={advisor._id}
                            value={advisor._id}
                            className="text-gray-100"
                          >
                            <div className="flex items-center space-x-2">
                              <span>{advisor.name}</span>
                              <span className="text-xs text-gray-400">
                                ({advisor.personality})
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-400">
                          No advisors available. Please try refreshing the page.
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Consultation
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

