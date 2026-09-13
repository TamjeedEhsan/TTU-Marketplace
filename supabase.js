// Connect TTU Marketplace to Supabase

const SUPABASE_URL = "https://adqrzcnqdutovzzfcmyi.supabase.co";
const SUPABASE_KEY = "sb_publishable_qjY6tcW57coDCOhEIiEY6g_VO3r46-t";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);