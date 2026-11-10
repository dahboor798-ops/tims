// ==========================================
// supabase-client.js
// ==========================================
const SUPABASE_URL = 'https://xxwgmtrroaxpcqrxkfqf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_bXRJ3qQuHPTTfxg-NCDKqQ_NwdzAspV';

// التحقق من وجود مكتبة Supabase الأساسية
if (typeof supabase !== 'undefined') {
    // إنشاء الاتصال وتعريفه بأسماء متعددة ليتوافق مع كل الملفات
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window.db = window.supabaseClient;
    console.log("✅ Supabase Client Ready");
} else {
    console.error("❌ مكتبة Supabase SDK غير محملة. تأكد من وجود رابط CDN.");
}