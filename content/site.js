/**
 * Every piece of editable copy on the site lives here.
 *
 * Swap text, add a project, drop a new image into /public/work and point at it
 * — nothing in components/ needs touching to change what the site says.
 */

export const positioning = {
  eyebrow: 'Brand Strategy · Visual Identity · UX/UI · Apps & Systems',
  headline: ['Distinctive', 'design for every', 'touchpoint.'],
  intro:
    'Welcome. I am Peiqi, a multidisciplinary designer specializing in UI/UX and complete visual identities. I elevate your brand story across websites, smart namecards, and corporate collateral.',
  motto: 'Look like the leader. Sell like one.',
}

export const about = {
  statement:
    'Most design stops at how you look.',
  // Read as the answering half of the line above, so it stays deliberately
  // short — the detail belongs in the paragraphs beside it.
  statementMuted: 'Mine doesn’t stop until it sells.',
  paragraphs: [
    'I work with established companies that have outgrown their old image, founders launching something new, and product and service businesses whose digital presence is not earning its keep. Strategy, identity, UX/UI, web and campaigns all come from one place, so nothing contradicts anything else.',
    'Every engagement starts with the story — who you are for, what makes you the obvious choice, and what someone should do next. The identity and the user experience are then built to carry it, so your digital footprint works as a sales channel rather than a brochure.',
  ],
  // Placeholder figures. Replace these with your real numbers.
  stats: [
    { value: '6+', label: 'Years designing brands' },
    { value: '30+', label: 'Projects delivered' },
    { value: '10+', label: 'Industries served' },
    { value: '360°', label: 'Strategy through rollout' },
  ],
}

/** Scrolling breadth strip — every deliverable, in one continuous line. */
export const deliverables = [
  'Brand Strategy',
  'Logo Design',
  'Visual Identity',
  'Namecards',
  'NFC Metal Cards',
  'Custom QR Codes',
  'Letterheads',
  'Envelopes',
  'Document Headers',
  'Company Profiles',
  'UX/UI Design',
  'Mobile Apps',
  'Backend Systems',
  'Admin Dashboards',
  'Websites',
  'E-Commerce',
  'Portfolio Sites',
  'Landing Pages',
  'Social Media',
  'Posters',
  'Banners',
  'Greeting Cards',
  'Packaging',
  'Pitch Decks',
  'Email Signatures',
  'Signage',
  'Campaign Art Direction',
]

/** Who the work is for. Three routes in, so every visitor sees themselves. */
export const tracks = [
  {
    id: 'companies',
    label: 'For established companies',
    title: 'Rebrand & reposition',
    desc: 'You have the business. The brand image has not kept up with it. We rebuild how the market reads you — story, identity and digital presence — and give your team a system they cannot break.',
    points: [
      'Brand audit & positioning',
      'Full identity system',
      'Print, NFC & collateral',
      'UX/UI & website rebuild',
      'Launch campaign',
    ],
  },
  {
    id: 'businesses',
    label: 'For product & service businesses',
    title: 'Sell more of it',
    desc: 'A storefront that converts rather than merely existing. The offer, the messaging and the UX/UI are designed together around one action.',
    points: [
      'E-commerce & service sites',
      'Offer & messaging strategy',
      'UX/UI & landing pages',
      'Product & social content',
      'Ad & campaign creative',
    ],
  },
  {
    id: 'individuals',
    label: 'For founders & individuals',
    title: 'A personal brand that opens doors',
    desc: 'For consultants, creatives and professionals who need to be taken seriously before the first conversation happens — a story and an online profile that do the introducing for you.',
    points: [
      'Portfolio & personal sites',
      'Personal identity & logo',
      'CV, deck & profile design',
      'Social presence kit',
      'Photography direction',
    ],
  },
]

/** The capability list — what actually gets made. */
export const services = [
  {
    id: 'strategy',
    title: 'Brand Strategy & Positioning',
    desc: 'Before a single pixel: who you are for, what makes you the obvious choice, and the message that gets there fastest. Delivered as a positioning line, messaging framework and tone of voice your whole team can use.',
    tags: ['Audit', 'Positioning', 'Messaging', 'Naming', 'Tone of Voice'],
  },
  {
    id: 'identity',
    title: 'Logo & Visual Identity',
    desc: 'A mark that holds up at every size, plus the type, colour and layout rules around it — so a namecard, an invoice and a billboard all read as the same company.',
    tags: ['Logo Systems', 'Typography', 'Colour', 'Brand Guidelines'],
  },
  {
    id: 'print',
    title: 'Print, NFC & Corporate Collateral',
    desc: 'The physical touchpoints people actually hold. Print-ready artwork with bleed and crop marks, supplied exactly the way your printer wants it — plus brushed steel NFC cards, where one tap drops your full digital contact card onto any phone.',
    tags: [
      'Namecards',
      'NFC Metal Cards',
      'Digital Contact Cards',
      'Letterheads',
      'Envelopes',
      'Document Headers',
      'Company Profiles',
      'Booklets',
    ],
  },
  {
    id: 'uxui',
    title: 'UX/UI — User Experience & User Interface',
    desc: 'How someone moves through your site, and what they see at every step. User journeys and wireframes first, then interface design and micro-interactions that make the next action obvious — treated as carefully on a phone as on a desktop.',
    tags: [
      'User Journeys',
      'Wireframes',
      'Interface Design',
      'Design Systems',
      'Prototyping',
      'Mobile-First',
    ],
  },
  {
    id: 'web',
    title: 'Web Design & Development',
    desc: 'Fast, considered websites with real motion design — corporate sites, portfolios and everything between, built to load quickly, tell your story and hold attention.',
    tags: ['Corporate Sites', 'Portfolios', 'WebGL & Motion', 'CMS'],
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce & Sales Pages',
    desc: 'Where the brand meets the transaction. Product pages, landing pages and checkout flows structured around one measurable outcome.',
    tags: ['Product Pages', 'Landing Pages', 'Checkout UX', 'Conversion Copy'],
  },
  {
    id: 'campaign',
    title: 'Campaigns, Social & Print Media',
    desc: 'Ongoing creative that keeps the brand visible — art-directed as a set, never assembled one post at a time.',
    tags: [
      'Social Media',
      'Posters',
      'Banners',
      'Greeting Cards',
      'Signage',
      'Ad Creative',
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile App Design & Development',
    desc: 'Native-feeling apps for iOS and Android, designed and built to match your brand. From onboarding to push notifications, every screen is structured around what the user needs to do next.',
    tags: [
      'iOS & Android',
      'React Native',
      'App UI/UX',
      'Prototyping',
      'App Store Launch',
    ],
  },
  {
    id: 'backend',
    title: 'Backend & Operations Software',
    desc: 'The dashboards, admin panels and internal tools that keep a business running. Order flows, inventory, client portals and API integrations, built so your team can operate without workarounds.',
    tags: [
      'Admin Dashboards',
      'API Development',
      'Workflow Automation',
      'Database Design',
      'Internal Tools',
    ],
  },
]

/**
 * Featured case study.
 *
 * The imagery is real: the site shots come from the live build, the card and
 * envelope renders come straight out of the print-ready artwork.
 */
export const caseStudy = {
  client: 'Nepmarine Agency',
  sector: 'Shipping & Vessel Logistics',
  year: '2025',
  location: 'Singapore',
  href: 'https://www.nepmarine.org/',
  summary:
    'A Singapore shipping agency founded in 2024 needed to look as established as the owners and charterers it was pitching to. One brand, built from the mark outward.',
  detail:
    'The identity centres on a compass mark and a deep navy-and-brass palette that reads as maritime without being literal. It runs across the full stationery suite and into a website organised around the three things a charterer checks first: coverage, capability and how fast someone picks up the phone.',
  scope: [
    'Brand Identity',
    'Logo Design',
    'Print Collateral',
    'Website Design',
    'Copy & Content',
  ],
  results: [
    { value: '13', label: 'Countries of coverage communicated' },
    { value: '24/7', label: 'Operational promise built into the site' },
    { value: '1', label: 'Consistent system across print & digital' },
  ],
}

/**
 * Gallery rail. `kind: 'sample'` entries are empty slots — drop an image into
 * /public/work, add the `src`, and the slot becomes a real piece.
 */
export const pieces = [
  {
    id: 'nep-site',
    src: '/work/nepmarine-site.jpg',
    label: 'Website',
    client: 'Nepmarine Agency',
    note: 'Homepage — hero and positioning',
    fit: 'cover',
  },
  {
    id: 'nep-site-services',
    video: '/work/nepmarine-boat.mp4',
    label: 'Website',
    client: 'Nepmarine Agency',
    note: 'Services architecture',
    fit: 'cover',
  },
  {
    id: 'nep-card-front',
    src: '/work/nepmarine-namecard-front.png',
    label: 'Namecard',
    client: 'Nepmarine Agency',
    note: 'Front — logo lockup',
    fit: 'contain',
  },
  {
    id: 'nep-card-back',
    src: '/work/nepmarine-namecard-back.png',
    label: 'Namecard',
    client: 'Nepmarine Agency',
    note: 'Reverse — contact hierarchy',
    fit: 'contain',
  },
  {
    id: 'nep-envelope-c4',
    src: '/work/nepmarine-envelope-c4.png',
    label: 'Envelope',
    client: 'Nepmarine Agency',
    note: 'C4 — document header treatment',
    fit: 'contain',
  },
  {
    id: 'nep-envelope-dl',
    src: '/work/nepmarine-envelope-dl.png',
    label: 'Envelope',
    client: 'Nepmarine Agency',
    note: 'DL — correspondence',
    fit: 'contain',
  },
  {
    id: 'nep-doc-header',
    src: '/work/nepmarine-document-header.png',
    label: 'Document Header',
    client: 'Nepmarine Agency',
    note: 'MS Word letterhead system',
    fit: 'contain',
  },
  {
    id: 'slot-social',
    kind: 'sample',
    label: 'Social Campaign',
    note: 'Add your artwork',
    category: 'Digital',
  },
  {
    id: 'slot-greeting',
    kind: 'sample',
    label: 'Greeting Card',
    note: 'Add your artwork',
    category: 'Print',
  },
  {
    id: 'slot-banner',
    kind: 'sample',
    label: 'Banner',
    note: 'Add your artwork',
    category: 'Large Format',
  },
]

/**
 * The Nepmarine card in three states, all feeding one interactive stage.
 *
 * `before.front` is the client's original card, photographed then rectified and
 * flattened. It was printed single-sided, so `back` is null and the stage falls
 * through to plain stock. `stock` selects the material the 3D stage builds the
 * card from — 'paper' for board, 'metal' for the brushed steel NFC card.
 */
export const redesign = {
  title: 'One card, rebuilt — then made tappable.',
  intro:
    'The original card was doing the company no favours: everything crowded into the top-left corner, a mark fighting the wordmark it sat inside, and one printed side carrying every piece of information at once.',
  detail:
    'The rebuild splits the job in two. One face belongs to the brand — the compass monogram given room, the tagline, nothing else. The other face is pure utility, with the name, role and four contact routes ordered by how often anyone actually needs them.',
  extra:
    'Then a third version the company never had before: a brushed steel NFC card. The etched face carries the mark alone, and a tap sends a full digital contact card to any phone — so the printed card becomes the keepsake rather than the only copy.',
  variants: [
    {
      key: 'before',
      label: 'Before',
      year: '2024',
      stock: 'paper',
      front: '/work/nepmarine-original-card.jpg',
      frontAlt:
        'The original Nepmarine business card: logo and all contact details on a single white side',
      frontLabel: 'Original — the only printed side',
      back: null,
      backAlt: '',
      backLabel: 'Original — blank reverse',
    },
    {
      key: 'after',
      label: 'After',
      year: '2025',
      stock: 'paper',
      front: '/work/nepmarine-namecard-front.png',
      frontAlt:
        'The redesigned Nepmarine card front: compass monogram and tagline on deep navy',
      frontLabel: 'Redesign — brand face',
      back: '/work/nepmarine-namecard-back.png',
      backAlt:
        'The redesigned Nepmarine card reverse: name, role and contact details with the compass watermark',
      backLabel: 'Redesign — information face',
    },
    {
      key: 'nfc',
      label: 'NFC',
      year: 'Steel',
      stock: 'metal',
      front: '/work/nepmarine-nfc-front.png',
      frontAlt:
        'The Nepmarine NFC card: the mark etched into brushed navy steel with a contactless symbol',
      frontLabel: 'NFC steel — etched brand face',
      back: '/work/nepmarine-nfc-back.png',
      backAlt:
        'The reverse of the Nepmarine NFC card: brushed navy steel with the holder’s name etched small',
      backLabel: 'NFC steel — name etched, nothing else',
    },
  ],
}

/** Mobile apps and backend / operations software. */
export const software = {
  title: 'Apps and systems',
  titleAccent: 'that run the business.',
  intro:
    'Beyond websites and print, I design and build the software your team and customers actually use every day. Mobile apps in their pocket, and the backend dashboards that keep operations moving.',
  pillars: [
    {
      id: 'mobile',
      label: 'Mobile Apps',
      title: 'In their pocket, on brand.',
      desc: 'Consumer and business apps for iOS and Android. Onboarding, navigation and every screen designed around one clear action, then built to ship on the App Store and Google Play.',
      tags: [
        'iOS & Android',
        'React Native',
        'App UI/UX',
        'Push Notifications',
        'Offline-Ready',
      ],
      stats: [
        { value: '60fps', label: 'Smooth native interactions' },
        { value: '1:1', label: 'Brand-matched design system' },
      ],
    },
    {
      id: 'backend',
      label: 'Backend & Operations',
      title: 'The engine behind the front.',
      desc: 'Admin dashboards, client portals, inventory systems and API layers. Operational software your staff can rely on, with the data visibility to make decisions without chasing spreadsheets.',
      tags: [
        'Admin Dashboards',
        'REST & GraphQL APIs',
        'Workflow Automation',
        'Role-Based Access',
        'Real-Time Data',
      ],
      stats: [
        { value: '24/7', label: 'Systems built to stay up' },
        { value: 'API', label: 'Connected to everything else' },
      ],
    },
  ],
}

/** Branded QR code to Linktree — scroll-driven phone journey. */
export const qrShowcase = {
  eyebrow: 'In detail — the QR code',
  title: 'One scan,',
  titleAccent: 'every link.',
  intro:
    'A custom QR code for Nepmarine\'s Linktree: the compass mark sits at the centre, the code reads clean at any size, and one scan opens their full contact hub on mobile.',
  detail:
    'Watch it play out exactly as it does in real life — the phone unlocks, the camera locks onto the code, and Safari lands on the live Linktree profile.',
  url: 'https://linktr.ee/nepmarine.agency',
  qrSrc: '/work/nepmarine-qr.png',
  qrAlt: 'Nepmarine branded QR code with the compass mark at the centre',
  tags: ['Custom QR', 'Linktree', 'Mobile-First', 'Brand Mark Integration'],
}

export const contact = {
  intro:
    'Tell me what the business needs to achieve — a full rebrand, a digital presence built to bring in enquiries, or a single logo done properly. The first conversation is free.',
  email: 'hello@peiqi.studio',
  location: 'Singapore · Working worldwide',
  // Add a URL to switch a link on. Anything left null stays hidden.
  socials: [
    { label: 'Instagram', href: null },
    { label: 'LinkedIn', href: null },
    { label: 'Behance', href: null },
  ],
}
