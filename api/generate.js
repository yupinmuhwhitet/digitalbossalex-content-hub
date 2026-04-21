export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  try {
    const { type = 'carousel', pillar = 'authority', topic = '' } = req.body || {};

    const prompt = buildPrompt(type, pillar, topic);

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1200,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      return res.status(anthropicRes.status).json({
        error: {
          message: data?.error?.message || 'Anthropic request failed',
          details: data
        }
      });
    }

    const raw = (data.content || []).map(item => item.text || '').join('').trim();
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

Respond ONLY with a valid JSON object. No markdown. No explanation outside JSON.`;

  const topicLine = topic
    ? `Specific topic/angle: ${topic}`
    : 'Choose the strongest, most relevant angle yourself.';

  const formats = {
    carousel: `Write a ${pillar} CAROUSEL post. ${topicLine}
JSON: {"hook":"","slides":[{"role":"","text":""}],"caption":"","hashtags":"","visual_direction":""}`,
    reel: `Write a ${pillar} REEL. ${topicLine}
JSON: {"hook":"","text_overlays":[""],"voiceover":"","caption":"","hashtags":"","visual_direction":"","audio_direction":""}`,
    static: `Write a ${pillar} STATIC post. ${topicLine}
JSON: {"hook":"","subtext":"","caption":"","hashtags":"","visual_direction":""}`,
    story: `Write a ${pillar} STORY sequence (3 stories). ${topicLine}
JSON: {"hook":"","slides":[{"role":"","text":""}],"caption":"","hashtags":"","visual_direction":""}`
  };

  return `${brand}\n\n${formats[type] || formats.carousel}`;
}
