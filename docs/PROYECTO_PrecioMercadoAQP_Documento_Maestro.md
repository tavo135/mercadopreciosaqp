# PROYECTO: PRECIO MERCADO AQP
## Plataforma de Precios Transparentes para Mercados de Arequipa

**Versión:** 2.0 — Documento Maestro  
**Fecha:** Agosto 2026  
**Autor:** Desarrollador Solo — Arequipa, Perú  
**Estado:** Borrador para desarrollo  

---

## 1. RESUMEN EJECUTIVO

PrecioMercadoAQP es una plataforma de información de precios de frutas y verduras en mercados abiertos de Arequipa. No vendemos productos. No manejamos dinero. No garantizamos calidad. Somos un tablero público de precios verificados por la comunidad.

**Promesa central:** *"Precios reales de mercados y campos de Arequipa, verificados por la comunidad."*

**Filosofía:** Empezar pequeño (1 mercado, 5 productos), crecer modular, incluir a quienes no tienen internet.

---

## 2. PROBLEMA

### El Dolor Actual
- La señora María va a San Camilo y no sabe si la papa a S/3.00 es cara o barata hasta que camina 3 puestos.
- El dueño de una pollería pierde 30 minutos cada mañana llamando a contactos para comparar precios de limón y cebolla.
- El agricultor de El Pedregal vende su papa a un acopiador a S/1.50 porque no sabe que en Rio Seco se vende a S/2.80.
- Los vendedores justos pierden clientes porque los compradores no pueden comparar antes de llegar.
- No existe una referencia de precios localizada, en tiempo real y gratuita para productos sueltos en mercados abiertos.

### Los Sustitutos Fallan
- Grupos de WhatsApp: precios enterrados en ruido, sin búsqueda ni historial.
- Caminar puesto por puesto: pierde tiempo, expone a tácticas de venta agresivas.
- Preguntar a un amigo: anecdótico, no sistemático.

---

## 3. SOLUCIÓN

### Núcleo: Tablero de Precios Público
Una aplicación web mobile-first que muestra precios actuales de frutas y verduras por mercado, actualizada diariamente por una red de reporteros comunitarios.

### Tres Modos de Compra (Productos)

| Modo | Elige el comprador? | Calidad | Uso |
|------|---------------------|---------|-----|
| **Primera** | ✅ Sí | Fresco, sin defectos | Cocina diaria, restaurantes |
| **Segunda** | ✅ Sí | Maduro, manchas leves, para hoy | Sopas, guisos, mermeladas |
| **Bolsa Rescate** | ❌ No | Mix aleatorio, puede incluir golpeado | Familias de bajo presupuesto, alimentación animal, compost |

**Regla de oro:** En Bolsa Rescate, el comprador acepta recibir lo que el vendedor empaca. Sin reclamos. Sin devoluciones.

### Inclusión Digital (Gente sin Internet)

| Método | Usuario | Cómo Funciona |
|--------|---------|---------------|
| **Proxy** | Vendedor sin smartphone | Su sobrino/hija/nieto maneja su perfil desde su teléfono |
| **Boletín Físico** | Comprador sin datos | Página A4 impresa pegada en la puerta del mercado, lunes y jueves |
| **Llamada Perdida** | Usuario con Nokia básico | Llama y cuelga. El sistema le devuelve la llamada con mensaje de voz grabado con los precios del día |
| **Nota de Voz WhatsApp** | Vendedor con wifi esporádico | Graba precios cuando tiene wifi. Nosotros transcribimos y publicamos |

---

## 4. USUARIOS OBJETIVO

### Primarios (Fase 1)
1. **Amas de casa (25–60 años)** — Quieren saber si les están cobrando caro.
2. **Dueños de pollerías/cevicherías** — Necesitan comparar precios de limón, cebolla y papa diariamente.
3. **Vendedores de mercado justos** — Quieren que los compradores encuentren sus precios competitivos.

### Secundarios (Fase 2+)
4. **Agricultores de zonas aledañas** — Quieren vender directo sin acopiadores.
5. **Ambulantes** — Necesitan saber dónde comprar la mercadería más barata para revender.
6. **Turistas y nuevos residentes** — No quieren ser "cogidos de turistas."

---

## 5. ALCANCE POR FASES (CRAWL → WALK → RUN)

### FASE 1: CRAWL (Semanas 1–4)
**"Sobrevivir en un mercado"**

- **Mercados:** 1 (San Camilo — más seguro para aprender)
- **Productos:** 5 (papa, cebolla, tomate, limón, palta)
- **Reporteros:** Tú solo + 1 vendedor de confianza
- **Tecnología:** Tablero web estático con formulario de subida de fotos
- **Inclusión:** Boletín físico en la puerta del mercado
- **Meta:** 50 visitas únicas, 20 precios reportados

### FASE 2: WALK (Meses 2–3)
**"Expandir con cuidado"**

- **Mercados:** 3 (San Camilo + Rio Seco + Acomare)
- **Productos:** 15
- **Reporteros:** 3 estudiantes UNSA + 5 vendedores verificados
- **Tecnología:** Panel de admin, reporteros con estrellas, WhatsApp Business
- **Inclusión:** Sistema de proxy para 3 vendedores sin smartphone
- **Meta:** 500 visitas/mes, 100 precios aprobados

### FASE 3: RUN (Mes 6+)
**"Conectar campo y ciudad"**

- **Mercados:** 10+ incluyendo mayoristas
- **Zonas rurales:** El Pedregal, Camaná (via contacto de transportista)
- **Productos:** 50+
- **Farmers:** 5 agricultores registrados vía proxy
- **Tecnología:** Alertas por Telegram, OCR automático, detección de anomalías
- **Meta:** 5,000 visitas/mes, ingresos por suscripción de vendedores verificados

### FASE 4: FUTURO (Año 2+)
- Cotahuasi, Chala (pescado), Moquegua — solo si existe un proxy humano confiable que viaje regularmente.
- Logística compartida (información de camiones, no operación de camiones).

---

## 6. ESTRATEGIA DE DATOS (EL PROBLEMA DIFÍCIL)

### Fuentes de Datos

| Fuente | Método | Costo | Frecuencia |
|--------|--------|-------|------------|
| **Caminatas del fundador** | Fotografiar etiquetas de precio | S/0 | 2x por semana |
| **Reporteros vecinos** | Jóvenes que caminan el mercado | S/30/semana o certificado | Sábados |
| **Vendedores verificados** | Actualizan su propio precio | S/0 | Diario |
| **WhatsApp Business** | Compradores envían foto de etiqueta | S/0 | Diario |
| **Voz/llamada perdida** | Dictan precios, transcribimos | S/30/mes (plan de llamadas) | Diario |
| **Gobierno (MIDAGRI)** | Scraping de referencia nacional | S/0 | Semanal |

### Control de Calidad de Datos (Anti-Engaño)

| Capa | Implementación |
|------|----------------|
| **Foto obligatoria** | Sin foto = sin publicación |
| **OCR gratuito** | Tesseract.js lee el número del precio de la foto |
| **Detección de imagen** | Google Vision API (gratis 1,000/mes) confirma que la foto es de una etiqueta real |
| **EXIF/Geolocalización** | La foto debe tener timestamp de hoy y GPS cerca del mercado |
| **Rango de precios** | Si reportan tomate a S/0.50 cuando el promedio es S/3.50, se marca como sospechoso |
| **Reputación del reportero** | 5 estrellas = auto-aprobación. Nuevos = revisión manual |
| **Reporte comunitario** | Botón "¿Este precio es falso?" — 3 reportes = ocultar |

### Flujo de Aprobación

1. Usuario envía foto de precio (web o WhatsApp).
2. IA verifica: ¿es foto real? ¿tiene números? ¿GPS coincide?
3. Si confianza > 80% → auto-aprobado.
4. Si confianza 50–80% → pendiente de revisión manual (tú, 5 minutos).
5. Si confianza < 50% → rechazado automáticamente.

---

## 7. ARQUITECTURA TÉCNICA

### Stack Tecnológico (Todo Gratis)

| Capa | Tecnología | Costo |
|------|-----------|-------|
| Framework | Next.js 14 (App Router) + TypeScript | S/0 |
| Estilos | Tailwind CSS | S/0 |
| Base de Datos | Supabase (PostgreSQL) | S/0 (500MB, 2M requests) |
| Autenticación | Supabase Auth (OTP por teléfono) | S/0 |
| Almacenamiento | Supabase Storage (fotos) | S/0 (1GB) |
| Hosting | Vercel (Hobby tier) | S/0 |
| OCR | Tesseract.js (navegador) | S/0 |
| Visión IA | Google Vision API | S/0 (1,000 req/mes) |
| Control de Versiones | Git + GitHub | S/0 |
| Dominio | .pe (más adelante) | ~S/40/año |

### Esquema de Base de Datos (Modular)

```sql
-- Mercados (empezar con 1, escalar a N)
create table markets (
  id uuid default gen_random_uuid() primary key,
  name text not null,              -- 'Mercado San Camilo'
  city text default 'Arequipa',
  type text default 'retail'       -- retail, wholesale, rural, fishing
    check (type in ('retail', 'wholesale', 'rural', 'fishing')),
  status text default 'active',
  created_at timestamp default now()
);

-- Productos (empezar con 5, escalar a N)
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,              -- 'Papa'
  category text                    -- 'tuberculo', 'fruta', 'verdura'
    check (category in ('tuberculo', 'fruta', 'verdura', 'otro')),
  unit text default 'kg',
  status text default 'active',
  created_at timestamp default now()
);

-- Precios (tabla central)
create table prices (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id),
  market_id uuid references markets(id),
  price_pen decimal(10,2) not null,
  unit text default 'kg',
  quality_tier text default 'primera'
    check (quality_tier in ('primera', 'segunda', 'rescate')),
  purchase_mode text default 'choice'
    check (purchase_mode in ('choice', 'surprise_bag', 'rescue')),
  source_type text default 'manual'
    check (source_type in ('manual', 'whatsapp', 'voice', 'vendor_self')),
  photo_url text,
  status text default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  reporter_name text,
  reporter_phone text,
  reporter_reputation int default 0, -- estrellas 0-5
  notes text,                        -- 'Puesto cerca de la sección de pollos'
  collected_at timestamp,            -- cuándo se vio el precio
  created_at timestamp default now()
);

-- Vendedores (con inclusión digital)
create table vendors (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text,
  stall_number text,
  market_id uuid references markets(id),

  -- Inclusión
  has_smartphone boolean default false,
  has_internet boolean default false,
  preferred_contact text default 'whatsapp'
    check (preferred_contact in ('whatsapp', 'voice_note', 'missed_call', 'proxy', 'physical')),

  -- Proxy (para quienes no tienen tecnología)
  proxy_name text,
  proxy_phone text,
  proxy_relationship text,           -- 'hija', 'sobrino', 'vecino'

  -- Ambulantes / sin puesto fijo
  vendor_type text default 'stall'
    check (vendor_type in ('stall', 'ambulante', 'farmer', 'fisher')),
  zone text,                         -- 'Puente Grau', 'Entrada Rio Seco'
  schedule text,                     -- 'Lun-Vie 8am-12pm'

  -- Zona rural
  town text,                         -- 'El Pedregal', 'Camana', null si es ciudad
  transport_contact text,            -- 'Moto Juan: 9XX XXX XXX'

  verified boolean default false,
  created_at timestamp default now()
);

-- Grabaciones de voz (para transcripción)
create table voice_recordings (
  id uuid default gen_random_uuid() primary key,
  vendor_id uuid references vendors(id),
  audio_url text,
  transcribed_text text,
  price_extracted decimal(10,2),
  processed boolean default false,
  created_at timestamp default now()
);
```

---

## 8. MODELO DE INGRESOS (FUTURO)

**Fases 1–2: Todo gratis.** Construir base de usuarios y datos.

| Fase | Servicio | Precio | Cuándo |
|------|----------|--------|--------|
| Mes 3 | **Insignia Vendedor Verificado** | S/20/mes | Check verde, prioridad en listados |
| Mes 4 | **Alertas de Precio** (WhatsApp/Telegram) | S/5/mes | "Avísame cuando el limón baje de S/4.00" |
| Mes 5 | **Dashboard para Restaurantes** | S/50/mes | Tendencias de precios, directorio de proveedores |
| Mes 6 | **Destacados / Oferta del Día** | S/30/semana | Banner en la página principal |

**El tablero de precios público permanece gratis para siempre.**

---

## 9. SEGURIDAD LEGAL Y DEL MERCADO

### Descargo de Responsabilidad (Visible en Todo el Sitio)

> **"PrecioMercadoAQP es una plataforma de información de precios. No vendemos productos, no garantizamos calidad, frescura ni inocuidad alimentaria. El comprador debe verificar peso, calidad e higiene directamente con el vendedor antes de pagar. Los precios mostrados son referenciales y pueden variar. En productos 'Bolsa Rescate' y 'Rescate', el comprador acepta recibir un mix sin elección de variedades, sin derecho a reclamo ni devolución."**

### Protocolo de Seguridad Física (Para Caminar Mercados)

| Regla | Implementación |
|-------|----------------|
| Vestimenta | Jeans viejos, polo descolorido, zapatillas gastadas. Sin mochila, sin reloj caro. |
| Fotos | Nunca fotografiar la cara del vendedor. Solo el producto + la etiqueta de precio. |
| Acompañante | Pagar S/20/día a un vendedor joven que camine contigo. Conoce quién es peligroso. |
| Discurso | Nunca digas "tengo una página web." Di: "Estoy haciendo una lista de precios para mi familia." |
| Rotación | No visitar el mismo puesto diariamente. Parece espionaje. |
| Dinero | Llevar S/50 en monedas y billetes pequeños. Si piden "tarifa", pagar y seguir. |
| Horario | Salir antes de las 10 AM. Los mercados se ponen tensos al calentar el día. |

### Cumplimiento Legal (Perú)

- **No se requiere licencia bancaria.** Somos un directorio de información, como OLX o un blog.
- **No procesamos pagos.** El comprador y vendedor intercambian Yape/Plin directamente.
- **Registro SUNAT:** Una vez que haya ingresos, registrar como persona natural con negocio independiente y emitir boletas de venta.
- **UIF/PSAV:** No aplica en Fase 1–2 porque no custodiamos fondos ni operamos como exchange.

---

## 10. GESTIÓN DE RIESGOS

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|------------|
| No hay suficientes datos | Alta | El fundador camina el mercado 2x/semana obligatoriamente hasta que haya reporteros. |
| Vendedores se niegan a participar | Media | Ofrecer visibilidad gratis primero. Cobrar solo cuando vean resultados. |
| Precios falsos / spam | Media | Foto obligatoria + IA + reputación de reporteros + reporte comunitario. |
| Competidor copia la idea | Baja | Nadie en Arequipa está haciendo esto bien. La velocidad es la defensa. |
| Robo en el mercado | Media | Vestimenta humilde, acompañante local, salir antes de 10 AM. |
| Reclamaciones por calidad | Media | Descargo claro, tres niveles de calidad transparentes, modo "Rescate" sin garantía. |
| Fundador se quema | Alta | Máximo 6 horas/semana en Fase 1. Si no es sostenible, no escalar. |

---

## 11. MAPA DE MERCADOS (AREQUIPA + REGIÓN)

### Fase 1: Arequipa Ciudad

| Mercado | Tipo | Prioridad | Notas |
|---------|------|-----------|-------|
| **San Camilo** | Retail / Turístico | 1 | Más seguro para aprender. Alto tráfico. |
| **Rio Seco** | Mayorista | 2 | Precios base para toda la ciudad. Más peligroso (madrugada, efectivo). |
| **Acomare** | Retail / Barrio | 3 | Vecinal, menos competitivo. |
| **Avelino** | Retail / Popular | 3 | Precios populares. |
| **Altiplano** | Retail / Residencial | 4 | Clientes de clase media. |
| **El Palomar** | Retail / Mixto | 4 | Mixto mayorista-retail. |
| **La Purisana** | Retail | 5 | Barrio tradicional. |
| **Mercado Fátima** | Retail | 5 | Zona universitaria. |

### Fase 2: Zonas Aledañas

| Zona | Productos | Distancia | Proxy / Contacto |
|------|-----------|-----------|------------------|
| **El Pedregal** | Cebolla, ajo, papa | 15 km | Mototaxista que viaja diariamente |
| **La Joya** | Ajo, cebolla, pallares | 50 km | Conductor de carga compartida |
| **Majes** | Espárragos, pimientos, alcachofa | 90 km | Cooperativa agraria |

### Fase 3: Regionales (Solo con Proxy Confiable)

| Zona | Productos | Distancia | Condición para Incluir |
|------|-----------|-----------|------------------------|
| **Camana** | Mango, limón, palta, uva | 180 km | Que exista un transportista que viaje semanalmente y reporte vía WhatsApp. |
| **Moquegua** | Limón, aceituna, maíz | 220 km | Mismo que arriba. |
| **Cusco (Valle Sagrado)** | Papa, quinua, maíz | 320 km | Solo si un comprador arequipeño hace viajes regulares. |
| **Cotahuasi** | Papa nativa, maíz | 12 h | **NO incluir en primer año.** Demasiado lejos, sin infraestructura digital. |
| **Chala** | Pescado fresco | Costa | **NO incluir en primer año.** Requiere precios a las 4 AM en el muelle. |

---

## 12. RUTA DE IMPLEMENTACIÓN (PRIMERAS 12 SEMANAS)

### Semana 1: Fundación
- [ ] Crear repositorio Git + proyecto Next.js + Supabase
- [ ] Diseñar esquema de base de datos (3 tablas iniciales)
- [ ] Desplegar página "Próximamente" en Vercel
- [ ] Comprar SIM Claro/Movistar para línea de voz

### Semana 2: Primer Mercado
- [ ] Caminar San Camilo 2 veces. Fotografiar 5 productos.
- [ ] Subir 10 precios manualmente al tablero.
- [ ] Imprimir y pegar 1 boletín físico en la puerta de San Camilo.
- [ ] Publicar en 1 grupo de Facebook de Arequipa.

### Semana 3: Producto Mínimo Viable
- [ ] Tablero funcional con búsqueda y filtro.
- [ ] Formulario de subida de precios (foto + datos).
- [ ] Panel de administrador (aprobar/rechazar).
- [ ] Grabar mensaje de voz para línea de llamada perdida.

### Semana 4: Lanzamiento Suave
- [ ] Publicar en 3 grupos de Facebook.
- [ ] Ofrecer "Vendedor Verificado Gratis por 1 mes" a 3 puestos.
- [ ] Recopilar feedback de 5 usuarios.
- [ ] Corregir bugs críticos.

### Semanas 5–8: Estabilización
- [ ] Agregar Rio Seco (mayorista).
- [ ] Reclutar 1 reportero estudiante (UNSA).
- [ ] Implementar sistema de reputación de reporteros.
- [ ] Agregar 5 productos más.

### Semanas 9–12: Crecimiento Controlado
- [ ] Agregar Acomare.
- [ ] Registrar primeros 3 vendedores con proxy (sin smartphone).
- [ ] Implementar OCR automático (Tesseract.js).
- [ ] Primer intento de monetización: ofrecer insignia verificada a 1 vendedor de prueba.

---

## 13. MÉTRICAS DE ÉXITO (90 DÍAS)

| Métrica | Objetivo | Cómo Medir |
|---------|----------|------------|
| Productos rastreados | 20+ | Conteo en base de datos |
| Mercados cubiertos | 3 | Conteo en base de datos |
| Precios aprobados | 200+ | Conteo en base de datos |
| Visitantes únicos | 1,000+ | Vercel Analytics (gratis) |
| Reporteros activos | 5+ | Conteo de usuarios que subieron precios |
| Vendedores verificados | 5+ | Conteo en base de datos |
| Precios via voz/llamada | 50+ | Conteo en tabla voice_recordings |
| Ingresos | S/0 (Fase 1–2) | — |

---

## 14. PRINCIPIOS NO NEGOCIABLES

1. **El tablero público es gratis para siempre.** Nunca se cobrará por ver precios.
2. **Nunca tocamos el dinero del comprador o vendedor.** Las transacciones son directas (Yape/Plin/efectivo).
3. **Nunca garantizamos calidad de producto.** Somos información, no inspectores.
4. **Inclusión digital es obligatoria.** Si una abuela de 70 años no puede usarlo, no está terminado.
5. **Empezar pequeño es obligatorio.** 1 mercado, 5 productos, 6 horas/semana. Si no funciona a esta escala, no funcionará a mayor escala.
6. **Seguridad física primero.** Ningún precio vale una paliza o un robo en San Camilo.

---

## 15. DEFINICIÓN DE TERMINADO (MVP)

El MVP está completo cuando:

1. Una ama de casa en Yanahuara puede abrir el sitio en su celular y ver el precio de hoy de la papa en San Camilo.
2. Un vendedor puede enviar una foto de su etiqueta de precio por WhatsApp y verla publicada en menos de 24 horas.
3. El fundador puede aprobar/rechazar precios desde su celular en menos de 5 minutos.
4. Una persona con un Nokia básico puede llamar, colgar, y recibir un mensaje de voz con los 5 precios del día.
5. Existe al menos 1 boletín físico impreso pegado en un mercado de Arequipa.

---

*"No construyas el puente antes de saber cruzar el río. Empieza con un mercado, cinco productos, y tu propia voz."*

**Documento preparado para desarrollo inmediato.**
