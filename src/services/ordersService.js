import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const ordersService = {
    // Obtener todos los pedidos con sus items
    async getAll() {
        if (!isSupabaseConfigured || !supabase) {
            throw new Error('Supabase no está configurado. Por favor configura las variables de entorno.');
        }

        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .order('date', { ascending: false });
        
        if (ordersError) {
            throw new Error(`Error al obtener pedidos: ${ordersError.message}`);
        }

        // Obtener items para cada pedido
        const ordersWithItems = await Promise.all(
            (orders || []).map(async (order) => {
                const { data: items, error: itemsError } = await supabase
                    .from('order_items')
                    .select('*')
                    .eq('order_id', order.id);
                
                if (itemsError) {
                    throw new Error(`Error al obtener items de pedido: ${itemsError.message}`);
                }

                return {
                    ...order,
                    items: items || []
                };
            })
        );

        return ordersWithItems;
    },

    // Obtener un pedido por ID con sus items
    async getById(id) {
        if (!isSupabaseConfigured || !supabase) {
            throw new Error('Supabase no está configurado. Por favor configura las variables de entorno.');
        }

        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();
        
        if (orderError) {
            throw new Error(`Error al obtener pedido: ${orderError.message}`);
        }

        const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', id);
        
        if (itemsError) {
            throw new Error(`Error al obtener items de pedido: ${itemsError.message}`);
        }

        return {
            ...order,
            items: items || []
        };
    },

    // Crear un nuevo pedido con sus items
    async create(order) {
        if (!isSupabaseConfigured || !supabase) {
            throw new Error('Supabase no está configurado. Por favor configura las variables de entorno.');
        }

        // Generar número de pedido si no existe
        const orderNumber = order.id || `ORD-${String(Date.now()).slice(-6)}`;

        // Crear el pedido
        const { data: newOrder, error: orderError } = await supabase
            .from('orders')
            .insert([{
                order_number: orderNumber,
                status: order.status || 'Pendiente',
                total: order.total || 0,
                item_count: order.itemCount || 0,
                date: order.date || new Date().toISOString()
            }])
            .select()
            .single();
        
        if (orderError) {
            throw new Error(`Error al crear pedido: ${orderError.message}`);
        }

        // Insertar items del pedido
        if (order.items && order.items.length > 0) {
            const orderItems = order.items.map(item => {
                // Usar ingredient_id si existe, de lo contrario intentar convertir item.id si es numérico
                let ingredientId = item.ingredient_id || null;
                
                // Si no hay ingredient_id pero item.id es numérico, usarlo
                if (!ingredientId && item.id && typeof item.id === 'number') {
                    ingredientId = item.id;
                }
                // Si item.id es string pero parece ser un ID de Excel, dejarlo como null
                else if (typeof item.id === 'string' && item.id.startsWith('excel-')) {
                    ingredientId = null;
                }
                // Si item.id es string numérico, convertirlo
                else if (typeof item.id === 'string' && /^\d+$/.test(item.id)) {
                    ingredientId = parseInt(item.id, 10);
                }

                return {
                    order_id: newOrder.id,
                    ingredient_id: ingredientId,
                    name: item.name,
                    unit: item.unit,
                    price: item.price || 0,
                    quantity: item.quantity || 1
                };
            });

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);
            
            if (itemsError) {
                // Si falla la inserción de items, eliminar el pedido creado
                await supabase.from('orders').delete().eq('id', newOrder.id);
                throw new Error(`Error al crear items de pedido: ${itemsError.message}`);
            }
        }

        return await this.getById(newOrder.id);
    },

    // Actualizar el estado de un pedido
    async updateStatus(id, status) {
        if (!isSupabaseConfigured || !supabase) {
            throw new Error('Supabase no está configurado. Por favor configura las variables de entorno.');
        }

        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select()
            .single();
        
        if (error) {
            throw new Error(`Error al actualizar estado del pedido: ${error.message}`);
        }
        
        return data;
    },

    // Eliminar un pedido
    async delete(id) {
        if (!isSupabaseConfigured || !supabase) {
            throw new Error('Supabase no está configurado. Por favor configura las variables de entorno.');
        }

        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', id);
        
        if (error) {
            throw new Error(`Error al eliminar pedido: ${error.message}`);
        }
    }
};

