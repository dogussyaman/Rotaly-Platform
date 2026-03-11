import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createClient } from '@/lib/supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  isHost: boolean;
  isAdmin: boolean;
  isTourOperator: boolean;
  roles: string[];
  points: number;
}

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  initialized: false,
};

export const fetchUserProfile = createAsyncThunk('user/fetchProfile', async () => {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [profileRes, pointsRes, rolesRes] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, avatar_url, is_host')
      .eq('id', user.id)
      .single(),
    supabase
      .from('loyalty_accounts')
      .select('points_balance')
      .eq('user_id', user.id)
      .maybeSingle(),
    supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id),
  ]);

  const roles = (rolesRes.data ?? []).map((r: any) => String(r.role));

  return {
    id: user.id,
    email: user.email ?? '',
    fullName: profileRes.data?.full_name ?? null,
    avatarUrl: profileRes.data?.avatar_url ?? null,
    isHost: profileRes.data?.is_host ?? false,
    isAdmin: roles.includes('admin'),
    isTourOperator: roles.includes('tour_operator'),
    roles,
    points: pointsRes.data?.points_balance ?? 0,
  } satisfies UserProfile;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser(state) {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
