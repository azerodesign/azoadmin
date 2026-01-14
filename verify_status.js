import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://algjlgresbgavvcpfcvx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsZ2psZ3Jlc2JnYXZ2Y3BmY3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNTE4ODQsImV4cCI6MjA4MjkyNzg4NH0.mHg6IvqNuyi49nQ-nOyuFS9JlX74Ve5oomn_Zgzv9dM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verifyStatus() {
    console.log('🔍 Checking bot_status table...');

    const { data, error } = await supabase
        .from('bot_status')
        .select('*')
        .eq('session_id', 'main');

    if (error) {
        console.error('❌ Error fetching Status:', error);
    } else {
        console.log('✅ Status Data:', data);
        if (data.length === 0) {
            console.log('⚠️ No data found for session_id="main"');
        } else {
            console.log(`📡 Current Status: ${data[0].is_online ? 'ONLINE' : 'OFFLINE'}`);
        }
    }
}

verifyStatus();
