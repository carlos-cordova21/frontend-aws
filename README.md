# Frontend AWS - Zero Trust & Defense in Depth Portal

Frontend web desarrollado con **React + Vite** y servido mediante **Nginx** en la DMZ / VPC Pública en AWS.

## Características
- Portal de autenticación continua Zero Trust.
- Integración segura con Reverse Proxy Nginx hacia la VPC Backend privada.
- Dashboard de métricas de seguridad y validación de tokens JWT.
- Cabeceras de seguridad reforzadas (Content-Security-Policy, Permissions-Policy, HSTS-ready).

## Desarrollo Local
```bash
npm install
npm run dev
```

## Build de Producción
```bash
npm run build
```
Los archivos estáticos generados en `dist/` se despliegan en `/var/www/html` de la instancia EC2 Frontend.
