export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  try {
    const { type = 'carousel', pillar = 'authority', topic = '' } = req.body || {};
    const prompt = buildPrompt(type, pillar, topic);

    const openaiRes = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-5-mini',
        input: prompt
      })
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      return res.status(openaiRes.status).json({
        error: {
          message: data?.error?.message || 'OpenAI request failed',
          details: data
        }
      });
    }

    const raw =
      data.output_text ||
      (data.output || [])
        .flatMap(item => item.content || [])
        .map(item => item.text || '')
        .join('')
        .trim();

    const cleaned = raw.replace(/```json|```/gi, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      return res.status(500).json({
        error: {
          message: 'Model returned invalid JSON',
          details: raw
        }
      });
    }

    return res.status(200).json({ result: parsed });
  } catch (error) {
    return res.status(500).json({
      error: {
        message: error.message || 'Server error'
      }
    });
  }
}

function buildPrompt(type, pillar, topic) {
  const brand = `You are writing content for Digital Boss Alex (@digitalbossalex) — a premium feminine faceless brand on Instagram.

BRAND VOICE: Confident, warm, sharp, aspirational. Never robotic or fluffy.
AUDIENCE: Women wanting to build scalable online income through content and digital products.
FREEBIE: The Ultimate Faceless Brand Playbook (free)
PAID OFFER: The Faceless Brand Operating System — 8 premium workbooks (Brand Identity, Positioning, Content Pillars, Content Architecture, Offer Ladder, Launch Planner, Conversion System, Start Here Guide) — $26, down from $37, early buyers get future vault additions free.
TONE: Feminine but sharp. Motivating but real. Premium without sounding fake.
NEVER: Use hustle culture language, generic guru phrases, or weak CTAs.
DM triggers: "SYSTEM", "WORKBOOK", "FREE"

Return ONLY valid JSON. No markdown. No backticks. No explanation.`;

  const topicLine = topic
    ? `Specific topic/angle: ${topic}`
    : 'Choose the strongest, most relevant angle yourself.';

  const formats = {
    carousel: `Write an Instagram ${pillar} CAROUSEL. ${topicLine}
Return JSON exactly in this shape:
{
  "hook": "string",
  "slides": [
    { "role": "Cover", "text": "string" },
    { "role": "Problem", "text": "string" },
    { "role": "Reframe", "text": "string" },
    { "role": "Value", "text": "string" },
    { "role": "CTA", "text": "string" }
  ],
  "caption": "string",
  "hashtags": "#tag1 #tag2 #tag3 #tag4 #tag5 #tag6 #tag7 #tag8",
  "visual_direction": "string"
}`,
    reel: `Write an Instagram ${pillar} REEL. ${topicLine}
Return JSON exactly in this shape:
{
  "hook": "string",
  "text_overlays": ["string", "string", "string", "string"],
  "voiceover": "string",
  "caption": "string",
  "hashtags": "#tag1 #tag2 #tag3 #tag4 #tag5 #tag6 #tag7 #tag8",
  "visual_direction": "string",
  "audio_direction": "string"
}`,
    static: `Write an Instagram ${pillar} STATIC POST. ${topicLine}
Return JSON exactly in this shape:
{
  "hook": "string",
  "subtext": "string",
  "caption": "string",
  "hashtags": "#tag1 #tag2 #tag3 #tag4 #tag5 #tag6 #tag7 #tag8",
  "visual_direction": "string"
}`,
    story: `Write an Instagram ${pillar} STORY sequence. ${topicLine}
Return JSON exactly in this shape:
{
  "hook": "string",
  "slides": [
    { "role": "Story 1", "text": "string" },
    { "role": "Story 2", "text": "string" },
    { "role": "Story 3", "text": "string" }
  ],
  "caption": "string",
  "hashtags": "#tag1 #tag2 #tag3 #tag4 #tag5 #tag6 #tag7 #tag8",
  "visual_direction": "string"
}`
  };

  return `${brand}\n\n${formats[type] || formats.carousel}`;
}
