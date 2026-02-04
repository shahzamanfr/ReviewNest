import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env variables from the root .env file
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Use blood-curdling Service Role Key if available, or Anon Key if RLS allows deletion
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearReviews() {
    console.log('🚀 Clearing all reviews...');

    const { data, error, count } = await supabase
        .from('reviews')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete everything (hack to avoid empty filter)

    if (error) {
        console.error('❌ Error clearing reviews:', error.message);
        process.exit(1);
    }

    console.log('✅ Successfully deleted all reviews.');
}

clearReviews();
