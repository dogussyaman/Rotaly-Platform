import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // OAuth ile gelen kullanıcılarda `role` meta datası bazen boş geliyor.
      // Burada default olarak `guest` atayarak uygulama içinde tutarlı bir kontrol sağlıyoruz.
      try {
        const { data } = await supabase.auth.getUser();
        const role = data.user?.user_metadata?.role;
        if (data.user && (!role || String(role).trim().length === 0)) {
          await supabase.auth.updateUser({ data: { role: 'guest' } });
        }
      } catch {
        // noop (redirect'i engellemeyelim)
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Hata durumunda login'e yönlendir
  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`);
}
