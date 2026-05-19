# shōrAI Consulting — Site Web

Site vitrine de **SHOURAI CONSULTING OÜ** — Conseil IA opérationnel pour PME & ETI.

## Stack technique

- **React 18** + **Vite 6**
- **EmailJS** pour les formulaires de contact
- Déploiement via **Vercel**

## Déploiement rapide

### 1. Créer le repo GitHub

```bash
git init
git add .
git commit -m "Initial commit - shōrAI Consulting website"
git branch -M main
git remote add origin https://github.com/diops-dev/shorai-website.git
git push -u origin main
```

### 2. Déployer sur Vercel

1. Aller sur [vercel.com](https://vercel.com) → Sign up with GitHub
2. Cliquer **"Add New Project"**
3. Sélectionner le repo `shorai-website`
4. Vercel détecte automatiquement Vite → cliquer **Deploy**
5. Le site est live en ~60 secondes

### 3. Connecter le domaine `shorai-group.com`

Dans Vercel → Settings → Domains → Ajouter `shorai-group.com` et `www.shorai-group.com`

Vercel vous donnera les DNS records à configurer :
- Type **A** → `76.76.21.21`
- Type **CNAME** `www` → `cname.vercel-dns.com`

### 4. Configurer EmailJS

1. Créer un compte sur [emailjs.com](https://www.emailjs.com)
2. Ajouter un **Email Service** (Gmail, Outlook...)
3. Créer un **Email Template** avec ces variables :
   - `{{from_name}}` — nom de l'expéditeur
   - `{{from_email}}` — email de l'expéditeur
   - `{{to_email}}` — contact@shorai-group.com
   - `{{to_name}}` — shōrAI
   - `{{message}}` — contenu du message
4. Remplir les 3 clés dans `src/App.jsx` → `CONFIG.emailjs`

## Développement local

```bash
npm install
npm run dev
```

## Structure

```
├── public/
│   └── logo_shorai.png      # Logo officiel (à ajouter manuellement)
├── src/
│   ├── App.jsx               # Site complet (composant unique)
│   └── main.jsx              # Point d'entrée React
├── index.html                # HTML avec meta SEO
├── package.json
├── vite.config.js
├── vercel.json               # Config SPA routing
└── README.md
```
