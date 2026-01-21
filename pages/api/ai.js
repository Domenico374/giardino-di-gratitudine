import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, text, entries } = req.body;

  try {
    let prompt = '';
    
    switch (action) {
      case 'analyze':
        prompt = `Analizza questa entrata di un diario della gratitudine e fornisci un breve insight positivo (max 2 frasi) in italiano:

"${text}"

Sii caldo, empatico e incoraggiante.`;
        break;
        
      case 'suggest':
        prompt = `Suggerisci 3 cose specifiche per cui essere grati oggi, basandoti sul contesto italiano e sulla vita quotidiana. Sii concreto e personale. Rispondi solo con un elenco numerato.`;
        break;
        
      case 'weekly':
        const entriesText = entries.map(e => `- ${e.text}`).join('\n');
        prompt = `Crea un riassunto empatico e incoraggiante (max 4 frasi) di queste entrate di gratitudine della settimana:

${entriesText}

Evidenzia pattern positivi e crescita personale.`;
        break;
        
      case 'prompt':
        prompt = `Genera una domanda riflessiva profonda in italiano per aiutare qualcuno a trovare gratitudine nella propria vita. Sii creativo e specifico.`;
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Sei un assistente empatico e saggio che aiuta le persone a coltivare la gratitudine. Rispondi sempre in italiano con un tono caldo e incoraggiante."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const result = completion.choices[0].message.content;
    
    res.status(200).json({ result });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
}
