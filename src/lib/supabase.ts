import { createClient } from '@supabase/supabase-js';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function retryOperation<T>(operation: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0 && error instanceof Error && error.message.includes('Failed to fetch')) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return retryOperation(operation, retries - 1);
    }
    throw error;
  }
}

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      fetch: async (url, options) => {
        return retryOperation(() => fetch(url, options));
      },
    },
  }
);

// Function to check and update admin status
export async function checkAndUpdateAdminStatus(userId: string): Promise<void> {
  try {
    // Get user permissions from app_users
    const { data: userData, error: userError } = await supabase
      .from('app_users')
      .select('permissions, email')
      .eq('id', userId)
      .single();

    if (userError) throw userError;
    if (!userData) return;

    const hasAdminAccess = userData.permissions.pages.administration === true;
    const isPhilipp = userData.email === 'philipp@plan-p.de';

    // Update admin status using the database function
    const { error: updateError } = await supabase.rpc('update_user_admin_status', {
      user_id: userId,
      is_admin: hasAdminAccess,
      is_superadmin: isPhilipp
    });

    if (updateError) throw updateError;

    // Refresh the session to get the new permissions
    if (userId === (await supabase.auth.getUser()).data.user?.id) {
      await supabase.auth.refreshSession();
    }
  } catch (error) {
    console.error('Error updating admin status:', error);
    throw error;
  }
}