import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Static routes - prerender for fast loading
  {
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'seafarers',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'seafarers/add',
    renderMode: RenderMode.Server
  },
  // Dynamic routes with parameters - use SSR on-demand
  {
    path: 'seafarers/edit/:id',
    renderMode: RenderMode.Server
  },
  // Fallback - client-side rendering
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
