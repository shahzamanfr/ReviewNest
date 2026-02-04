import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
    console.warn("⚠️ Missing Supabase environment variables. Reviews will not load. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment (local .env or AWS Amplify settings).");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

// Simple session-based ID for anonymous auth
const getSessionId = () => {
    let id = localStorage.getItem("review_nest_session_id");
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem("review_nest_session_id", id);
    }
    return id;
};

export const sessionId = getSessionId();

export const getStoredUserName = () => {
    return localStorage.getItem("review_nest_user_name");
};

export const setStoredUserName = (name: string) => {
    localStorage.setItem("review_nest_user_name", name);
};
