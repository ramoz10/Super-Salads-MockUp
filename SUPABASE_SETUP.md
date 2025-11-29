# Configuración de Supabase

Este documento explica cómo configurar Supabase para la aplicación Super Salads.

## Pasos de Configuración

### 1. Crear archivo .env

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_SUPABASE_URL=tu_project_url_aqui
VITE_SUPABASE_ANON_KEY=tu_api_key_supabase_aqui
```

**Importante:** Reemplaza `tu_project_url_aqui` y `tu_api_key_supabase_aqui` con tus credenciales reales de Supabase.

### 2. Crear las tablas en Supabase

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a **SQL Editor**
3. Abre el archivo `supabase_schema.sql` que está en la raíz del proyecto
4. Copia y pega todo el contenido del archivo en el SQL Editor
5. Ejecuta el script haciendo clic en **Run**

Esto creará las siguientes tablas:
- `ingredients` - Para almacenar los ingredientes/productos
- `lists` - Para almacenar las listas predefinidas
- `list_items` - Para almacenar los items dentro de cada lista
- `orders` - Para almacenar los pedidos
- `order_items` - Para almacenar los items dentro de cada pedido

### 3. Verificar las políticas RLS

El script SQL crea políticas básicas de Row Level Security (RLS) que permiten todas las operaciones. Esto es adecuado para desarrollo, pero deberías ajustarlas cuando agregues autenticación.

### 4. Inicializar datos (opcional)

Si quieres tener algunos ingredientes iniciales, puedes ejecutar este SQL en el SQL Editor:

```sql
INSERT INTO ingredients (name, unit, price) VALUES
('Tomate Bola', 'kg', 25.50),
('Lechuga Romana', 'pz', 18.00),
('Aceite de Oliva', 'L', 85.00),
('Cebolla Morada', 'kg', 22.00),
('Pimiento Verde', 'kg', 30.00),
('Queso Panela', 'kg', 95.00);
```

## Estructura de las Tablas

### ingredients
- `id` (BIGSERIAL PRIMARY KEY)
- `name` (VARCHAR) - Nombre del ingrediente
- `unit` (VARCHAR) - Unidad de medida (kg, pz, L, etc.)
- `price` (DECIMAL) - Precio unitario
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### lists
- `id` (BIGSERIAL PRIMARY KEY)
- `name` (VARCHAR) - Nombre de la lista
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### list_items
- `id` (BIGSERIAL PRIMARY KEY)
- `list_id` (BIGINT) - Referencia a lists.id
- `ingredient_id` (BIGINT) - Referencia a ingredients.id
- `quantity` (DECIMAL) - Cantidad del ingrediente en la lista
- `created_at` (TIMESTAMP)

### orders
- `id` (BIGSERIAL PRIMARY KEY)
- `order_number` (VARCHAR) - Número único del pedido (ej: ORD-001)
- `status` (VARCHAR) - Estado del pedido (Pendiente, En Camino, Entregado)
- `total` (DECIMAL) - Total del pedido
- `item_count` (DECIMAL) - Cantidad total de items
- `date` (TIMESTAMP) - Fecha del pedido
- `created_at` (TIMESTAMP)

### order_items
- `id` (BIGSERIAL PRIMARY KEY)
- `order_id` (BIGINT) - Referencia a orders.id
- `ingredient_id` (BIGINT) - Referencia a ingredients.id (puede ser NULL)
- `name` (VARCHAR) - Nombre del producto (por si se elimina el ingrediente)
- `unit` (VARCHAR) - Unidad de medida
- `price` (DECIMAL) - Precio al momento del pedido
- `quantity` (DECIMAL) - Cantidad pedida
- `created_at` (TIMESTAMP)

## Solución de Problemas

### Error: "Faltan las variables de entorno de Supabase"
- Asegúrate de que el archivo `.env` existe en la raíz del proyecto
- Verifica que las variables se llamen exactamente `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
- Reinicia el servidor de desarrollo después de crear/modificar el archivo `.env`

### Error al ejecutar el script SQL
- Verifica que tienes permisos de administrador en tu proyecto de Supabase
- Asegúrate de copiar todo el contenido del archivo `supabase_schema.sql`
- Revisa la consola de errores en Supabase Dashboard

### Los datos no se guardan
- Verifica que las políticas RLS están configuradas correctamente
- Revisa la consola del navegador para ver errores específicos
- Verifica que las credenciales en `.env` son correctas

## Notas Importantes

- El archivo `.env` NO debe ser commiteado al repositorio (ya está en .gitignore)
- Las políticas RLS actuales permiten todas las operaciones sin autenticación
- Cuando agregues autenticación, deberás actualizar las políticas RLS
- Los triggers automáticos actualizan `updated_at` cuando se modifican los registros

