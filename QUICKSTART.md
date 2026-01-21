# ⚡ Quick Start - 5 Minuti al Deploy

Vuoi il tuo diario online in 5 minuti? Segui questi step!

## 🚀 Setup Rapido

### 1️⃣ Installa (1 minuto)
```bash
npm install
```

### 2️⃣ Configura OpenAI (1 minuto)

Crea file `.env.local`:
```env
OPENAI_API_KEY=sk-your-key-here
```

> 💡 Ottieni la key su: https://platform.openai.com/api-keys

### 3️⃣ Testa in locale (30 secondi)
```bash
npm run dev
```

Vai su http://localhost:3000 ✨

### 4️⃣ Deploy su Vercel (2 minuti)

**Opzione A - Via Web (più facile):**

1. Pusha su GitHub:
```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/TUO-USERNAME/giardino-di-gratitudine.git
   git push -u origin main
```

2. Vai su [vercel.com/new](https://vercel.com/new)
3. Importa il repository
4. Aggiungi `OPENAI_API_KEY` nelle environment variables
5. Clicca Deploy

**Opzione B - Via CLI (più veloce):**
```bash
npm i -g vercel
vercel login
vercel
# Aggiungi OPENAI_API_KEY quando richiesto
vercel --prod
```

## ✅ Fatto!

Il tuo diario è online! 🎉

---

📚 **Vuoi più dettagli?** Leggi [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)
