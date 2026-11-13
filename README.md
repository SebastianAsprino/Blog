# Blog de Sebastian Asprino

![Node.js >= 20](https://img.shields.io/badge/node.js-%3E%3D20-brightgreen)
![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue)
![Astro 5](https://img.shields.io/badge/astro-5-orange)

Blog personal estático publicado en **[blog.asprino.dev](https://blog.asprino.dev/)**, construido con
[Astro](https://astro.build) a partir de la plantilla [Fuwari](https://github.com/saicaca/fuwari)
(licencia MIT) y adaptado a mis necesidades: idioma español, perfil propio y analítica auto-hospedada.

## Características

- Sitio 100 % estático generado con Astro 5 y estilizado con Tailwind CSS.
- Transiciones entre páginas con [Swup](https://swup.js.org/) y modo claro / oscuro persistente.
- Búsqueda de texto completo en el cliente con [Pagefind](https://pagefind.app/) (índice generado en el build).
- Markdown extendido: admoniciones, tarjetas de repositorios de GitHub, fórmulas con KaTeX y bloques
  de código con [Expressive Code](https://expressive-code.com/) (números de línea, secciones plegables,
  botón de copiar e insignia de lenguaje).
- Tabla de contenidos, archivo por etiquetas y categorías, tiempo de lectura y paginación.
- Feed RSS (contenido sanitizado con `sanitize-html`), sitemap y `robots.txt` generados automáticamente.
- Datos estructurados JSON-LD y metadatos Open Graph / Twitter en cada entrada.
- Internacionalización de la interfaz (español por defecto; incluye traducciones de la plantilla).
- Analítica auto-hospedada con Umami y Rybbit.

## Stack

| Área | Tecnología |
| --- | --- |
| Framework | Astro 5 (salida estática) |
| UI interactiva | Svelte 5 (búsqueda, selector de tema, archivo) |
| Estilos | Tailwind CSS 3, Stylus, PostCSS |
| Contenido | Colecciones de contenido de Astro (Markdown + plugins remark/rehype) |
| Búsqueda | Pagefind |
| Calidad | TypeScript, `astro check`, Biome (lint + formato) |
| CI | GitHub Actions |

## Estructura del proyecto

```text
.
├── .github/workflows/   # CI: build + astro check (Node 22/23) y lint con Biome
├── public/              # Archivos estáticos servidos tal cual (favicon)
├── scripts/new-post.js  # Generador de entradas con frontmatter
├── src/
│   ├── assets/          # Imágenes optimizadas por Astro (banner, avatar)
│   ├── components/      # Componentes Astro/Svelte (navbar, tarjetas, widgets, controles)
│   ├── constants/       # Constantes de layout, temas e íconos
│   ├── content/
│   │   ├── posts/       # Entradas del blog en Markdown
│   │   └── spec/        # Páginas especiales (about.md)
│   ├── i18n/            # Claves y traducciones de la interfaz
│   ├── layouts/         # Layout base (head, analítica, scroll) y grilla principal
│   ├── pages/           # Rutas: inicio paginado, posts, archivo, about, RSS, robots.txt
│   ├── plugins/         # Plugins remark/rehype y de Expressive Code propios
│   ├── styles/          # CSS/Stylus global, markdown y transiciones
│   ├── types/           # Tipos de la configuración
│   ├── utils/           # Utilidades de contenido, fechas, URLs y ajustes
│   └── config.ts        # Configuración del sitio (título, perfil, banner, navegación)
├── astro.config.mjs     # Integraciones y pipeline de Markdown
└── biome.json           # Reglas de lint y formato
```

### Cómo fluye el contenido

1. Las entradas viven en `src/content/posts/` y se validan con el esquema Zod de `src/content/config.ts`.
2. Durante el build, `astro.config.mjs` aplica los plugins remark/rehype (matemáticas, directivas,
   admoniciones, tarjetas de GitHub, extracto y tiempo de lectura).
3. `src/pages/` genera las páginas estáticas, el feed RSS y el sitemap en `dist/`.
4. Pagefind indexa `dist/` para habilitar la búsqueda sin servidor.

## Requisitos

- Node.js 20 o superior
- pnpm 9 (el proyecto bloquea otros gestores con `only-allow pnpm`)

## Uso

```sh
pnpm install          # Instala dependencias
pnpm dev              # Servidor de desarrollo en http://localhost:4321
pnpm check            # Diagnóstico de tipos de Astro
pnpm lint             # Lint y correcciones con Biome
pnpm build            # Build de producción en ./dist + índice de Pagefind
pnpm preview          # Sirve el build localmente
pnpm new-post <slug>  # Crea src/content/posts/<slug>.md con el frontmatter base
```

### Frontmatter de una entrada

```yaml
---
title: Mi primera entrada
published: 2025-01-01
updated: 2025-01-15      # opcional
description: Resumen corto
image: ./portada.jpg     # opcional
tags: [Astro, Web]
category: Desarrollo
draft: false             # true la excluye del build de producción
lang: ''                 # solo si el idioma difiere del sitio
---
```

## Configuración

- `src/config.ts`: título, idioma, color del tema, banner, tabla de contenidos, enlaces de navegación y perfil.
- `astro.config.mjs`: URL pública del sitio (`site`) e integraciones.
- `src/layouts/Layout.astro`: scripts de analítica (Umami / Rybbit). Sus identificadores son públicos, no secretos.

## Integración continua

- **Build and Check** (`.github/workflows/build.yml`): instala con `pnpm install --frozen-lockfile`
  y ejecuta `astro check` y `astro build` en Node 22 y 23.
- **Code quality** (`.github/workflows/biome.yml`): `biome ci ./src`.

## Despliegue

`pnpm build` produce un sitio estático en `dist/` que se puede servir desde cualquier hosting
estático (el repositorio incluye `vercel.json` para Vercel). Antes de desplegar en otro dominio,
actualizá `site` en `astro.config.mjs`.

## Créditos y licencia

Basado en [Fuwari](https://github.com/saicaca/fuwari) de saicaca, distribuido bajo licencia MIT
(ver [`LICENSE`](LICENSE)). La imagen del banner pertenece a su autor, acreditado en el sitio.
