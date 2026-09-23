import { NextResponse } from 'next/server';
import { supabase } from '@/data/lib/supabaseClient';

export async function GET() {
  const timestamp = new Date().toISOString();
  let supabaseStatus = 'not_configured';

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('id')
        .limit(1);

      if (error) {
        supabaseStatus = `error: ${error.message}`;
      } else {
        supabaseStatus = 'active';
      }
    } catch (err) {
      supabaseStatus = `error: ${err.message}`;
    }
  }

  return NextResponse.json({
    status: 'ok',
    app: 'gabin-bar-web',
    supabase: supabaseStatus,
    timestamp,
  });
}
