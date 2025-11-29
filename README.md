# Super Salads MockUp

Sistema de gestión de pedidos de ingredientes para Super Salads con integración de Supabase para persistencia de datos.

## 🚀 Características

- **Gestión de Ingredientes**: CRUD completo de ingredientes/productos con precios y unidades
- **Listas Predefinidas**: Crea y gestiona listas de productos para pedidos recurrentes
- **Realización de Pedidos**: 
  - Agregar productos manualmente
  - Cargar pedidos desde archivos Excel
  - Aplicar listas predefinidas automáticamente
- **Historial de Pedidos**: Visualiza y gestiona todos los pedidos realizados
- **Persistencia con Supabase**: Todos los datos se guardan en Supabase para tener memoria persistente

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- npm (incluido con Node.js)
- Cuenta de Supabase (para persistencia de datos)

## 🔧 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/ramoz10/Super-Salads-MockUp.git
cd Super-Salads-MockUp
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura Supabase:
   - Crea un archivo `.env` en la raíz del proyecto
   - Agrega tus credenciales de Supabase:
   ```env
   VITE_SUPABASE_URL=tu_project_url_aqui
   VITE_SUPABASE_ANON_KEY=tu_api_key_supabase_aqui
   ```
   - Ejecuta el script SQL en Supabase (ver `supabase_schema.sql`)
   - Consulta `SUPABASE_SETUP.md` para más detalles

## 🏃 Cómo ejecutar el sistema

### Modo Desarrollo

```bash
npm run dev
```

Esto iniciará el servidor local, generalmente en `http://localhost:5173`. Abre esa URL en tu navegador.

### Build para Producción

```bash
npm run build
```

## 📁 Estructura del Proyecto

```
Super-Salads-MockUp/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── history/         # Componentes del historial
│   │   ├── ingredients/     # Componentes de ingredientes
│   │   ├── lists/           # Componentes de listas
│   │   └── orders/          # Componentes de pedidos
│   ├── lib/                 # Configuración de Supabase
│   ├── pages/               # Vistas principales
│   ├── services/            # Servicios para interactuar con Supabase
│   └── App.jsx              # Componente principal
├── public/                  # Archivos estáticos
├── supabase_schema.sql      # Script SQL para crear tablas
└── SUPABASE_SETUP.md        # Documentación de configuración
```

## 🗄️ Base de Datos

El proyecto utiliza Supabase con las siguientes tablas:
- `ingredients` - Almacena los ingredientes/productos
- `lists` - Almacena las listas predefinidas
- `list_items` - Items dentro de cada lista
- `orders` - Almacena los pedidos
- `order_items` - Items dentro de cada pedido

## 📝 Funcionalidades Principales

### Gestión de Ingredientes
- Crear, editar y eliminar ingredientes
- Definir precio y unidad de medida
- Búsqueda y filtrado

### Listas Predefinidas
- Crear listas con múltiples productos
- Editar y eliminar listas
- Aplicar listas directamente al carrito de pedidos

### Realización de Pedidos
- Agregar productos manualmente con cantidades
- Cargar pedidos desde archivos Excel
- Descargar plantilla Excel con ingredientes actuales
- Aplicar listas predefinidas
- Visualizar carrito con totales

### Historial
- Ver todos los pedidos realizados
- Filtrar por ID o estado
- Ver detalles de cada pedido

## 🛠️ Tecnologías Utilizadas

- **React** - Biblioteca de UI
- **React Router** - Enrutamiento
- **Vite** - Build tool y dev server
- **Supabase** - Backend como servicio (BaaS)
- **XLSX** - Manejo de archivos Excel
- **Lucide React** - Iconos

## 📄 Licencia

Este proyecto es privado y pertenece a Super Salads.

## 👤 Autor

Desarrollado para Super Salads
