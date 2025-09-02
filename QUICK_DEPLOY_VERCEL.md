
# ⚡ DEPLOYMENT RÁPIDO EN VERCEL - 5 MINUTOS

## 🚀 INSTRUCCIONES PASO A PASO

### PASO 1: Preparar Código (2 minutos)
```bash
cd /home/ubuntu/rossi-inventory

# Crear .gitignore si no existe
echo "node_modules
.next
.env.local
.vercel
*.log" > .gitignore

# Verificar que .env esté configurado
cat .env  # Debe mostrar DATABASE_URL de producción
```

### PASO 2: Subir a GitHub (1 minuto)
```bash
git init
git add .
git commit -m "Sistema Inventario Rossi - Producción Ready"

# Crear repositorio en GitHub: https://github.com/new
# Luego ejecutar:
git remote add origin https://github.com/TU_USUARIO/rossi-inventory.git
git branch -M main
git push -u origin main
```

### PASO 3: Deploy en Vercel (2 minutos)
1. Ir a **https://vercel.com** → Login con GitHub
2. Click **"New Project"**
3. Importar repositorio `rossi-inventory`
4. **NO cambiar configuraciones**, click **"Deploy"**

### PASO 4: Configurar Variables de Entorno
En el dashboard de Vercel → Settings → Environment Variables, agregar:

```bash
DATABASE_URL
postgresql://role_8ca3df80:5RjIZx4pPk5Hy5AxwMCGDoSbEWceYk7F@db-8ca3df80.db001.hosteddb.reai.io:5432/8ca3df80?connect_timeout=15

NEXTAUTH_URL
https://TU_PROYECTO.vercel.app

NEXTAUTH_SECRET
8f9a7e6d5c4b3a2918f7e6d5c4b3a29e8f7a6d5c4b3a2918f7e6d5c4b3a2918f7e6d5c4b3a29

COMPANY_NAME
Rossi

COMPANY_COUNTRY
Ecuador

DEFAULT_CURRENCY
USD

DEFAULT_TAX_RATE
15
```

### PASO 5: Redeploy
- Click **"Redeploy"** en Vercel

## ✅ VERIFICACIÓN

1. **URL:** https://tu-proyecto.vercel.app
2. **Login:** admin@rossi.com / admin123
3. **Verificar dashboard y módulos**

## 🎉 ¡LISTO EN 5 MINUTOS!

El Sistema de Inventario Rossi estará funcionando completamente en producción.
