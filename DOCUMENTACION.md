# Documentación Completa del Sistema - Super Salads MockUp

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Instalación y Configuración](#instalación-y-configuración)
6. [Configuración de Base de Datos](#configuración-de-base-de-datos)
7. [Funcionalidades del Sistema](#funcionalidades-del-sistema)
8. [Arquitectura de Componentes](#arquitectura-de-componentes)
9. [Servicios y API](#servicios-y-api)
10. [Diseño Responsive](#diseño-responsive)
11. [Flujos de Usuario](#flujos-de-usuario)
12. [Manejo de Errores](#manejo-de-errores)
13. [Desarrollo](#desarrollo)
14. [Despliegue](#despliegue)
15. [Solución de Problemas](#solución-de-problemas)
16. [Mantenimiento](#mantenimiento)

---

## 📖 Descripción General

**Super Salads MockUp** es un sistema web de gestión de pedidos de ingredientes diseñado específicamente para Super Salads. El sistema permite gestionar ingredientes, crear listas predefinidas, realizar pedidos mediante múltiples métodos (manual, Excel, listas), y mantener un historial completo de todos los pedidos realizados.

### Características Principales

- ✅ **Gestión completa de ingredientes** con precios y unidades
- ✅ **Listas predefinidas** para pedidos recurrentes
- ✅ **Múltiples métodos de pedido**: manual, Excel, listas predefinidas
- ✅ **Historial completo** de pedidos con filtros
- ✅ **Diseño responsive** optimizado para web y mobile
- ✅ **Persistencia de datos** con Supabase
- ✅ **Interfaz intuitiva** y fácil de usar

---

## 🏗️ Arquitectura del Sistema

### Arquitectura General

El sistema sigue una arquitectura de **Single Page Application (SPA)** con las siguientes capas:

```
┌─────────────────────────────────────────┐
│         Capa de Presentación           │
│  (React Components + React Router)       │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Capa de Servicios               │
│  (Services Layer - Supabase Client)     │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Capa de Datos                  │
│  (Supabase PostgreSQL Database)        │
└─────────────────────────────────────────┘
```

### Flujo de Datos

1. **Usuario interactúa** con componentes React
2. **Componentes llaman** a servicios específicos
3. **Servicios comunican** con Supabase mediante cliente
4. **Supabase ejecuta** operaciones en PostgreSQL
5. **Datos retornan** a servicios y luego a componentes
6. **UI se actualiza** con los nuevos datos

---

## 🛠️ Tecnologías Utilizadas

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.2.0 | Biblioteca de UI y gestión de estado |
| **React Router DOM** | 7.9.6 | Enrutamiento y navegación |
| **Vite** | 7.2.4 | Build tool y dev server |
| **Lucide React** | 0.555.0 | Biblioteca de iconos |
| **XLSX** | 0.18.5 | Manejo de archivos Excel |

### Backend/Database

| Tecnología | Propósito |
|------------|-----------|
| **Supabase** | Backend como servicio (BaaS) |
| **PostgreSQL** | Base de datos relacional (via Supabase) |
| **Row Level Security (RLS)** | Seguridad a nivel de fila |

### Herramientas de Desarrollo

- **ESLint** - Linter para JavaScript/React
- **Git** - Control de versiones
- **Node.js** - Runtime de JavaScript

---

## 📁 Estructura del Proyecto

```
Super-Salads-MockUp/
├── public/                          # Archivos estáticos
│   ├── SS Logo.png                  # Logo de la aplicación
│   └── SS LOGO WEB.avif            # Logo optimizado
│
├── src/                             # Código fuente
│   ├── assets/                      # Recursos de la aplicación
│   │   └── react.svg
│   │
│   ├── components/                  # Componentes React
│   │   ├── Layout.jsx              # Layout principal con sidebar
│   │   ├── Sidebar.jsx              # Barra lateral de navegación
│   │   │
│   │   ├── history/                 # Componentes del historial
│   │   │   └── HistoryView.jsx      # Vista del historial de pedidos
│   │   │
│   │   ├── ingredients/            # Componentes de ingredientes
│   │   │   ├── IngredientList.jsx   # Lista de ingredientes
│   │   │   └── AddIngredientModal.jsx # Modal para agregar/editar
│   │   │
│   │   ├── lists/                   # Componentes de listas
│   │   │   ├── ListsView.jsx        # Vista de listas guardadas
│   │   │   └── ListBuilder.jsx      # Constructor de listas
│   │   │
│   │   └── orders/                  # Componentes de pedidos
│   │       ├── OrderView.jsx        # Vista principal de pedidos
│   │       ├── ProductGrid.jsx      # Grid/Lista de productos
│   │       ├── Cart.jsx             # Carrito de compras
│   │       ├── ExcelUploader.jsx    # Carga de archivos Excel
│   │       └── AddToCartModal.jsx   # Modal de agregar al carrito
│   │
│   ├── hooks/                       # Custom hooks
│   │   └── useMediaQuery.js         # Hook para detectar tamaño de pantalla
│   │
│   ├── lib/                         # Librerías y configuraciones
│   │   └── supabase.js              # Cliente de Supabase
│   │
│   ├── pages/                       # Páginas/Vistas principales
│   │   ├── Ingredients.jsx          # Página de ingredientes
│   │   ├── Lists.jsx                # Página de listas
│   │   ├── Order.jsx                # Página de pedidos
│   │   └── History.jsx              # Página de historial
│   │
│   ├── services/                    # Servicios de datos
│   │   ├── ingredientsService.js    # CRUD de ingredientes
│   │   ├── listsService.js          # CRUD de listas
│   │   └── ordersService.js         # CRUD de pedidos
│   │
│   ├── App.jsx                      # Componente raíz
│   ├── main.jsx                     # Punto de entrada
│   └── index.css                    # Estilos globales
│
├── .env                             # Variables de entorno (no commiteado)
├── .gitignore                       # Archivos ignorados por Git
├── eslint.config.js                 # Configuración de ESLint
├── index.html                       # HTML principal
├── package.json                     # Dependencias del proyecto
├── vite.config.js                   # Configuración de Vite
├── supabase_schema.sql              # Script SQL para crear tablas
├── SUPABASE_SETUP.md                # Guía de configuración de Supabase
├── README.md                        # Documentación básica
└── DOCUMENTACION.md                 # Este archivo
```

---

## ⚙️ Instalación y Configuración

### Requisitos Previos

- **Node.js** versión 16 o superior
- **npm** (incluido con Node.js)
- **Cuenta de Supabase** (gratuita)
- **Git** (opcional, para clonar el repositorio)

### Pasos de Instalación

#### 1. Clonar el Repositorio

```bash
git clone https://github.com/ramoz10/Super-Salads-MockUp.git
cd Super-Salads-MockUp
```

#### 2. Instalar Dependencias

```bash
npm install
```

Esto instalará todas las dependencias listadas en `package.json`.

#### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
```

**Nota:** Las variables deben comenzar con `VITE_` para que Vite las exponga al frontend.

#### 4. Configurar Base de Datos

Consulta el archivo `SUPABASE_SETUP.md` para instrucciones detalladas sobre cómo:
- Crear las tablas en Supabase
- Configurar las políticas RLS
- Insertar datos iniciales (opcional)

#### 5. Ejecutar en Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 🗄️ Configuración de Base de Datos

### Estructura de Tablas

#### Tabla: `ingredients`

Almacena todos los ingredientes/productos disponibles.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | BIGSERIAL | ID único (clave primaria) |
| `name` | VARCHAR(255) | Nombre del ingrediente |
| `unit` | VARCHAR(50) | Unidad de medida (kg, pz, L, etc.) |
| `price` | DECIMAL(10,2) | Precio unitario |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última actualización |

#### Tabla: `lists`

Almacena las listas predefinidas creadas por el usuario.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | BIGSERIAL | ID único (clave primaria) |
| `name` | VARCHAR(255) | Nombre de la lista |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última actualización |

#### Tabla: `list_items`

Relación entre listas e ingredientes con cantidades.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | BIGSERIAL | ID único (clave primaria) |
| `list_id` | BIGINT | Referencia a `lists.id` (FK) |
| `ingredient_id` | BIGINT | Referencia a `ingredients.id` (FK) |
| `quantity` | DECIMAL(10,2) | Cantidad del ingrediente |
| `created_at` | TIMESTAMP | Fecha de creación |

**Restricción:** `UNIQUE(list_id, ingredient_id)` - No puede haber duplicados.

#### Tabla: `orders`

Almacena los pedidos realizados.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | BIGSERIAL | ID único (clave primaria) |
| `order_number` | VARCHAR(50) | Número único del pedido (ej: ORD-001) |
| `status` | VARCHAR(50) | Estado: Pendiente, En Camino, Entregado |
| `total` | DECIMAL(10,2) | Total del pedido |
| `item_count` | DECIMAL(10,2) | Cantidad total de items |
| `date` | TIMESTAMP | Fecha del pedido |
| `created_at` | TIMESTAMP | Fecha de creación |

#### Tabla: `order_items`

Items individuales dentro de cada pedido.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | BIGSERIAL | ID único (clave primaria) |
| `order_id` | BIGINT | Referencia a `orders.id` (FK) |
| `ingredient_id` | BIGINT | Referencia a `ingredients.id` (FK, nullable) |
| `name` | VARCHAR(255) | Nombre del producto (snapshot) |
| `unit` | VARCHAR(50) | Unidad de medida (snapshot) |
| `price` | DECIMAL(10,2) | Precio al momento del pedido (snapshot) |
| `quantity` | DECIMAL(10,2) | Cantidad pedida |
| `created_at` | TIMESTAMP | Fecha de creación |

**Nota:** `ingredient_id` puede ser NULL si el ingrediente fue eliminado después del pedido. Los campos `name`, `unit`, y `price` son snapshots para mantener la integridad histórica.

### Relaciones

```
lists (1) ──< (N) list_items (N) >── (1) ingredients
orders (1) ──< (N) order_items (N) >── (1) ingredients (nullable)
```

### Índices

El esquema incluye índices para optimizar consultas:

- `idx_list_items_list_id` - Búsqueda rápida de items por lista
- `idx_list_items_ingredient_id` - Búsqueda rápida de listas por ingrediente
- `idx_order_items_order_id` - Búsqueda rápida de items por pedido
- `idx_order_items_ingredient_id` - Búsqueda rápida de pedidos por ingrediente
- `idx_orders_date` - Ordenamiento por fecha (DESC)
- `idx_orders_status` - Filtrado por estado

### Triggers

- **`update_updated_at_column()`**: Actualiza automáticamente `updated_at` cuando se modifica un registro en `ingredients` o `lists`.

### Políticas RLS (Row Level Security)

Actualmente configuradas para permitir todas las operaciones sin autenticación. **IMPORTANTE:** Debes actualizar estas políticas cuando agregues autenticación.

---

## 🎯 Funcionalidades del Sistema

### 1. Gestión de Ingredientes

**Ubicación:** `/ingredients`

**Funcionalidades:**
- ✅ Ver lista completa de ingredientes
- ✅ Crear nuevo ingrediente (nombre, unidad, precio)
- ✅ Editar ingrediente existente
- ✅ Eliminar ingrediente
- ✅ Buscar ingredientes por nombre
- ✅ Vista responsive (tabla en desktop, cards en mobile)

**Flujo:**
1. Usuario hace clic en "Ingredientes" en el sidebar
2. Ve la lista de ingredientes disponibles
3. Puede buscar, crear, editar o eliminar ingredientes
4. Los cambios se guardan automáticamente en Supabase

### 2. Listas Predefinidas

**Ubicación:** `/lists`

**Funcionalidades:**
- ✅ Crear nuevas listas con nombre personalizado
- ✅ Agregar múltiples ingredientes a una lista con cantidades
- ✅ Editar listas existentes
- ✅ Eliminar listas
- ✅ Ver preview de items en cada lista
- ✅ Aplicar lista directamente al carrito de pedidos

**Flujo:**
1. Usuario hace clic en "Listas" en el sidebar
2. Ve todas las listas guardadas
3. Puede crear nueva lista o editar existente
4. En el constructor de listas, selecciona ingredientes y define cantidades
5. Guarda la lista para uso futuro
6. Desde la página de pedidos, puede aplicar una lista directamente

### 3. Realizar Pedidos

**Ubicación:** `/order` (página por defecto)

**Métodos de Pedido:**

#### 3.1. Pedido Manual
- Seleccionar productos de la lista disponible
- Definir cantidad para cada producto
- Agregar al carrito
- Revisar y enviar pedido

#### 3.2. Carga desde Excel (Solo Desktop)
- Descargar plantilla Excel con ingredientes actuales
- Modificar cantidades en Excel
- Cargar archivo Excel
- Los productos se agregan automáticamente al carrito

**Formato Excel:**
| Nombre | Unidad | Cantidad |
|--------|--------|----------|
| Tomate Bola | kg | 5 |
| Lechuga Romana | pz | 10 |

#### 3.3. Aplicar Lista Predefinida
- Seleccionar lista del dropdown
- Hacer clic en "Aplicar Lista"
- Todos los items de la lista se agregan al carrito
- Si un producto ya está en el carrito, se suman las cantidades

**Carrito:**
- Ver todos los items agregados
- Modificar cantidades
- Eliminar items
- Ver subtotales y total general
- Enviar pedido

### 4. Historial de Pedidos

**Ubicación:** `/history`

**Funcionalidades:**
- ✅ Ver todos los pedidos realizados
- ✅ Filtrar por ID de pedido o estado
- ✅ Ver detalles: fecha, items, total, estado
- ✅ Ordenados por fecha (más recientes primero)
- ✅ Vista responsive (tabla en desktop, cards en mobile)

**Estados de Pedido:**
- 🟡 **Pendiente** - Pedido creado, esperando procesamiento
- 🔵 **En Camino** - Pedido en tránsito
- 🟢 **Entregado** - Pedido completado

---

## 🧩 Arquitectura de Componentes

### Componentes Principales

#### `App.jsx`
**Responsabilidad:** Componente raíz que maneja el routing y estado global.

**Estado:**
- `orderHistory` - Lista de pedidos
- `savedLists` - Lista de listas predefinidas
- `loading` - Estado de carga inicial

**Efectos:**
- Carga datos iniciales desde Supabase al montar
- Maneja el envío de pedidos y actualiza el historial

#### `Layout.jsx`
**Responsabilidad:** Layout principal con sidebar y área de contenido.

**Características:**
- Sidebar fijo en desktop
- Sidebar hamburguesa en mobile
- Overlay oscuro en mobile cuando sidebar está abierto
- Botón hamburguesa flotante en mobile

#### `Sidebar.jsx`
**Responsabilidad:** Navegación principal de la aplicación.

**Items de Navegación:**
- Ingredientes (`/ingredients`)
- Listas (`/lists`)
- Realizar Pedido (`/order`)
- Historial (`/history`)

**Comportamiento:**
- Resalta la ruta activa
- Cierra automáticamente en mobile al seleccionar opción

### Componentes de Pedidos

#### `OrderView.jsx`
**Responsabilidad:** Vista principal para realizar pedidos.

**Características:**
- Integra ProductGrid, Cart, ExcelUploader
- Maneja estado del carrito
- Aplica listas predefinidas
- Carrito modal en mobile, sidebar en desktop

#### `ProductGrid.jsx`
**Responsabilidad:** Mostrar productos disponibles para agregar al carrito.

**Vistas:**
- **Desktop:** Tabla con columnas (Producto, Unidad, Precio, Cantidad, Acción)
- **Mobile:** Cards horizontales compactas

**Funcionalidades:**
- Búsqueda de productos
- Input de cantidad por producto
- Botón de agregar al carrito

#### `Cart.jsx`
**Responsabilidad:** Carrito de compras.

**Funcionalidades:**
- Lista de items agregados
- Controles de cantidad (+/-)
- Eliminar items
- Cálculo de subtotales y total
- Botón de enviar pedido

**Vista Mobile:**
- Modal desde abajo
- Botón flotante con contador
- Diseño optimizado para pantallas pequeñas

#### `ExcelUploader.jsx`
**Responsabilidad:** Carga de pedidos desde archivos Excel.

**Características:**
- Descarga plantilla con ingredientes actuales
- Área de drag & drop
- Validación de formato
- Solo visible en desktop

### Componentes de Ingredientes

#### `IngredientList.jsx`
**Responsabilidad:** Gestión completa de ingredientes.

**Funcionalidades:**
- Lista de ingredientes
- Búsqueda y filtrado
- Crear, editar, eliminar
- Modal para agregar/editar

#### `AddIngredientModal.jsx`
**Responsabilidad:** Formulario para crear/editar ingredientes.

**Campos:**
- Nombre
- Unidad (dropdown: kg, pz, L, etc.)
- Precio

### Componentes de Listas

#### `ListsView.jsx`
**Responsabilidad:** Vista de listas guardadas.

**Funcionalidades:**
- Grid de listas
- Preview de items
- Editar y eliminar listas
- Crear nueva lista

#### `ListBuilder.jsx`
**Responsabilidad:** Constructor de listas.

**Características:**
- Nombre de lista
- Selección de ingredientes
- Definición de cantidades
- Vista previa de items agregados

### Componentes de Historial

#### `HistoryView.jsx`
**Responsabilidad:** Visualización del historial de pedidos.

**Funcionalidades:**
- Lista de pedidos
- Filtrado por ID o estado
- Vista responsive
- Información detallada de cada pedido

---

## 🔌 Servicios y API

### Arquitectura de Servicios

Los servicios actúan como capa de abstracción entre los componentes y Supabase, proporcionando métodos reutilizables para operaciones CRUD.

### `ingredientsService.js`

**Métodos:**

```javascript
// Obtener todos los ingredientes
getAll() → Promise<Ingredient[]>

// Obtener ingrediente por ID
getById(id: number) → Promise<Ingredient>

// Crear nuevo ingrediente
create(ingredient: {name, unit, price}) → Promise<Ingredient>

// Actualizar ingrediente
update(id: number, ingredient: {name, unit, price}) → Promise<Ingredient>

// Eliminar ingrediente
delete(id: number) → Promise<void>
```

**Ejemplo de uso:**
```javascript
import { ingredientsService } from '../services/ingredientsService';

// Obtener todos los ingredientes
const ingredients = await ingredientsService.getAll();

// Crear nuevo ingrediente
const newIngredient = await ingredientsService.create({
  name: 'Tomate Bola',
  unit: 'kg',
  price: 25.50
});
```

### `listsService.js`

**Métodos:**

```javascript
// Obtener todas las listas con sus items
getAll() → Promise<List[]>

// Obtener lista por ID con sus items
getById(id: number) → Promise<List>

// Crear nueva lista con items
create(list: {name, items: [{id, quantity}]}) → Promise<List>

// Actualizar lista y sus items
update(id: number, list: {name, items}) → Promise<List>

// Eliminar lista
delete(id: number) → Promise<void>
```

**Estructura de List:**
```javascript
{
  id: number,
  name: string,
  items: [
    {
      id: number,        // ingredient_id
      name: string,
      unit: string,
      price: number,
      quantity: number
    }
  ]
}
```

### `ordersService.js`

**Métodos:**

```javascript
// Obtener todos los pedidos con sus items
getAll() → Promise<Order[]>

// Obtener pedido por ID con sus items
getById(id: number) → Promise<Order>

// Crear nuevo pedido con items
create(order: {id?, status, total, itemCount, date, items}) → Promise<Order>

// Actualizar estado del pedido
updateStatus(id: number, status: string) → Promise<Order>

// Eliminar pedido
delete(id: number) → Promise<void>
```

**Estructura de Order:**
```javascript
{
  id: number,
  order_number: string,
  status: string,
  total: number,
  item_count: number,
  date: string,
  items: [
    {
      id: number,
      ingredient_id: number | null,
      name: string,
      unit: string,
      price: number,
      quantity: number
    }
  ]
}
```

### Manejo de Errores en Servicios

Todos los servicios lanzan errores descriptivos que deben ser capturados en los componentes:

```javascript
try {
  const ingredient = await ingredientsService.create(data);
} catch (error) {
  console.error('Error:', error.message);
  alert(`Error al crear ingrediente: ${error.message}`);
}
```

---

## 📱 Diseño Responsive

### Breakpoints

El sistema utiliza un breakpoint principal:
- **Mobile:** `max-width: 768px`
- **Desktop:** `> 768px`

### Hook: `useMediaQuery`

Hook personalizado para detectar el tamaño de pantalla:

```javascript
import { useMediaQuery } from '../hooks/useMediaQuery';

const isMobile = useMediaQuery('(max-width: 768px)');
```

### Adaptaciones Mobile

#### Sidebar
- **Desktop:** Sidebar fijo visible siempre
- **Mobile:** Sidebar oculto, accesible mediante botón hamburguesa

#### Productos
- **Desktop:** Tabla completa con todas las columnas
- **Mobile:** Cards horizontales compactas

#### Carrito
- **Desktop:** Sidebar fijo a la derecha
- **Mobile:** Modal desde abajo con botón flotante

#### Historial e Ingredientes
- **Desktop:** Tablas completas
- **Mobile:** Cards con información organizada

#### Excel Uploader
- **Desktop:** Visible y funcional
- **Mobile:** Oculto (no se muestra)

### Optimizaciones Mobile

- Tamaños de fuente reducidos
- Padding y márgenes optimizados
- Controles táctiles más grandes
- Navegación simplificada
- Carga de contenido optimizada

---

## 🔄 Flujos de Usuario

### Flujo 1: Crear un Pedido Manual

```
1. Usuario accede a "/order" (página por defecto)
   ↓
2. Ve lista de productos disponibles
   ↓
3. Busca producto (opcional)
   ↓
4. Ingresa cantidad deseada
   ↓
5. Hace clic en "Agregar"
   ↓
6. Producto aparece en el carrito
   ↓
7. Repite pasos 3-6 para más productos
   ↓
8. Revisa carrito y ajusta cantidades si es necesario
   ↓
9. Hace clic en "Enviar Pedido"
   ↓
10. Confirma el pedido
    ↓
11. Pedido se guarda en Supabase
    ↓
12. Carrito se limpia
    ↓
13. Pedido aparece en historial
```

### Flujo 2: Crear Pedido desde Excel

```
1. Usuario accede a "/order"
   ↓
2. Hace clic en "Descargar Plantilla"
   ↓
3. Se descarga Excel con ingredientes actuales
   ↓
4. Usuario abre Excel y modifica cantidades
   ↓
5. Guarda el archivo Excel
   ↓
6. Regresa a la aplicación
   ↓
7. Hace clic en área de carga de Excel
   ↓
8. Selecciona el archivo Excel modificado
   ↓
9. Sistema lee el archivo y busca coincidencias
   ↓
10. Productos se agregan automáticamente al carrito
    ↓
11. Usuario revisa y envía pedido
```

### Flujo 3: Usar Lista Predefinida

```
1. Usuario accede a "/order"
   ↓
2. Ve sección "Aplicar Lista Predefinida"
   ↓
3. Selecciona una lista del dropdown
   ↓
4. Hace clic en "Aplicar Lista"
   ↓
5. Todos los items de la lista se agregan al carrito
   ↓
6. Si hay productos duplicados, se suman cantidades
   ↓
7. Usuario puede agregar más productos manualmente
   ↓
8. Revisa y envía pedido
```

### Flujo 4: Crear Nueva Lista

```
1. Usuario accede a "/lists"
   ↓
2. Hace clic en "Nueva Lista"
   ↓
3. Ingresa nombre de la lista
   ↓
4. Busca y selecciona ingredientes
   ↓
5. Define cantidad para cada ingrediente
   ↓
6. Ve preview de items agregados
   ↓
7. Hace clic en "Guardar Lista"
   ↓
8. Lista se guarda en Supabase
   ↓
9. Lista aparece en la vista de listas
   ↓
10. Lista disponible para usar en pedidos
```

---

## ⚠️ Manejo de Errores

### Estrategia General

El sistema implementa manejo de errores en múltiples niveles:

1. **Nivel de Servicio:** Los servicios lanzan errores descriptivos
2. **Nivel de Componente:** Los componentes capturan y muestran errores al usuario
3. **Nivel de UI:** Mensajes claros y acciones sugeridas

### Tipos de Errores

#### Error de Configuración
**Causa:** Supabase no configurado  
**Mensaje:** Pantalla de configuración con instrucciones  
**Solución:** Configurar variables de entorno

#### Error de Red
**Causa:** Sin conexión o Supabase no disponible  
**Mensaje:** "Error al cargar datos: [mensaje]"  
**Solución:** Verificar conexión y credenciales

#### Error de Validación
**Causa:** Datos inválidos (ej: precio negativo)  
**Mensaje:** "Error al guardar: [mensaje específico]"  
**Solución:** Corregir datos ingresados

#### Error de Base de Datos
**Causa:** Violación de restricciones o políticas RLS  
**Mensaje:** Mensaje específico de Supabase  
**Solución:** Verificar políticas RLS y datos

### Ejemplo de Manejo de Errores

```javascript
try {
  const ingredient = await ingredientsService.create({
    name: '',
    unit: 'kg',
    price: -10
  });
} catch (error) {
  // Error capturado y mostrado al usuario
  console.error('Error:', error);
  alert(`Error al crear ingrediente: ${error.message}`);
}
```

---

## 💻 Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo (http://localhost:5173)

# Build
npm run build        # Crea build de producción en /dist

# Linting
npm run lint         # Ejecuta ESLint

# Preview
npm run preview      # Preview del build de producción
```

### Estructura de Código

#### Convenciones

- **Componentes:** PascalCase (`OrderView.jsx`)
- **Servicios:** camelCase (`ingredientsService.js`)
- **Hooks:** camelCase con prefijo `use` (`useMediaQuery.js`)
- **Archivos:** camelCase para servicios/hooks, PascalCase para componentes

#### Estilos

- **Inline Styles:** Se utilizan objetos de estilo inline para mayor flexibilidad
- **CSS Variables:** Definidas en `index.css` para temas y colores
- **Responsive:** Media queries y hooks para adaptación

#### Estado

- **Local State:** `useState` para estado de componentes
- **Global State:** Estado compartido en `App.jsx` y pasado como props
- **No hay Redux/Zustand:** Estado simple con React hooks

### Agregar Nueva Funcionalidad

#### Ejemplo: Agregar Categorías a Ingredientes

1. **Actualizar Schema:**
   ```sql
   ALTER TABLE ingredients ADD COLUMN category VARCHAR(100);
   ```

2. **Actualizar Servicio:**
   ```javascript
   // ingredientsService.js
   async create(ingredient) {
     // Incluir category en el insert
   }
   ```

3. **Actualizar Componente:**
   ```javascript
   // AddIngredientModal.jsx
   const [category, setCategory] = useState('');
   // Agregar campo en el formulario
   ```

4. **Actualizar UI:**
   - Agregar campo de categoría en el modal
   - Mostrar categoría en la lista

### Testing (Futuro)

Para agregar testing:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

---

## 🚀 Despliegue

### Build de Producción

```bash
npm run build
```

Esto genera una carpeta `dist/` con los archivos optimizados.

### Variables de Entorno en Producción

Asegúrate de configurar las variables de entorno en tu plataforma de hosting:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Opciones de Hosting

#### Vercel
1. Conecta tu repositorio de GitHub
2. Configura variables de entorno
3. Deploy automático en cada push

#### Netlify
1. Conecta repositorio
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Configura variables de entorno

#### GitHub Pages
1. Instala `gh-pages`: `npm install --save-dev gh-pages`
2. Agrega script: `"deploy": "npm run build && gh-pages -d dist"`
3. Ejecuta: `npm run deploy`

### Configuración de Supabase para Producción

1. **Actualizar políticas RLS** según necesidades de seguridad
2. **Configurar CORS** en Supabase Dashboard
3. **Revisar límites** de la cuenta gratuita
4. **Configurar backups** si es necesario

---

## 🔧 Solución de Problemas

### Problema: "Faltan las variables de entorno"

**Síntomas:**
- Pantalla de configuración al iniciar
- Error en consola sobre variables faltantes

**Solución:**
1. Verificar que existe archivo `.env` en la raíz
2. Verificar que las variables comienzan con `VITE_`
3. Reiniciar servidor de desarrollo después de crear/modificar `.env`

### Problema: Datos no se guardan

**Síntomas:**
- Operaciones CRUD no persisten
- Errores en consola del navegador

**Solución:**
1. Verificar políticas RLS en Supabase
2. Verificar credenciales en `.env`
3. Revisar consola del navegador para errores específicos
4. Verificar que las tablas existen en Supabase

### Problema: Excel no carga productos

**Síntomas:**
- Archivo Excel se carga pero no aparecen productos en carrito

**Solución:**
1. Verificar formato del Excel (Nombre, Unidad, Cantidad)
2. Verificar que los nombres coinciden exactamente con ingredientes
3. Revisar consola para errores de parsing
4. Verificar que el archivo es .xlsx o .xls

### Problema: Sidebar no funciona en mobile

**Síntomas:**
- Botón hamburguesa no aparece o no funciona

**Solución:**
1. Verificar que `useMediaQuery` está funcionando
2. Verificar que el breakpoint es 768px
3. Revisar estilos CSS que puedan estar ocultando el botón
4. Verificar z-index del botón (debe ser alto)

### Problema: Carrito no se muestra en mobile

**Síntomas:**
- Botón flotante no aparece
- Modal no se abre

**Solución:**
1. Verificar que hay items en el carrito (botón solo aparece si hay items)
2. Verificar z-index del modal
3. Revisar estilos del overlay
4. Verificar que `showCart` state se está actualizando

---

## 🔄 Mantenimiento

### Tareas Regulares

#### Semanal
- Revisar logs de errores en Supabase
- Verificar uso de almacenamiento
- Revisar pedidos pendientes

#### Mensual
- Actualizar dependencias: `npm update`
- Revisar y optimizar consultas lentas
- Backup de base de datos
- Revisar políticas de seguridad

#### Trimestral
- Auditoría de seguridad
- Revisión de código
- Optimización de rendimiento
- Actualización de documentación

### Actualizar Dependencias

```bash
# Verificar dependencias desactualizadas
npm outdated

# Actualizar dependencias menores
npm update

# Actualizar dependencias mayores (cuidado con breaking changes)
npm install package@latest
```

### Backup de Base de Datos

Supabase ofrece backups automáticos en planes pagos. Para backups manuales:

1. Exportar datos desde Supabase Dashboard
2. Ejecutar `pg_dump` si tienes acceso directo
3. Guardar backups en ubicación segura

### Monitoreo

#### Métricas a Monitorear

- **Rendimiento:** Tiempo de carga de páginas
- **Errores:** Frecuencia y tipos de errores
- **Uso:** Número de pedidos, ingredientes, listas
- **Almacenamiento:** Uso de espacio en Supabase

#### Herramientas Recomendadas

- **Supabase Dashboard:** Métricas de base de datos
- **Browser DevTools:** Performance y errores
- **Google Analytics:** Uso de la aplicación (opcional)

---

## 📚 Recursos Adicionales

### Documentación Externa

- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [XLSX Library](https://docs.sheetjs.com/)

### Archivos de Referencia

- `SUPABASE_SETUP.md` - Guía detallada de configuración
- `README.md` - Documentación básica del proyecto
- `supabase_schema.sql` - Esquema completo de base de datos

### Contacto y Soporte

Para problemas o preguntas sobre el sistema, consulta:
- Issues en GitHub: https://github.com/ramoz10/Super-Salads-MockUp/issues
- Documentación de Supabase para problemas de base de datos

---

## 📝 Changelog

### Versión Actual

**Última Actualización:** Diciembre 2024

#### Características Implementadas

- ✅ Sistema completo de gestión de ingredientes
- ✅ Sistema de listas predefinidas
- ✅ Realización de pedidos (manual, Excel, listas)
- ✅ Historial de pedidos
- ✅ Integración completa con Supabase
- ✅ Diseño responsive (web y mobile)
- ✅ Optimización de componentes para mejor UX
- ✅ Manejo de errores robusto

#### Próximas Mejoras (Roadmap)

- 🔲 Sistema de autenticación de usuarios
- 🔲 Roles y permisos
- 🔲 Notificaciones de pedidos
- 🔲 Exportación de reportes
- 🔲 Dashboard con estadísticas
- 🔲 Integración con sistemas de pago
- 🔲 App móvil nativa

---

## 📄 Licencia

Este proyecto es privado y pertenece a Super Salads. Todos los derechos reservados.

---

**Documentación generada:** Diciembre 2024  
**Versión del Sistema:** 1.0.0  
**Mantenido por:** Equipo de Desarrollo Super Salads

