import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [aiInsight, setAiInsight] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState('');
  const [reflectionPrompt, setReflectionPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('today');
  const [weeklyInsight, setWeeklyInsight] = useState('');

  // Carica entries dal localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gratitude-entries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
    generateReflectionPrompt();
  }, []);

  // Salva entries nel localStorage
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('gratitude-entries', JSON.stringify(entries));
    }
  }, [entries]);

  const callAI = async (action, data = {}) => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...data }),
      });
      const result = await response.json();
      setLoading(false);
      return result.result;
    } catch (error) {
      console.error('AI call error:', error);
      setLoading(false);
      return null;
    }
  };

  const addEntry = async () => {
    if (!newEntry.trim()) return;

    const entry = {
      id: Date.now(),
      text: newEntry,
      date: new Date().toISOString(),
      insight: '',
    };

    setEntries([entry, ...entries]);
    
    // Ottieni insight dall'AI
    const insight = await callAI('analyze', { text: newEntry });
    if (insight) {
      entry.insight = insight;
      setEntries([entry, ...entries]);
      setAiInsight(insight);
    }
    
    setNewEntry('');
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const getSuggestions = async () => {
    const suggestions = await callAI('suggest');
    setAiSuggestions(suggestions);
  };

  const generateReflectionPrompt = async () => {
    const prompt = await callAI('prompt');
    setReflectionPrompt(prompt);
  };

  const generateWeeklySummary = async () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekEntries = entries.filter(e => new Date(e.date) > weekAgo);
    
    if (weekEntries.length === 0) {
      setWeeklyInsight('Non ci sono abbastanza entrate questa settimana per generare un riassunto.');
      return;
    }
    
    const summary = await callAI('weekly', { entries: weekEntries });
    setWeeklyInsight(summary);
  };

  const getTodayEntries = () => {
    const today = new Date().toDateString();
    return entries.filter(e => new Date(e.date).toDateString() === today);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('it-IT', options);
  };

  return (
    <>
      <Head>
        <title>Giardino di Gratitudine</title>
        <meta name="description" content="Il tuo giardino personale per coltivare la gratitudine" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen py-8 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <motion.header 
            className="text-center mb-12 animate-fade-in"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-sand-900 mb-3">
              Giardino di Gratitudine
            </h1>
            <p className="text-xl text-sand-600 font-serif italic">
              Coltiva la gioia, raccogli i frutti della gratitudine
            </p>
          </motion.header>

          {/* Reflection Prompt */}
          {reflectionPrompt && (
            <motion.div 
              className="glass-card rounded-2xl p-6 mb-8 border-l-4 border-sage-400 animate-slide-in"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💭</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sage-800 mb-2">Riflessione del giorno</h3>
                  <p className="text-sand-700 leading-relaxed font-serif">{reflectionPrompt}</p>
                </div>
                <button
                  onClick={generateReflectionPrompt}
                  className="flex-shrink-0 text-sage-600 hover:text-sage-800 transition-colors"
                  disabled={loading}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}

          {/* New Entry Card */}
          <motion.div 
            className="glass-card rounded-2xl p-6 md:p-8 mb-8 stagger-1 opacity-0 animate-slide-in"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-sand-900 mb-4 flex items-center gap-2">
              <span className="text-3xl">✨</span>
              Per cosa sei grato oggi?
            </h2>
            
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="Scrivi qui la tua gratitudine del giorno..."
              className="w-full h-32 p-4 rounded-xl border-2 border-sand-200 focus:border-terracotta-400 focus:outline-none resize-none bg-white/50 text-sand-900 font-serif text-lg transition-all"
              disabled={loading}
            />
            
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={addEntry}
                className="btn-primary flex items-center gap-2"
                disabled={loading || !newEntry.trim()}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Salvando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Aggiungi Gratitudine
                  </>
                )}
              </button>
              
              <button
                onClick={getSuggestions}
                className="btn-secondary flex items-center gap-2"
                disabled={loading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Suggerimenti AI
              </button>
            </div>

            {/* AI Insight */}
            <AnimatePresence>
              {aiInsight && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-terracotta-50 border-l-4 border-terracotta-400 rounded-r-xl"
                >
                  <p className="text-terracotta-900 font-serif italic">{aiInsight}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Suggestions */}
            <AnimatePresence>
              {aiSuggestions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-sage-50 border-l-4 border-sage-400 rounded-r-xl"
                >
                  <h4 className="font-semibold text-sage-800 mb-2">💡 Suggerimenti:</h4>
                  <div className="text-sage-900 whitespace-pre-line font-serif">
                    {aiSuggestions}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 stagger-2 opacity-0 animate-slide-in">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'today'
                  ? 'bg-terracotta-500 text-white shadow-md'
                  : 'bg-white/60 text-sand-700 hover:bg-white'
              }`}
            >
              Oggi ({getTodayEntries().length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-terracotta-500 text-white shadow-md'
                  : 'bg-white/60 text-sand-700 hover:bg-white'
              }`}
            >
              Tutte ({entries.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('weekly');
                generateWeeklySummary();
              }}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'weekly'
                  ? 'bg-terracotta-500 text-white shadow-md'
                  : 'bg-white/60 text-sand-700 hover:bg-white'
              }`}
            >
              Settimana
            </button>
          </div>

          {/* Weekly Insight */}
          {activeTab === 'weekly' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6 mb-8"
            >
              <h3 className="text-2xl font-bold text-sand-900 mb-4 flex items-center gap-2">
                <span className="text-3xl">📊</span>
                Riassunto Settimanale
              </h3>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <svg className="animate-spin h-8 w-8 text-terracotta-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              ) : weeklyInsight ? (
                <p className="text-sand-700 font-serif text-lg leading-relaxed">{weeklyInsight}</p>
              ) : (
                <p className="text-sand-500 italic">Generazione del riassunto...</p>
              )}
            </motion.div>
          )}

          {/* Entries List */}
          <div className="space-y-4 stagger-3 opacity-0 animate-slide-in">
            <AnimatePresence>
              {(activeTab === 'today' ? getTodayEntries() : activeTab === 'all' ? entries : []).map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="entry-card hover:shadow-lg from-terracotta-400 to-terracotta-600"
                >
                  <div className="flex justify-between items-start mb-3">
                    <time className="text-sm text-sand-500 font-medium">
                      {formatDate(entry.date)}
                    </time>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-sand-400 hover:text-terracotta-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <p className="text-sand-900 font-serif text-lg leading-relaxed mb-3">
                    {entry.text}
                  </p>
                  
                  {entry.insight && (
                    <div className="mt-4 pt-4 border-t border-sand-200">
                      <p className="text-terracotta-700 text-sm italic font-serif">
                        💫 {entry.insight}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {(activeTab === 'today' ? getTodayEntries() : activeTab === 'all' ? entries : []).length === 0 && activeTab !== 'weekly' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">🌱</div>
                <p className="text-sand-500 text-lg font-serif">
                  {activeTab === 'today' 
                    ? 'Non hai ancora scritto nulla oggi. Inizia il tuo viaggio di gratitudine!' 
                    : 'Il tuo diario è vuoto. Aggiungi la tua prima gratitudine!'}
                </p>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <footer className="mt-16 text-center text-sand-500 text-sm stagger-4 opacity-0 animate-fade-in">
            <p>💚 Ogni giorno è un'opportunità per essere grati</p>
          </footer>
        </div>
      </div>
    </>
  );
}
