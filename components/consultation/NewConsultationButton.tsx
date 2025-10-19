'use client';

import { Button } from '@/components/ui/button';
import NewConsultationDialog from './NewConsultationDialog';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface NewConsultationButtonProps {
  advisors: AIAdvisor[];
}

export default function NewConsultationButton({ advisors }: NewConsultationButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Consultation
      </Button>
      <NewConsultationDialog
        open={open}
        onOpenChange={setOpen}
        advisors={advisors}
      />
    </>
  );
}

