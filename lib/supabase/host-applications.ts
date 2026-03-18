import { createClient } from '@/lib/supabase/client';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'in_review';

export interface HostApplicationInput {
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  propertyType: string;
  propertyCount: number;
  experience: string;
  motivation: string;
}

export interface HostApplication {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  propertyType: string;
  propertyCount: number;
  experience: string;
  motivation: string;
  status: ApplicationStatus;
  reviewerNotes: string | null;
  createdAt: string;
  reviewedAt: string | null;
}

export async function createHostApplication(input: HostApplicationInput): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from('host_applications').insert({
    user_id: input.userId,
    full_name: input.fullName,
    phone: input.phone,
    email: input.email,
    city: input.city,
    property_type: input.propertyType,
    property_count: input.propertyCount,
    experience: input.experience,
    motivation: input.motivation,
    status: 'pending',
  });
  return !error;
}

export async function fetchHostApplications(): Promise<HostApplication[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('host_applications')
    .select('*')
    .order('created_at', { ascending: false });

  return (data ?? []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    city: row.city,
    propertyType: row.property_type,
    propertyCount: row.property_count,
    experience: row.experience,
    motivation: row.motivation,
    status: row.status as ApplicationStatus,
    reviewerNotes: row.reviewer_notes,
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at,
  }));
}

export async function checkExistingApplication(userId: string): Promise<ApplicationStatus | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from('host_applications')
    .select('status')
    .eq('user_id', userId)
    .maybeSingle();
  return data ? (data.status as ApplicationStatus) : null;
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  reviewerNotes?: string,
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('host_applications')
    .update({
      status,
      reviewer_notes: reviewerNotes ?? null,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id);
  return !error;
}
