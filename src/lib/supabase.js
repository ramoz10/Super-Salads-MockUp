import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificar si las variables están configuradas
const isConfigured = supabaseUrl && supabaseAnonKey && 
                     supabaseUrl !== 'your_project_url_here' && 
                     supabaseAnonKey !== 'your_api_key_supabase_here';

if (!isConfigured) {
    console.error('⚠️ Supabase no está configurado. Por favor:');
    console.error('1. Crea o edita el archivo .env en la raíz del proyecto');
    console.error('2. Agrega las siguientes líneas:');
    console.error('   VITE_SUPABASE_URL=tu_project_url_aqui');
    console.error('   VITE_SUPABASE_ANON_KEY=tu_api_key_supabase_aqui');
    console.error('3. Reinicia el servidor de desarrollo');
}

// Crear cliente solo si está configurado, de lo contrario será null
export const supabase = isConfigured 
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = isConfigured;

