# 🌱 Giardino di Gratitudine

Un'applicazione web elegante e interattiva per coltivare la gratitudine quotidiana, potenziata dall'intelligenza artificiale.

![Preview](https://img.shields.io/badge/Next.js-14.0.4-black?style=for-the-badge&logo=next.js)
![Preview](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Preview](https://img.shields.io/badge/OpenAI-API-412991?style=for-the-badge&logo=openai)

## ✨ Caratteristiche

- **📝 Scrittura Giornaliera**: Registra le tue gratitudini con un'interfaccia calda e accogliente
- **🤖 AI-Powered Insights**: Ricevi analisi empatiche delle tue entrate tramite GPT-4
- **💡 Suggerimenti Intelligenti**: L'AI ti suggerisce cose per cui essere grato
- **💭 Prompt di Riflessione**: Domande quotidiane per stimolare la gratitudine
- **📊 Riassunti Settimanali**: Visualizza i pattern positivi nella tua settimana
- **🎨 Design Elegante**: Interfaccia con palette terrosa e animazioni fluide
- **📱 Responsive**: Perfetto su desktop, tablet e mobile
- **💾 Storage Locale**: I tuoi dati restano privati nel browser

## 🚀 Quick Start

### Prerequisiti

- Node.js 18+ installato
- Un account OpenAI con API key
- Un account GitHub
- Un account Vercel (gratuito)

### Installazione Locale

1. **Clona il repository**
```bash
   git clone https://github.com/tuo-username/giardino-di-gratitudine.git
   cd giardino-di-gratitudine
```

2. **Installa le dipendenze**
```bash
   npm install
```

3. **Configura le variabili d'ambiente**
   
   Crea un file `.env.local` nella root del progetto:
```env
   OPENAI_API_KEY=your_openai_api_key_here
```

4. **Avvia il server di sviluppo**
```bash
   npm run dev
```

5. **Apri il browser**
   
   Vai su [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy su Vercel

### Metodo 1: Deploy Automatico da GitHub

1. **Pusha il codice su GitHub**
```bash
   git init
   git add .
   git commit -m "Initial commit - Giardino di Gratitudine"
   git branch -M main
   git remote add origin https://github.com/tuo-username/giardino-di-gratitudine.git
   git push -u origin main
```

2. **Importa su Vercel**
   - Vai su [vercel.com](https://vercel.com)
   - Clicca "New Project"
   - Importa il tuo repository GitHub
   - Vercel rileverà automaticamente che è un progetto Next.js

3. **Configura le variabili d'ambiente**
   - Nel dashboard Vercel, vai su "Settings" > "Environment Variables"
   - Aggiungi:
     - Name: `OPENAI_API_KEY`
     - Value: la tua OpenAI API key
   - Clicca "Save"

4. **Deploy!**
   - Clicca "Deploy"
   - Attendi qualche minuto
   - Il tuo diario sarà live! 🎉

### Metodo 2: Deploy Rapido CLI
```bash
# Installa Vercel CLI
npm i -g vercel

# Deploy
vercel

# Segui le istruzioni e aggiungi la OPENAI_API_KEY quando richiesto
```

## 🔑 Ottenere l'API Key di OpenAI

1. Vai su [platform.openai.com](https://platform.openai.com)
2. Crea un account o accedi
3. Vai su "API Keys"
4. Clicca "Create new secret key"
5. Copia la chiave (la vedrai solo una volta!)
6. Aggiungi credito al tuo account OpenAI se necessario

⚠️ **Importante**: Non committare mai la tua API key nel repository!

## 📦 Struttura del Progetto
```
giardino-di-gratitudine/
├── pages/
│   ├── api/
│   │   └── ai.js              # API route per OpenAI
│   ├── _app.js                # Setup Next.js
│   ├── _document.js           # HTML document
│   └── index.js               # Pagina principale
├── styles/
│   └── globals.css            # Stili globali + animazioni
├── public/                    # Asset statici
├── .env.example               # Template variabili d'ambiente
├── .gitignore                 # File da ignorare
├── next.config.js             # Configurazione Next.js
├── package.json               # Dipendenze
├── postcss.config.js          # PostCSS config
├── tailwind.config.js         # Tailwind + colori custom
└── README.md                  # Questo file
```

## 🎨 Personalizzazione

### Colori

Modifica `tailwind.config.js` per cambiare la palette:
```js
colors: {
  sand: { /* tonalità neutre */ },
  terracotta: { /* accento caldo */ },
  sage: { /* accento naturale */ },
}
```

### Font

I font sono definiti in `styles/globals.css`:
- **Crimson Pro**: Font serif per testo ed entrate
- **Karla**: Font sans-serif per UI

Puoi cambiarli modificando l'import Google Fonts.

### Animazioni

Le animazioni sono definite in `styles/globals.css`:
- `fadeIn`: Dissolvenza in entrata
- `slideInRight`: Scorrimento laterale
- Stagger delays: `.stagger-1`, `.stagger-2`, etc.

## 🔧 Funzionalità AI

L'applicazione usa GPT-4 per 4 funzioni principali:

1. **Analyze**: Analisi empatica di ogni entrata
2. **Suggest**: Suggerimenti di gratitudine personalizzati
3. **Weekly**: Riassunto settimanale con pattern
4. **Prompt**: Domande di riflessione quotidiana

Tutte le chiamate API sono gestite in `pages/api/ai.js`.

## 📱 Storage dei Dati

I dati sono salvati in `localStorage` del browser, quindi:
- ✅ Privacy completa (nessun server)
- ✅ Accesso offline dopo il primo caricamento
- ⚠️ Specifico per browser/dispositivo
- ⚠️ Cancellati se pulisci la cache

Per un storage persistente multi-dispositivo, considera di aggiungere:
- Supabase
- Firebase
- MongoDB Atlas

## 🤝 Contribuire

I contributi sono benvenuti! Sentiti libero di:
- Aprire issue per bug o feature request
- Fare fork e submit pull request
- Suggerire miglioramenti al design

## 📄 Licenza

Questo progetto è open source e disponibile sotto licenza MIT.

## 💚 Supporto

Se trovi utile questo progetto:
- ⭐ Dai una stella su GitHub
- 🐛 Segnala bug
- 💡 Suggerisci nuove funzionalità
- 📢 Condividilo con chi potrebbe beneficiarne

## 🙏 Credits

Creato con ❤️ per aiutare le persone a coltivare la gratitudine nella vita quotidiana.

---

**Ricorda**: La gratitudine trasforma ciò che abbiamo in abbastanza. 🌱
