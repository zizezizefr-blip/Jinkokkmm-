export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST فقط' });

  const KEY = process.env.GEMINI_KEY;
  if (!KEY) return res.status(500).json({ error: 'المفتاح غير مضبوط في إعدادات Vercel' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: (body.contents || []).slice(-10),
          systemInstruction: { parts: [{ text: 'أنت مساعد تعليمي خبير لطلبة علوم الطبيعة والحياة في الجامعات الجزائرية (LMD). أجب بالعربية الفصحى المبسطة، منظماً بإجابات علمية دقيقة مع نقاط الامتحان وأمثلة. إن كان السؤال خارج المجال أجب بإيجاز ثم اربطه بالأحياء إن أمكن.' }] }
        })
      }
    );
    const j = await r.json();
    if (j.error) return res.status(502).json({ error: j.error.message });
    const text = j.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
    res.status(200).json({ reply: text });
  } catch (e) {
    res.status(500).json({ error: 'تعذر الاتصال بالخدمة' });
  }
}# Jinkokkmm-
Bi hhhk
