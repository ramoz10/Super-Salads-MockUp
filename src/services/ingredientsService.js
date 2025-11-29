import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const ingredientsService = {
    // Obtener todos los ingredientes
    async getAll() {
        if (!isSupabaseConfigured || !supabase) {
            throw new Error('Supabase no está configurado. Por favor configura las variables de entorno.');
        }

        const { data, error } = await supabase
            .from('ingredients')
            .select('*')
            .order('name', { ascending: true });
        
        if (error) {
            throw new Error(`Error al obtener ingredientes: ${error.message}`);
        }
        
        return data || [];
    },

    // Obtener un ingrediente por ID
    async getById(id) {
        if (!isSupabaseConfigured || !supabase) {
            throw new Error('Supabase no está configurado. Por favor configura las variables de entorno.');
        }

        const { data, error } = await supabase
            .from('ingredients')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) {
            throw new Error(`Error al obtener ingrediente: ${error.message}`);
        }
        
        return data;
    },

    // Crear un nuevo ingrediente
    async create(ingredient) {
        if (!isSupabaseConfigured || !supabase) {
            throw new Error('Supabase no está configurado. Por favor configura las variables de entorno.');
        }

        const { data, error } = await supabase
            .from('ingredients')
            .insert([{
                name: ingredient.name,
                unit: ingredient.unit,
                price: ingredient.price || 0
            }])
            .select()
            .single();
        
        if (error) {
            throw new Error(`Error al crear ingrediente: ${error.message}`);
        }
        
        return data;
    },

    // Actualizar un ingrediente
    async update(id, ingredient) {
        if (!isSupabaseConfigured || !supabase) {
            throw new Error('Supabase no está configurado. Por favor configura las variables de entorno.');
        }

        const { data, error } = await supabase
            .from('ingredients')
            .update({
                name: ingredient.name,
                unit: ingredient.unit,
                price: ingredient.price || 0
            })
            .eq('id', id)
            .select()
            .single();
        
        if (error) {
            throw new Error(`Error al actualizar ingrediente: ${error.message}`);
        }
        
        return data;
    },

    // Eliminar un ingrediente
    async delete(id) {
        if (!isSupabaseConfigured || !supabase) {
            throw new Error('Supabase no está configurado. Por favor configura las variables de entorno.');
        }

        const { error } = await supabase
            .from('ingredients')
            .delete()
            .eq('id', id);
        
        if (error) {
            throw new Error(`Error al eliminar ingrediente: ${error.message}`);
        }
    }
};

