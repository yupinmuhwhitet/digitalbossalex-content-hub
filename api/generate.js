export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  try {
    const { type = 'carousel', pillar = 'authority', topic = '' } = req.body || {};
    const cleanedTopic = (topic || '').trim();

    const result = buildContent(type, pillar, cleanedTopic);

    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({
      error: {
        message: error.message || 'Server error'
      }
    });
  }
}

function buildContent(type, pillar, topic) {
  const topicLabel = topic || defaultTopics[pillar] || 'building a faceless brand';

  if (type === 'carousel') return buildCarousel(pillar, topicLabel);
  if (type === 'reel') return buildReel(pillar, topicLabel);
  if (type === 'static') return buildStatic(pillar, topicLabel);
  if (type === 'story') return buildStory(pillar, topicLabel);

  return buildCarousel(pillar, topicLabel);
}

const defaultTopics = {
  authority: 'why most faceless brands stay unclear',
  callout: 'the reason your content is not converting',
  value: 'how to make content actually lead to income',
  lifestyle: 'what changes when your brand has a real system',
  freebie: 'why your freebie should lead somewhere',
  workbook: 'why a structured brand system changes everything'
};

const pillarHooks = {
  authority: [
    'Your brand does not need more content. It needs more clarity.',
    'Most faceless brands are not failing because of effort. They are failing because of structure.',
    'If your brand feels scattered, the issue is almost never your potential.'
  ],
  callout: [
    'Your content is not underperforming by accident.',
    'If your audience is watching but not moving, something is off.',
    'You do not need more posts. You need better positioning.'
  ],
  value: [
    'The goal is not just to post. The goal is to lead people somewhere.',
    'Content should do more than look good. It should build trust and momentum.',
    'If your content is not creating movement, it is just decoration.'
  ],
  lifestyle: [
    'A real brand system changes more than your content. It changes your confidence.',
    'Everything feels lighter when your brand finally makes sense.',
    'The dream is not just pretty content. It is clarity, traction, and ease.'
  ],
  freebie: [
    'A freebie should not just collect names. It should build desire.',
    'Most freebies are too random to actually convert.',
    'Your free offer should be the first step in a bigger system.'
  ],
  workbook: [
    'What most brands call strategy is usually just guesswork in a cute font.',
    'The difference between a brand that grows and one that stalls is the system underneath it.',
    'When your brand has structure, everything starts working harder.'
  ]
};

const ctas = {
  authority: 'DM me SYSTEM if you want the structure behind this.',
  callout: 'If this hit a nerve, DM me SYSTEM and I will send you the next step.',
  value: 'Save this, then DM me WORKBOOK if you want the deeper framework.',
  lifestyle: 'If this is the kind of brand you want to build, DM me SYSTEM.',
  freebie: 'DM me FREE and I will send you the first step.',
  workbook: 'DM me WORKBOOK if you want the full system behind this.'
};

const visualDirections = {
  authority: 'Editorial, clean, minimal, elevated neutrals, gold accents, luxury strategy energy.',
  callout: 'Sharp contrast, clean cream background, bold text hierarchy, polished feminine business aesthetic.',
  value: 'Structured, educational, soft luxury palette, clean typography, high-end coaching brand feel.',
  lifestyle: 'Aspirational workspace, warm neutrals, soft morning light, feminine founder energy.',
  freebie: 'Polished lead magnet aesthetic, soft cream and blush palette, simple but premium.',
  workbook: 'Luxury system-builder aesthetic, strong layout, elevated beige and gold, premium digital product vibe.'
};

function pick(arr, seed) {
  const index = Math.abs(hashCode(seed)) % arr.length;
  return arr[index];
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function hashtags(pillar) {
  const map = {
    authority: '#facelessbrand #brandstrategy #digitalbossalex #contentstrategy #onlinebusiness #digitalproducts #passiveincome #facelessmarketing',
    callout: '#facelessbrand #contentstrategy #digitalmarketing #digitalbossalex #brandgrowth #onlineincome #facelessmarketing #instagramstrategy',
    value: '#contentstrategy #digitalbossalex #onlinebusiness #facelessbrand #marketingstrategy #digitalproducts #businesscontent #instagramgrowth',
    lifestyle: '#digitalbossalex #facelessbrand #onlinebusiness #passiveincome #digitalproducts #lifestylebusiness #brandbuilder #femininebusiness',
    freebie: '#leadmagnet #facelessbrand #digitalbossalex #onlinebusiness #emailgrowth #freebie #digitalmarketing #contentconversion',
    workbook: '#digitalproducts #facelessbrand #digitalbossalex #brandstrategy #onlinebusiness #contentstrategy #workbook #passiveincome'
  };
  return map[pillar] || map.authority;
}

function buildCarousel(pillar, topic) {
  const hook = pick(pillarHooks[pillar] || pillarHooks.authority, pillar + topic);

  return {
    hook,
    slides: [
      { role: 'Cover', text: hook },
      { role: 'Problem', text: `Most people struggle with ${topic.toLowerCase()} because they are building without a real system.` },
      { role: 'Reframe', text: `The fix is not more guessing. It is clarity, positioning, and a path that actually makes sense.` },
      { role: 'Value', text: `When your brand is structured properly, your content gets sharper, your audience trusts you faster, and your offers land better.` },
      { role: 'CTA', text: ctas[pillar] || ctas.authority }
    ],
    caption: `${hook}

Here is the part most people miss:

${capitalize(topic)} is rarely about effort alone.

Usually, the real issue is that the brand underneath the content is too loose.
No clear message.
No strategic positioning.
No real content path.
No conversion logic.

That is why things feel inconsistent, messy, or harder than they should.

When you build the structure first, everything changes:
your message gets clearer,
your content gets stronger,
and your audience knows what to do next.

This is exactly why I am so big on building a real brand system instead of posting randomly and hoping it clicks.

${ctas[pillar] || ctas.authority}`,
    hashtags: hashtags(pillar),
    visual_direction: visualDirections[pillar] || visualDirections.authority
  };
}

function buildReel(pillar, topic) {
  const hook = pick(pillarHooks[pillar] || pillarHooks.authority, 'reel' + pillar + topic);

  return {
    hook,
    text_overlays: [
      hook,
      `The problem is not just ${topic.toLowerCase()}.`,
      'It is the missing system underneath your content.',
      ctas[pillar] || ctas.authority
    ],
    voiceover: `${hook}

If you have been feeling stuck with ${topic.toLowerCase()}, I want you to know it is usually not because you are incapable.

Most of the time, the real issue is that the brand underneath your content is not structured enough yet.

When your message is unclear, your content has to work too hard.
When your positioning is weak, your audience stays passive.
When your offer path is messy, your conversions feel random.

The good news is this can be fixed.

When you build a real system behind your brand, your content starts making more sense, your audience connects faster, and growth starts feeling intentional instead of chaotic.

${ctas[pillar] || ctas.authority}`,
    caption: `${hook}

This is your reminder that ${topic.toLowerCase()} gets easier when the strategy underneath your brand is stronger.

You do not need more random effort.
You need a cleaner system.

${ctas[pillar] || ctas.authority}`,
    hashtags: hashtags(pillar),
    visual_direction: visualDirections[pillar] || visualDirections.authority,
    audio_direction: 'Confident, feminine, modern audio with clean momentum. Soft but strong.'
  };
}

function buildStatic(pillar, topic) {
  const hook = pick(pillarHooks[pillar] || pillarHooks.authority, 'static' + pillar + topic);

  return {
    hook,
    subtext: `A stronger perspective on ${topic.toLowerCase()}.`,
    caption: `${hook}

If your brand has been feeling unclear, inconsistent, or harder to grow than it should be, there is usually a deeper reason.

${capitalize(topic)} is not just a content issue.
It is a structure issue.

The stronger the system behind your brand, the easier it becomes to create clear content, attract the right people, and build momentum that actually lasts.

${ctas[pillar] || ctas.authority}`,
    hashtags: hashtags(pillar),
    visual_direction: visualDirections[pillar] || visualDirections.authority
  };
}

function buildStory(pillar, topic) {
  const hook = pick(pillarHooks[pillar] || pillarHooks.authority, 'story' + pillar + topic);

  return {
    hook,
    slides: [
      { role: 'Story 1', text: hook },
      { role: 'Story 2', text: `If you are struggling with ${topic.toLowerCase()}, the issue is usually not motivation. It is structure.` },
      { role: 'Story 3', text: ctas[pillar] || ctas.authority }
    ],
    caption: `${hook}

Quick reminder:
your content gets easier when your brand gets clearer.

${ctas[pillar] || ctas.authority}`,
    hashtags: hashtags(pillar),
    visual_direction: visualDirections[pillar] || visualDirections.authority
  };
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
