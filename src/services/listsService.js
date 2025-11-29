import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const listsService = {
    // Obtener todas las listas con sus items
    async getAll() {
        if (!isSupabaseConfigured || !supabase) {
            throw new Error('Supabase no está configurado. Por favor configura las variables de entorno.');
        }

        const { data: lists, error: listsError } = await supabase
            .from('lists')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (listsError) {
            throw new Error(`Error al obtener listas: ${listsError.message}`);
        }

        // Obtener items para cada lista
        const listsWithItems = await Promise.all(
            (lists || []).map(async (list) => {
                const { data: items, error: itemsError } = await supabase
                    .from('list_items')
                    .select(`
                        *,
                        ingredient:ingredients(*)
                    `)
                    .eq('list_id', list.id);
                
                if (itemsError) {
                    throw new Error(`Error al obtener items de lista: ${itemsError.message}`);
                }

                // Transformar los items al formato esperado
                const formattedItems = (items || []).map(item => ({
                    id: item.ingredient.id,
                    name: item.ingredient.name,
                    unit: item.ingredient.unit,
                    price: item.ingredient.price,
                    quantity: item.quantity
                }));

                return {
                    ...list,
                    items: formattedItems
                };
            })
        );

        return listsWithItems;
    },

    // Obtener una lista por ID con sus items
    async getById(id) {
        if (!isSupabaseConfigured || !supabase) {
            throw new Error('Supabase no está configurado. Por favor configura las variables de entorno.');
        }

        const { data: list, error: listError } = await supabase
            .from('lists')
            .select('*')
            .eq('id', id)
            .single();
        
        if (listError) {
            throw new Error(`Error al obtener lista: ${listError.message}`);
        }

        const { data: items, error: itemsError } = await supabase
            .from('list_items')
            .select(`
                *,
                ingredient:ingredients(*)
            `)
            .eq('list_id', id);
        
        if (itemsError) {
            throw new Error(`Error al obtener items de lista: ${itemsError.message}`);
        }

        const formattedItems = (items || []).map(item => ({
            id: item.ingredient.id,
            name: item.ingredient.name,
            unit: item.ingredient.unit,
            price: item.ingredient.price,
            quantity: item.quantity
        }));

        return {
            ...list,
            items: formattedItems
        };
    },

    // Crear una nueva lista con sus items
    async create(list) {
        if (!isSupabaseConfigured || !supabase) {
            throw new Error('Supabase no está configurado. Por favor configura las variables de entorno.');
        }

        const { data: newList, error: listError } = await supabase
            .from('lists')
            .insert([{
                name: list.name
            }])
            .select()
            .single();
        
        if (listError) {
            throw new Error(`Error al crear lista: ${listError.message}`);
        }

        // Insertar items de la lista
        if (list.items && list.items.length > 0) {
            const listItems = list.items.map(item => ({
                list_id: newList.id,
                ingredient_id: item.id,
                quantity: item.quantity || 1
            }));

            const { error: itemsError } = await supabase
                .from('list_items')
                .insert(listItems);
            
            if (itemsError) {
                // Si falla la inserción de items, eliminar la lista creada
                await supabase.from('lists').delete().eq('id', newList.id);
                throw new Error(`Error al crear items de lista: ${itemsError.message}`);
            }
        }

        return await this.getById(newList.id);
    },

    // Actualizar una lista y sus items
    async update(id, list) {
        if (!isSupabaseConfigured || !supabase) {
            throw new Error('Supabase no está configurado. Por favor configura las variables de entorno.');
        }

        // Actualizar la lista
        const { error: listError } = await supabase
            .from('lists')
            .update({
                name: list.name
            })
            .eq('id', id);
        
        if (listError) {
            throw new Error(`Error al actualizar lista: ${listError.message}`);
        }

        // Eliminar items existentes
        const { error: deleteError } = await supabase
            .from('list_items')
            .delete()
            .eq('list_id', id);
        
        if (deleteError) {
            throw new Error(`Error al eliminar items de lista: ${deleteError.message}`);
        }

        // Insertar nuevos items
        if (list.items && list.items.length > 0) {
            const listItems = list.items.map(item => ({
                list_id: id,
                ingredient_id: item.id,
                quantity: item.quantity || 1
            }));

            const { error: itemsError } = await supabase
                .from('list_items')
                .insert(listItems);
            
            if (itemsError) {
                throw new Error(`Error al actualizar items de lista: ${itemsError.message}`);
            }
        }

        return await this.getById(id);
    },

    // Eliminar una lista
    async delete(id) {
        if (!isSupabaseConfigured || !supabase) {
            throw new Error('Supabase no está configurado. Por favor configura las variables de entorno.');
        }

        const { error } = await supabase
            .from('lists')
            .delete()
            .eq('id', id);
        
        if (error) {
            throw new Error(`Error al eliminar lista: ${error.message}`);
        }
    }
};

