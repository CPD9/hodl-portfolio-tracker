'use client';

import { Calendar, Clock, User, Video } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import humanizeDuration from 'humanize-duration';

interface ConsultationsTableProps {
  consultations: Consultation[];
}

const STATUS_COLORS = {
  upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  active: 'bg-green-500/20 text-green-400 border-green-500/50',
  completed: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
  processing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/50',
};

const STATUS_LABELS = {
  upcoming: 'Scheduled',
  active: 'In Progress',
  completed: 'Completed',
  processing: 'Processing',
  cancelled: 'Cancelled',
};

export default function ConsultationsTable({
  consultations,
}: ConsultationsTableProps) {
  if (consultations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <Video className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          No consultations yet
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          Schedule your first AI consultation to get personalized financial advice
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700">
            <TableHead className="text-gray-400">Consultation</TableHead>
            <TableHead className="text-gray-400">Advisor</TableHead>
            <TableHead className="text-gray-400">Status</TableHead>
            <TableHead className="text-gray-400">Date</TableHead>
            <TableHead className="text-gray-400">Duration</TableHead>
            <TableHead className="text-gray-400 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultations.map((consultation) => (
            <TableRow
              key={consultation._id}
              className="border-gray-700 hover:bg-gray-750 transition"
            >
              <TableCell className="font-medium text-gray-100">
                {consultation.name}
              </TableCell>

              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-gray-300">
                    {consultation.advisor?.name || 'Unknown'}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <Badge
                  variant="outline"
                  className={STATUS_COLORS[consultation.status]}
                >
                  {STATUS_LABELS[consultation.status]}
                </Badge>
              </TableCell>

              <TableCell className="text-gray-400">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {consultation.startedAt
                      ? format(new Date(consultation.startedAt), 'PPp')
                      : format(new Date(consultation.createdAt), 'PP')}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-gray-400">
                {consultation.duration ? (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {humanizeDuration(consultation.duration * 1000, {
                        largest: 2,
                        round: true,
                      })}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-600">—</span>
                )}
              </TableCell>

              <TableCell className="text-right">
                {consultation.status === 'upcoming' && (
                  <Button
                    asChild
                    size="sm"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                  >
                    <Link href={`/call/${consultation._id}`}>
                      <Video className="w-4 h-4 mr-2" />
                      Join
                    </Link>
                  </Button>
                )}
                {consultation.status !== 'upcoming' && (
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="text-gray-400"
                  >
                    <Link href={`/consultation/${consultation._id}`}>
                      View Details
                    </Link>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

