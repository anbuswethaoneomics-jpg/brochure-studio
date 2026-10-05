import tellsAStoryJson from "./tells-a-story.json";
import sampleToInsightJson from "./sample-to-insight.json";
// Templates for Brochure Studio
const TEAL = '#005b76', NAVY = '#004068', GREEN = '#1a9e5b', INK = '#1a3040', MUTE = '#556677', ACC = '#00838f', MINT = '#eaf1ee';
const t = (text, x, y, w, size, o = {}) => ({ k: 'text', t: text, x, y, w, size, ...o });
const r = (x, y, w, h, fill, o = {}) => ({ k: 'rect', x, y, w, h, fill, ...o });
const c = (x, y, r, fill, o = {}) => ({ k: 'circle', x, y, r, fill, ...o });
const ic = (name, x, y, size, color = '#00838f') => ({ k: 'icon', name, x, y, size, color });

// Color palette for Oneomics "From sample to insight" brochure
const CLR_RED = '#E23B32', CLR_BLUE = '#0793EB', CLR_GREEN = '#33A015';
const CLR_NAVY = '#10243E', CLR_TEXT = '#2B3A4F', CLR_MUTED = '#6B7A8F';
const CLR_TINT = '#F3F8FC', CLR_LINE = '#D5E3EF';

const tribar = (x, y, w, h = 6) => {
  const seg = w / 3;
  return [
    r(x, y, seg, h, CLR_RED),
    r(x + seg, y, seg, h, CLR_BLUE),
    r(x + 2 * seg, y, seg, h, CLR_GREEN),
  ];
};

// Real Oneomics Precision Genomics Trifold Brochure — Page 1 (Front)
export function trifold() {
  const s = [];

  // Top green stripe spanning the whole brochure
  s.push(r(0, 0, 1123, 4, GREEN));

  // ==========================================
  // PANEL 1: FRONT COVER (Left)
  // ==========================================
  // ONEOMICS Logo (Reduced slightly) & Tagline directly below
  s.push({ k: 'image', src: '/assets/oneomics_logo.png', x: 95, y: 24, w: 184 });
  s.push(t('Precision Genomics | Research Solutions', 10, 78, 354, 10.5, { bold: 1, color: '#006837', align: 'center', font: 'Montserrat' }));

  // DNA double helix ribbon illustration
  s.push({ k: 'image', src: '/assets/dna_helix.png', x: 10, y: 122, w: 96 });

  // Main headline & subtitle
  s.push(t('DECODING\nLIFE\nEMPOWERING\nTOMORROW', 116, 148, 236, 21, { bold: 1, color: NAVY, font: 'Montserrat', lh: 1.18 }));
  s.push(t('Precision genomics solutions for human, animal, plant and microbiome research.', 116, 260, 236, 10, { color: MUTE, font: 'Figtree', lh: 1.25 }));

  // 6 Domain icons grid
  const domains = [
    { icon: 'users', label: 'HUMAN\nGENOMICS', x: 26, y: 420 },
    { icon: 'heart', label: 'VETERINARY\nGENETICS', x: 138, y: 420 },
    { icon: 'leaf', label: 'PLANT\nGENOMICS', x: 250, y: 420 },
    { icon: 'microscope', label: 'MICROBIOME\nRESEARCH', x: 26, y: 545 },
    { icon: 'flask', label: 'DIAGNOSTICS', x: 138, y: 545 },
    { icon: 'globe', label: 'BIO-IT\nSOLUTIONS', x: 250, y: 545 },
  ];

  domains.forEach((d) => {
    s.push(ic(d.icon, d.x + 28, d.y + 12, 34, '#00828a'));
    s.push(t(d.label, d.x, d.y + 56, 90, 9.5, { bold: 1, color: NAVY, align: 'center', font: 'Montserrat', lh: 1.15 }));
  });

  // Bottom banner & URL
  s.push(r(10, 715, 354, 69, TEAL, { r: 6 }));
  s.push(t('www.oneomics.in', 10, 740, 354, 15, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));

  // ==========================================
  // PANEL 2: OUR PRODUCTS (Middle)
  // ==========================================
  s.push(t('OUR PRODUCTS', 400, 24, 320, 22, { bold: 1, color: NAVY, font: 'Montserrat' }));
  s.push(r(400, 56, 160, 3, '#005b76'));

  const products = [
    { img: '/assets/prod_onespit.png', name: 'ONESpit™', desc: 'Saliva Collection Kit', y: 72 },
    { img: '/assets/prod_oneasy.png', name: 'ONEasy™', desc: 'Faecal Collection Kit', y: 152 },
    { img: '/assets/prod_rnaguard.png', name: 'RNAGUARD™', desc: 'Ambient RNA Stabilization', y: 232 },
    { img: '/assets/prod_proteinguard.png', name: 'ProteinGUARD™', desc: 'Protein Stabilization', y: 312 },
    { img: '/assets/prod_onemag.png', name: 'ONEMag™', desc: 'Plant DNA Isolation Kit', y: 392 },
    { img: '/assets/prod_onenext.png', name: 'ONENext™ 16S', desc: 'Library Prep Kit', y: 472 },
    { img: '/assets/prod_myomics.png', name: 'MyOMICS.AI', desc: 'Variant Interpretation', y: 552 },
  ];

  products.forEach((p) => {
    s.push({ k: 'image', src: p.img, x: 400, y: p.y, w: 72 });
    s.push(t(p.name, 486, p.y + 6, 232, 14, { bold: 1, color: '#003858', font: 'Montserrat' }));
    s.push(t(p.desc, 486, p.y + 26, 232, 11, { color: MUTE, font: 'Poppins' }));
  });

  // From Samples to Insights script text
  s.push(t('From Samples to Insights', 384, 668, 354, 25, { font: 'Caveat', bold: 1, italic: 1, color: '#007890', align: 'center' }));

  // ==========================================
  // PANEL 3: OUR SERVICES (Right)
  // ==========================================
  s.push(t('OUR SERVICES', 774, 24, 320, 22, { bold: 1, color: NAVY, font: 'Montserrat' }));
  s.push(r(774, 56, 75, 3, GREEN));

  const services = [
    'Whole Genome Sequencing (WGS)',
    'Whole Exome Sequencing (WES)',
    '16S rRNA & Metagenomics',
    'Bioinformatics & Data Analysis',
    'Clinical & Rare Disease Genomics',
    'Agrigenomics & Plant Biotechnology',
    'Veterinary Genetics',
    'Diagnostics & Kit Development',
    'LIMS, ERP & AI Platforms',
  ];

  services.forEach((srv, i) => {
    const sy = 76 + i * 39;
    s.push(ic('check', 774, sy + 1, 18, GREEN));
    s.push(t(srv, 804, sy, 290, 11.5, { bold: 1, color: INK, font: 'Poppins' }));
  });

  // Authentic bottom right graphic: Laboratory seedling with angled green/teal banner
  s.push({ k: 'image', src: '/assets/healthier_planet.png', x: 748, y: 620, w: 375 });

  return s;
}

// Real Oneomics Precision Genomics Trifold Brochure — Page 2 (Back)
export function trifoldBack() {
  const s = [];

  // Top green stripe spanning the whole brochure
  s.push(r(0, 0, 1123, 4, GREEN));

  // ==========================================
  // PANEL 1: ADVANCED SEQUENCING (Left)
  // ==========================================
  s.push({ k: 'image', src: '/assets/oneomics_logo.png', x: 26, y: 26, w: 130 });
  s.push(t('ADVANCED SEQUENCING', 26, 70, 320, 20, { bold: 1, color: NAVY, font: 'Montserrat' }));
  s.push(t('NGS · Transcriptomics · Long-Read', 26, 96, 320, 11.5, { bold: 1, color: GREEN, font: 'Poppins' }));
  s.push(r(26, 120, 320, 2.5, '#005b76'));

  s.push(t('Comprehensive multi-omics sequencing pipelines backed by PacBio, Oxford Nanopore and Illumina platforms.', 26, 132, 320, 10.5, { color: INK, font: 'Poppins', lh: 1.45 }));

  const ngsServices = [
    'De novo & Reference-Based Genome Assembly',
    'Hi-C, Chloroplast & Mitochondrial Genomes',
    'Whole Genome Bisulfite & Methylation (WGBS)',
    'Whole Transcriptome (mRNA, lncRNA, sRNA)',
    'Single-Cell RNA-Seq & Isoform Sequencing',
    'PacBio HiFi & Oxford Nanopore Sequencing',
    'qRT-PCR, SSR Marker & ChIP-Seq Validation',
  ];

  ngsServices.forEach((item, i) => {
    const y = 194 + i * 40;
    s.push(ic('plus-circle', 26, y + 1, 18, '#00828a'));
    s.push(t(item, 54, y, 290, 11, { bold: 1, color: INK, font: 'Poppins' }));
  });

  // Bottom footer banner
  s.push(r(10, 715, 354, 69, TEAL, { r: 6 }));
  s.push(t('Precision Genomics | Research Solutions', 10, 740, 354, 13, { bold: 1, color: '#ffffff', align: 'center', font: 'Montserrat' }));

  // ==========================================
  // PANEL 2: BIOINFORMATICS & KITS (Middle)
  // ==========================================
  s.push({ k: 'image', src: '/assets/oneomics_logo.png', x: 400, y: 26, w: 130 });
  s.push(t('BIOINFORMATICS & KITS', 400, 70, 320, 20, { bold: 1, color: NAVY, font: 'Montserrat' }));
  s.push(t('DNASTAR Lasergene · Indigenous Reagents', 400, 96, 320, 11.5, { bold: 1, color: GREEN, font: 'Poppins' }));
  s.push(r(400, 120, 320, 2.5, '#005b76'));

  s.push(t('Integrated desktop sequence-analysis software and ambient-temperature molecular biology reagents.', 400, 132, 320, 10.5, { color: INK, font: 'Poppins', lh: 1.45 }));

  const bioKits = [
    'NucleoGUARD™ — Cellular RNA Stabilization',
    'SoilGUARD™ — Soil Nucleic Acid Buffer',
    'ONEMag™ Rapid Soil & Universal DNA/RNA Kits',
    'ONENext™ 16S (V1–V9) ONT Library Prep Kit',
    '2X Taq Plus PCR Master Mix (With RED Dye)',
    'DNASTAR Lasergene — Molecular Biology Module',
    'DNASTAR Lasergene — Genomics & Proteomics',
  ];

  bioKits.forEach((item, i) => {
    const y = 194 + i * 40;
    s.push(ic('plus-circle', 400, y + 1, 18, '#00828a'));
    s.push(t(item, 428, y, 290, 11, { bold: 1, color: INK, font: 'Poppins' }));
  });

  // Bottom footer banner
  s.push(r(384, 715, 354, 69, TEAL, { r: 6 }));
  s.push(t('Precision Genomics | Research Solutions', 384, 740, 354, 13, { bold: 1, color: '#ffffff', align: 'center', font: 'Montserrat' }));

  // ==========================================
  // PANEL 3: CONTACT US (Right)
  // ==========================================
  s.push({ k: 'image', src: '/assets/oneomics_logo.png', x: 774, y: 26, w: 130 });
  s.push(t('CONTACT US', 774, 70, 320, 20, { bold: 1, color: NAVY, font: 'Montserrat' }));
  s.push(t('Partner With ONEOMICS', 774, 96, 320, 11.5, { bold: 1, color: GREEN, font: 'Poppins' }));
  s.push(r(774, 120, 320, 2.5, '#005b76'));

  s.push(t('ONEOMICS PRIVATE LIMITED\nBharathidasan University Technology Park,\nKhajamalai Campus, Tiruchirappalli – 620 023,\nTamil Nadu, India\nCIN: U72502TN2020PTC135895', 774, 132, 320, 10.5, { color: INK, font: 'Poppins', lh: 1.5 }));

  const contacts = [
    'Website: www.oneomics.in',
    'Email: info@oneomics.in',
    'Platforms: MyOMICS.AI | Delphina.in | PanthERP.in',
    'Diagnostics: MyGUTBIOME | MyNIPT | AccuAge',
  ];

  contacts.forEach((item, i) => {
    const y = 254 + i * 44;
    s.push(ic('plus-circle', 774, y + 1, 18, '#00828a'));
    s.push(t(item, 802, y, 290, 11, { bold: 1, color: INK, font: 'Poppins' }));
  });

  // Bottom footer banner
  s.push(r(758, 715, 354, 69, TEAL, { r: 6 }));
  s.push(t('Precision Genomics | Research Solutions', 758, 740, 354, 13, { bold: 1, color: '#ffffff', align: 'center', font: 'Montserrat' }));

  return s;
}

// Real Oneomics Precision Genomics Trifold Brochure 2 ("From sample to insight") — Page 1 (Outside)
export function trifoldInsight() {
  return JSON.parse(JSON.stringify(sampleToInsightJson[0]));
}

// Real Oneomics Precision Genomics Trifold Brochure 2 ("From sample to insight") — Page 2 (Inside)
export function trifoldInsightInside() {
  return JSON.parse(JSON.stringify(sampleToInsightJson[1]));
}

// Oneomics ONESpit™ Product Profile — A4 Flyer (794 x 1123)
export function onespitFlyer() {
  const s = [];

  // Top header: Logo & kicker
  s.push({ k: 'image', src: '/assets/oneomics_logo.png', x: 49, y: 36, w: 151 });
  s.push(t('PRODUCT PROFILE · 01 / 14', 450, 48, 295, 12, { color: CLR_MUTED, align: 'right', font: 'Poppins' }));

  // Hero Card (Light blue tint with rounded corners)
  s.push(r(49, 95, 696, 222, CLR_TINT, { r: 23 }));

  // Hero Product Image and DNA Helix
  s.push({ k: 'image', src: '/assets/dna_helix_clean.png', x: 470, y: 105, w: 250 });
  s.push({ k: 'image', src: '/assets/prod_onespit.png', x: 550, y: 125, w: 170 });

  // Hero Pill (COLLECT & STABILIZE)
  s.push(r(85, 122, 175, 26, '#ffffff', { r: 99, stroke: CLR_RED, sw: 1.2 }));
  s.push(c(97, 130, 4.5, CLR_RED));
  s.push(t('COLLECT & STABILIZE', 112, 127, 140, 9.5, { bold: 1, color: CLR_NAVY, font: 'Poppins', sp: 30 }));

  // Hero Title & Subtitle
  s.push(t('ONESpit™', 85, 155, 380, 48, { bold: 1, color: CLR_NAVY, font: 'Poppins', lh: 1.1 }));
  s.push(t('Zero-Prep Saliva Collection & Preservation Kit', 85, 212, 420, 16.5, { bold: 1, color: CLR_RED, font: 'Poppins' }));

  // Hero Tribar (Red, Blue, Green)
  s.push(r(85, 239, 20, 4, CLR_RED));
  s.push(r(105, 239, 20, 4, CLR_BLUE));
  s.push(r(125, 239, 20, 4, CLR_GREEN));

  // Hero Tagline
  s.push(t('Non-invasive saliva collection with zero sample preparation.', 85, 255, 380, 13.5, { color: CLR_TEXT, font: 'Poppins' }));

  // ROW A: Overview & Applications
  // Left: Overview
  s.push(r(49, 348, 6, 18, CLR_RED, { r: 3 }));
  s.push(t('Overview', 65, 345, 300, 18, { bold: 1, color: CLR_NAVY, font: 'Poppins' }));

  s.push(c(52, 387, 3.5, CLR_RED));
  s.push(t('Non-invasive, zero-prep saliva collection that stabilizes DNA at room temperature for over a year.', 65, 380, 360, 13.5, { color: CLR_TEXT, font: 'Poppins', lh: 1.45 }));

  s.push(c(52, 447, 3.5, CLR_RED));
  s.push(t('Supports convenient self-collection without refrigeration and is suitable for home, clinic or field use.', 65, 440, 360, 13.5, { color: CLR_TEXT, font: 'Poppins', lh: 1.45 }));

  s.push(c(52, 507, 3.5, CLR_RED));
  s.push(t('Designed for molecular applications where simple collection and reliable DNA preservation are important.', 65, 500, 360, 13.5, { color: CLR_TEXT, font: 'Poppins', lh: 1.45 }));

  // Right: Applications Card
  s.push(r(460, 345, 285, 215, CLR_TINT, { r: 16 }));
  s.push(r(480, 363, 6, 18, CLR_RED, { r: 3 }));
  s.push(t('Applications', 496, 360, 230, 18, { bold: 1, color: CLR_NAVY, font: 'Poppins' }));

  const appItems = [
    'PCR and qPCR',
    'Next-generation sequencing (NGS)',
    'SNP analysis',
    'Methylation analysis',
    'Oral cancer and early diagnostic research',
  ];
  appItems.forEach((item, idx) => {
    const yPos = 398 + idx * 28;
    s.push(r(480, yPos + 4, 6, 6, CLR_RED, { r: 1.5 }));
    s.push(t(item, 496, yPos, 235, 13, { color: CLR_TEXT, font: 'Poppins' }));
  });

  // Key Benefits Section
  s.push(r(49, 583, 6, 18, CLR_RED, { r: 3 }));
  s.push(t('Key benefits', 65, 580, 300, 18, { bold: 1, color: CLR_NAVY, font: 'Poppins' }));

  const benefitsCol1 = [
    'Zero sample preparation',
    'Stable for 1+ year at room temperature',
    'No refrigeration required',
  ];
  benefitsCol1.forEach((b, idx) => {
    const yPos = 616 + idx * 32;
    s.push(c(52, yPos + 3, 7.5, CLR_RED));
    s.push(t('✓', 54, yPos + 1, 15, 9.5, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
    s.push(t(b, 78, yPos, 300, 13.5, { color: CLR_TEXT, font: 'Poppins' }));
  });

  const benefitsCol2 = [
    'Self-collection at home',
    'Fully non-invasive',
    'Patent-protected',
  ];
  benefitsCol2.forEach((b, idx) => {
    const yPos = 616 + idx * 32;
    s.push(c(413, yPos + 3, 7.5, CLR_RED));
    s.push(t('✓', 415, yPos + 1, 15, 9.5, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
    s.push(t(b, 439, yPos, 300, 13.5, { color: CLR_TEXT, font: 'Poppins' }));
  });

  // Simple Workflow Section
  s.push(r(49, 728, 6, 18, CLR_RED, { r: 3 }));
  s.push(t('Simple workflow', 65, 725, 300, 18, { bold: 1, color: CLR_NAVY, font: 'Poppins' }));

  s.push(r(65, 773, 660, 2, CLR_LINE));

  const steps = [
    'Collect saliva using the ONESpit™ collection procedure.',
    'Follow the kit instructions for completing collection and stabilization.',
    'Secure the sample and maintain recommended storage conditions.',
    'Transport without refrigeration when permitted by the validated instructions.',
    'Use the preserved sample for downstream DNA extraction and molecular analysis.',
  ];
  steps.forEach((st, idx) => {
    const xPos = 49 + idx * 141;
    s.push(c(xPos + 15, 759, 14, CLR_RED));
    s.push(t(String(idx + 1), xPos + 15, 762, 28, 14, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
    s.push(t(st, xPos, 795, 126, 11.5, { color: CLR_TEXT, font: 'Poppins', lh: 1.35 }));
  });

  // Expected Results Card
  s.push(r(49, 875, 696, 95, CLR_TINT, { r: 16 }));
  s.push(r(49, 875, 6, 95, CLR_RED, { r: 3 }));
  s.push(t('Expected results / performance', 72, 888, 400, 16, { bold: 1, color: CLR_NAVY, font: 'Poppins' }));

  s.push(c(72, 922, 3, CLR_RED));
  s.push(t('DNA from 8 independent ONESpit™ saliva samples showed consistent, high-quality bands with no visible degradation.', 84, 915, 305, 12.5, { color: CLR_TEXT, font: 'Poppins', lh: 1.4 }));

  s.push(c(410, 922, 3, CLR_RED));
  s.push(t('Supports DNA preservation for downstream molecular workflows.', 422, 915, 305, 12.5, { color: CLR_TEXT, font: 'Poppins', lh: 1.4 }));

  // Bottom CTA Section
  s.push(r(0, 995, 794, 117, CLR_TINT));
  s.push(t('Interested in ONESpit™?', 49, 1015, 400, 20, { bold: 1, color: CLR_NAVY, font: 'Poppins' }));
  s.push(t('Contact our team for availability, pricing and technical details.', 49, 1048, 380, 12.5, { color: CLR_TEXT, font: 'Poppins' }));

  s.push(t('WEB', 540, 1018, 55, 10, { bold: 1, color: CLR_BLUE, font: 'Poppins' }));
  s.push(t('www.oneomics.in', 600, 1016, 150, 12.5, { color: CLR_TEXT, font: 'Poppins' }));

  s.push(t('EMAIL', 540, 1042, 55, 10, { bold: 1, color: CLR_BLUE, font: 'Poppins' }));
  s.push(t('info@oneomics.in', 600, 1040, 150, 12.5, { color: CLR_TEXT, font: 'Poppins' }));

  s.push(t('PHONE', 540, 1066, 55, 10, { bold: 1, color: CLR_BLUE, font: 'Poppins' }));
  s.push(t('+91 00000 00000', 600, 1064, 150, 12.5, { color: CLR_TEXT, font: 'Poppins' }));

  // Tribar on bottom edge
  s.push(r(0, 1112, 264.6, 11, CLR_RED));
  s.push(r(264.6, 1112, 264.6, 11, CLR_BLUE));
  s.push(r(529.2, 1112, 265, 11, CLR_GREEN));

  return s;
}

// Oneomics ONESpit™ Modern Teal Flyer — A4 Flyer (794 x 1123)
export function onespitTealFlyer() {
  const s = [];

  const C_TEAL_DARK = '#0b4f55';
  const C_TEAL_LIGHT = '#12857f';
  const C_AMBER = '#ffc857';
  const C_INK = '#1d3b40';
  const C_MUTED = '#6f8a8d';
  const C_MINT = '#e8f6f3';
  const C_BORDER = '#cfe6e2';
  const C_CHIP_BORDER = '#bfe0da';

  // 1. TOP HEADER (y: 0 to 64)
  s.push({ k: 'image', src: '/assets/oneomics_logo.png', x: 44, y: 16, w: 150 });
  s.push(t('PRODUCT PROFILE  ·  01 / 14', 490, 26, 260, 10.5, { color: C_MUTED, font: 'Poppins', sp: 80, align: 'right' }));

  // 2. HERO SECTION (y: 64 to 304, h: 240)
  s.push(r(0, 64, 794, 240, C_TEAL_DARK, { gradient: [C_TEAL_DARK, C_TEAL_LIGHT] }));
  s.push(c(560, 20, 140, 'rgba(255,255,255,0.06)'));

  // Pill: COLLECT & STABILIZE
  s.push(r(44, 88, 160, 22, 'transparent', { r: 11, stroke: C_AMBER, sw: 1.2 }));
  s.push(t('COLLECT & STABILIZE', 44, 92, 160, 9.5, { bold: 1, color: C_AMBER, align: 'center', font: 'Poppins', sp: 80 }));

  // Headline & Subtitle
  s.push(t('ONESpit™', 44, 116, 450, 56, { bold: 1, color: '#ffffff', font: 'Poppins', lh: 1 }));
  s.push(t('Zero-Prep Saliva Collection &\nPreservation Kit', 44, 178, 440, 18, { bold: 1, color: C_AMBER, font: 'Poppins', lh: 1.2 }));
  s.push(t('Non-invasive saliva collection with zero sample preparation.', 44, 232, 440, 13, { color: '#d6efec', font: 'Poppins' }));

  // Hero Product Illustration (Box & Tube)
  s.push(r(508, 98, 146, 136, '#ffffff', { r: 10 }));
  s.push(r(508, 98, 146, 28, C_AMBER, { r: 10 }));
  s.push(r(508, 116, 146, 10, C_AMBER));
  s.push(t('ONEOMICS', 508, 105, 146, 10, { bold: 1, color: C_TEAL_DARK, align: 'center', font: 'Poppins', sp: 80 }));
  s.push(t('ONESpit™', 508, 148, 146, 21, { bold: 1, color: C_TEAL_DARK, align: 'center', font: 'Poppins' }));
  s.push(r(558, 184, 46, 3, C_TEAL_LIGHT, { r: 1.5 }));
  // Tricolor strip at box bottom
  s.push(r(508, 225, 48.6, 9, '#e53935'));
  s.push(r(556.6, 225, 48.6, 9, '#1e88e5'));
  s.push(r(605.2, 225, 48.8, 9, '#43a047'));

  // Saliva Collection Tube
  s.push(r(654, 76, 54, 170, 'rgba(255,255,255,0.92)', { r: 27 }));
  s.push(r(654, 76, 54, 26, C_AMBER, { r: 10 }));
  s.push(r(654, 136, 54, 110, '#f6a5ad', { r: 27 }));

  // 3. OVERVIEW SECTION (y: 318 to 415)
  s.push(r(44, 322, 22, 4, C_AMBER, { r: 2 }));
  s.push(t('Overview', 75, 316, 300, 16, { bold: 1, color: C_TEAL_DARK, font: 'Poppins' }));

  s.push(c(47, 349, 3, C_TEAL_LIGHT));
  s.push(t('Non-invasive, zero-prep saliva collection that stabilizes DNA at room temperature for over a year.', 58, 343, 692, 13, { color: C_INK, font: 'Poppins' }));

  s.push(c(47, 374, 3, C_TEAL_LIGHT));
  s.push(t('Supports convenient self-collection without refrigeration and is suitable for home, clinic or field use.', 58, 368, 692, 13, { color: C_INK, font: 'Poppins' }));

  s.push(c(47, 399, 3, C_TEAL_LIGHT));
  s.push(t('Designed for molecular applications where simple collection and reliable DNA preservation are important.', 58, 393, 692, 13, { color: C_INK, font: 'Poppins' }));

  // 4. APPLICATIONS CARD (y: 424 to 534)
  s.push(r(44, 424, 706, 108, C_MINT, { r: 14 }));
  s.push(r(60, 438, 22, 4, C_AMBER, { r: 2 }));
  s.push(t('Applications', 91, 433, 200, 15, { bold: 1, color: C_TEAL_DARK, font: 'Poppins' }));

  // Applications Chips Row 1 (y: 462)
  s.push(r(60, 462, 115, 26, '#ffffff', { r: 13, stroke: C_CHIP_BORDER, sw: 1 }));
  s.push(t('PCR and qPCR', 60, 467, 115, 11.5, { bold: 1, color: C_INK, align: 'center', font: 'Poppins' }));

  s.push(r(183, 462, 245, 26, '#ffffff', { r: 13, stroke: C_CHIP_BORDER, sw: 1 }));
  s.push(t('Next-generation sequencing (NGS)', 183, 467, 245, 11.5, { bold: 1, color: C_INK, align: 'center', font: 'Poppins' }));

  s.push(r(436, 462, 115, 26, '#ffffff', { r: 13, stroke: C_CHIP_BORDER, sw: 1 }));
  s.push(t('SNP analysis', 436, 467, 115, 11.5, { bold: 1, color: C_INK, align: 'center', font: 'Poppins' }));

  // Applications Chips Row 2 (y: 494)
  s.push(r(60, 494, 160, 26, '#ffffff', { r: 13, stroke: C_CHIP_BORDER, sw: 1 }));
  s.push(t('Methylation analysis', 60, 499, 160, 11.5, { bold: 1, color: C_INK, align: 'center', font: 'Poppins' }));

  s.push(r(228, 494, 290, 26, '#ffffff', { r: 13, stroke: C_CHIP_BORDER, sw: 1 }));
  s.push(t('Oral cancer and early diagnostic research', 228, 499, 290, 11.5, { bold: 1, color: C_INK, align: 'center', font: 'Poppins' }));

  // 5. KEY BENEFITS SECTION (y: 546 to 658)
  s.push(r(44, 550, 22, 4, C_AMBER, { r: 2 }));
  s.push(t('Key benefits', 75, 545, 300, 15, { bold: 1, color: C_TEAL_DARK, font: 'Poppins' }));

  const benefits = [
    { text: 'Zero sample preparation', x: 44, y: 572 },
    { text: 'Self-collection at home', x: 284, y: 572 },
    { text: 'Stable for 1+ year at room temp', x: 524, y: 572 },
    { text: 'Fully non-invasive', x: 44, y: 620 },
    { text: 'No refrigeration required', x: 284, y: 620 },
    { text: 'Patent-protected', x: 524, y: 620 },
  ];

  benefits.forEach((b) => {
    s.push(r(b.x, b.y, 226, 38, '#ffffff', { r: 10, stroke: C_BORDER, sw: 1 }));
    s.push(c(b.x + 12, b.y + 8, 11, C_TEAL_LIGHT));
    s.push(t('✓', b.x + 12, b.y + 11, 22, 11.5, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
    s.push(t(b.text, b.x + 40, b.y + 11, 180, 11.5, { bold: 1, color: C_INK, font: 'Poppins' }));
  });

  // 6. SIMPLE WORKFLOW SECTION (y: 672 to 816)
  s.push(r(44, 676, 22, 4, C_AMBER, { r: 2 }));
  s.push(t('Simple workflow', 75, 671, 300, 15, { bold: 1, color: C_TEAL_DARK, font: 'Poppins' }));

  const steps = [
    { num: '01', text: 'Collect saliva using the ONESpit™ collection procedure.' },
    { num: '02', text: 'Follow the kit instructions for completing collection and stabilization.' },
    { num: '03', text: 'Secure the sample and maintain recommended storage conditions.' },
    { num: '04', text: 'Transport without refrigeration when permitted by the validated instructions.' },
    { num: '05', text: 'Use the preserved sample for downstream DNA extraction and molecular analysis.' },
  ];

  steps.forEach((st, idx) => {
    const xPos = 44 + idx * 143;
    s.push(r(xPos, 698, 134, 126, '#f4fbf9', { r: 10 }));
    s.push(r(xPos, 698, 134, 4, C_TEAL_LIGHT));
    s.push(t(st.num, xPos + 10, 710, 114, 19, { bold: 1, color: C_TEAL_LIGHT, font: 'Poppins' }));
    s.push(t(st.text, xPos + 10, 738, 114, 11, { color: C_INK, font: 'Poppins', lh: 1.35 }));
  });

  // 7. EXPECTED RESULTS / PERFORMANCE (y: 838 to 936)
  s.push(r(44, 838, 706, 94, C_TEAL_DARK, { r: 14 }));
  s.push(t('Expected\nresults /\nperformance', 66, 854, 150, 15, { bold: 1, color: C_AMBER, font: 'Poppins', lh: 1.25 }));

  s.push(r(238, 852, 2, 66, C_AMBER));
  s.push(t('DNA from 8 independent ONESpit™ saliva samples showed consistent, high-quality bands with no visible degradation.', 252, 856, 210, 11.5, { color: '#ffffff', font: 'Poppins', lh: 1.4 }));

  s.push(r(488, 852, 2, 66, C_AMBER));
  s.push(t('Supports DNA preservation for downstream molecular workflows.', 502, 856, 232, 11.5, { color: '#ffffff', font: 'Poppins', lh: 1.4 }));

  // 8. FOOTER CTA & CONTACT (y: 948 to 1123)
  s.push(r(0, 948, 794, 167, C_MINT));
  s.push(t('Interested in ONESpit™?', 44, 968, 400, 18, { bold: 1, color: C_TEAL_DARK, font: 'Poppins' }));
  s.push(t('Contact our team for availability, pricing and technical details.', 44, 994, 380, 12, { color: '#4b6a6d', font: 'Poppins', lh: 1.3 }));

  s.push(t('WEB', 540, 970, 52, 9, { bold: 1, color: C_TEAL_LIGHT, font: 'Poppins', sp: 80 }));
  s.push(t('www.[your-website].com', 600, 968, 160, 12, { color: C_INK, font: 'Poppins' }));

  s.push(t('EMAIL', 540, 994, 52, 9, { bold: 1, color: C_TEAL_LIGHT, font: 'Poppins', sp: 80 }));
  s.push(t('[info@your-domain.com]', 600, 992, 160, 12, { color: C_INK, font: 'Poppins' }));

  s.push(t('PHONE', 540, 1018, 52, 9, { bold: 1, color: C_TEAL_LIGHT, font: 'Poppins', sp: 80 }));
  s.push(t('[+91 00000 00000]', 600, 1016, 160, 12, { color: C_INK, font: 'Poppins' }));

  // Tricolor stripe at bottom
  s.push(r(0, 1115, 264.6, 8, '#e53935'));
  s.push(r(264.6, 1115, 264.6, 8, '#1e88e5'));
  s.push(r(529.2, 1115, 264.8, 8, '#43a047'));

  return s;
}

// Real Oneomics Onam Festival Poster
export function onam() {
  const s = [];

  // Authentic textured background with mandalas, fireworks, and snake boat illustration
  s.push({ k: 'image', src: '/assets/onam_clean_bg.png', x: 0, y: 0, w: 576 });

  // ONEOMICS Top Right Logo
  s.push({ k: 'image', src: '/assets/onam_logo.png', x: 308, y: 18, w: 254 });

  // "HAPPY" heading — fully editable
  s.push(t('HAPPY', 188, 270, 200, 66, {
    font: 'Cinzel',
    bold: 1,
    color: '#556832',
    align: 'center',
    sp: 80,
  }));

  // "ONAM" big heading — fully editable
  s.push(t('ONAM', 150, 350, 276, 114, {
    font: 'Playfair Display',
    bold: 1,
    color: '#d8236d',
    align: 'center',
    sp: 30,
  }));

  // Festive Tagline — fully editable
  s.push(t('May this festive season bring\nyou lots of good luck, joy\nand prosperity!', 148, 508, 280, 16.5, {
    font: 'Poppins',
    color: '#556832',
    align: 'center',
    lh: 1.45,
  }));

  // Footer Website & Email — fully editable
  s.push(t('www.oneomics.in', 18, 986, 230, 15, {
    font: 'Poppins',
    color: '#334433',
    align: 'left',
    bold: 1,
  }));

  s.push(t('sales@oneomics.in', 328, 986, 230, 15, {
    font: 'Poppins',
    color: '#334433',
    align: 'right',
    bold: 1,
  }));

  return s;
}

export function poster() {
  return [
    { k: 'circle', x: 420, y: -140, r: 300, fill: '#0f8a6d' },
    { k: 'circle', x: -140, y: 820, r: 240, fill: '#0a4c3d' },
    t('SCIENCE\nFAIR', 60, 110, 680, 170, { font: 'Anton', color: '#ffffff', lh: 0.95 }),
    t('The annual student showcase', 60, 500, 640, 28, { font: 'Poppins', color: '#bff0de' }),
  ];
}

export function quote() {
  return [
    r(0, 0, 1080, 1080, '#e3f4ee'),
    t('“Simplicity is the soul of efficiency.”', 100, 420, 880, 54, { font: 'Playfair Display', italic: 1, color: '#0b5d4b', align: 'center' }),
    t('— Austin Freeman', 100, 560, 880, 28, { font: 'Poppins', color: '#0f8a6d', align: 'center' }),
  ];
}

// Colors for Oneomics "Every sample tells a story" Tri-fold Brochure (Design 3)
const S_CREAM = '#FBF7EF';
const S_CARD = '#FFFFFF';
const S_MINT = '#E7F1F1';
const S_INK = '#0B3C49';
const S_TEAL = '#16808F';
const S_TEAL2 = '#BFDDE1';
const S_CORAL = '#E2574C';
const S_BLUE = '#0793EB';
const S_GREEN = '#33A015';
const S_TEXT = '#34454F';
const S_MUTED = '#78878F';
const S_LINE = '#E4DDCF';

const sTitleDeco = (x, y) => [
  r(x, y, 42, 5, S_CORAL, { r: 2.5 }),
  c(x + 50, y + 2.5, 3.5, S_CORAL),
];

const sFooter = (x0, pw) => [
  t('ONEOMICS', x0 + 34, 762, 100, 9, { bold: 1, color: S_MUTED, font: 'Poppins' }),
  c(x0 + pw - 34 - 28, 766, 4.2, S_GREEN),
  c(x0 + pw - 34 - 14, 766, 4.2, S_BLUE),
  c(x0 + pw - 34, 766, 4.2, S_CORAL),
];

// Oneomics Editorial Tri-fold Brochure ("Every sample tells a story") — Page 1 (Outside)
export function trifoldStory() {
  return JSON.parse(JSON.stringify(tellsAStoryJson[0]));
}

// Oneomics Editorial Tri-fold Brochure ("Every sample tells a story") — Page 2 (Inside)
export function trifoldStoryInside() {
  return JSON.parse(JSON.stringify(tellsAStoryJson[1]));
}

// Colors for Oneomics "Hexagon Modern / Genomics Solutions" Tri-fold Brochure (Design 4)
const H_FOREST = '#17694A';
const H_INK = '#12302A';
const H_TEXT = '#3A4A45';
const H_MUTED = '#7B8C86';
const H_SAGE = '#EAF5EE';
const H_SAGE2 = '#D5EBDF';
const H_SAGE3 = '#F6FAF7';
const H_LINE = '#D9E6DE';
const H_RED = '#E23B32';
const H_BLUE = '#0793EB';
const H_GREEN = '#33A015';

const hHeader = (x0, pw, kicker, titleHtml) => [
  r(x0, 0, pw, 147, H_SAGE),
  { k: 'image', src: '/assets/hex_pattern_top.png', x: x0 + pw - 130, y: 0, w: 130, h: 147 },
  r(x0, 144, pw, 3.5, H_FOREST),
  t(kicker.toUpperCase(), x0 + 34, 30, pw - 68, 9.5, { bold: 1, color: H_FOREST, font: 'Poppins', sp: 80 }),
  t(titleHtml, x0 + 34, 52, pw - 130, 24, { bold: 1, color: H_INK, font: 'Poppins', lh: 1.15 }),
];

const hFooter = (x0, pw) => [
  r(x0 + 34, 752, pw - 68, 1, H_LINE),
  t('ONEOMICS PRIVATE LIMITED', x0 + 34, 764, 180, 8.5, { color: H_MUTED, font: 'Poppins', sp: 40 }),
  r(x0 + pw - 34 - 36, 764, 9, 9, H_GREEN, { r: 2 }),
  r(x0 + pw - 34 - 20, 764, 9, 9, H_BLUE, { r: 2 }),
  r(x0 + pw - 34 - 4, 764, 9, 9, H_RED, { r: 2 }),
];

// Oneomics Hexagon Modern Tri-fold Brochure — Page 1 (Outside)
export function trifoldHex() {
  const s = [];

  // ==========================================
  // PANEL 1: FLAP (Left, 0..367)
  // ==========================================
  s.push(...hHeader(0, 367, 'Who we are', 'About\nONEOMICS'));
  s.push(t('ONEOMICS Private Limited is a genomics company offering one connected portfolio: sequencing services, sample collection and stabilization products, nucleic-acid extraction and library-prep kits, and bioinformatics software.', 34, 172, 300, 11, { color: H_TEXT, font: 'Poppins', lh: 1.4 }));
  s.push(t('From a single saliva sample to a full metagenome, our integrated solutions help researchers, clinicians and agri-scientists move from sample to insight with confidence.', 34, 276, 300, 11, { color: H_TEXT, font: 'Poppins', lh: 1.4 }));

  // Our Mission card
  s.push(r(34, 390, 300, 140, H_SAGE3, { r: 10, stroke: H_LINE, sw: 1 }));
  s.push(r(48, 404, 28, 24, H_BLUE, { r: 6 }));
  s.push(c(62, 416, 4, '#ffffff'));
  s.push(t('Our Mission', 86, 406, 234, 14, { bold: 1, color: H_INK, font: 'Poppins' }));
  s.push(t('To make high-quality genomic science accessible through reliable sequencing, robust sample-stabilization products and dependable molecular tools.', 86, 432, 234, 10.5, { color: H_TEXT, font: 'Poppins', lh: 1.35 }));

  // Our Vision card
  s.push(r(34, 548, 300, 140, H_SAGE3, { r: 10, stroke: H_LINE, sw: 1 }));
  s.push(r(48, 562, 28, 24, H_GREEN, { r: 6 }));
  s.push(c(62, 574, 4, '#ffffff'));
  s.push(t('Our Vision', 86, 564, 234, 14, { bold: 1, color: H_INK, font: 'Poppins' }));
  s.push(t('To be a trusted partner in genomics, enabling discoveries that advance human health, agriculture and the environment.', 86, 590, 234, 10.5, { color: H_TEXT, font: 'Poppins', lh: 1.35 }));

  s.push(...hFooter(0, 367));

  // ==========================================
  // PANEL 2: BACK COVER (Middle, 367..745)
  // ==========================================
  s.push(...hHeader(367, 378, 'Contact', 'Let’s\nwork together'));
  s.push(t('Tell us about your project, sample type or software needs and we will help you choose the right solution.', 401, 172, 310, 11, { color: H_TEXT, font: 'Poppins', lh: 1.4 }));

  // Contacts
  s.push(r(401, 238, 24, 20, H_SAGE, { r: 5 }));
  s.push(c(413, 248, 3.5, H_RED));
  s.push(t('WEB', 435, 236, 70, 9.5, { bold: 1, color: H_FOREST, font: 'Poppins', sp: 60 }));
  s.push(t('www.oneomics.in', 435, 252, 240, 10.5, { color: H_TEXT, font: 'Poppins' }));

  s.push(r(401, 282, 24, 20, H_SAGE, { r: 5 }));
  s.push(c(413, 292, 3.5, H_BLUE));
  s.push(t('EMAIL', 435, 280, 70, 9.5, { bold: 1, color: H_FOREST, font: 'Poppins', sp: 60 }));
  s.push(t('info@oneomics.in', 435, 296, 240, 10.5, { color: H_TEXT, font: 'Poppins' }));

  s.push(r(401, 326, 24, 20, H_SAGE, { r: 5 }));
  s.push(c(413, 336, 3.5, H_GREEN));
  s.push(t('PHONE', 435, 324, 70, 9.5, { bold: 1, color: H_FOREST, font: 'Poppins', sp: 60 }));
  s.push(t('+91 00000 00000', 435, 340, 240, 10.5, { color: H_TEXT, font: 'Poppins' }));

  s.push(r(401, 370, 24, 20, H_SAGE, { r: 5 }));
  s.push(c(413, 380, 3.5, H_RED));
  s.push(t('ADDRESS', 435, 368, 70, 9.5, { bold: 1, color: H_FOREST, font: 'Poppins', sp: 60 }));
  s.push(t('Bharathidasan University Technology Park, Khajamalai Campus, Tiruchirappalli – 620 023', 435, 384, 240, 10.5, { color: H_TEXT, font: 'Poppins', lh: 1.35 }));

  s.push(r(401, 452, 310, 1, H_LINE));
  s.push(t('AT A GLANCE', 401, 468, 310, 10, { bold: 1, color: H_FOREST, font: 'Poppins', sp: 80 }));

  s.push(r(401, 496, 28, 22, H_RED, { r: 5 }));
  s.push(t('11', 401, 499, 28, 10.5, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('Sequencing service lines', 440, 499, 260, 11, { color: H_INK, font: 'Poppins' }));

  s.push(r(401, 532, 28, 22, H_BLUE, { r: 5 }));
  s.push(t('13', 401, 535, 28, 10.5, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('Kits, buffers and reagents', 440, 535, 260, 11, { color: H_INK, font: 'Poppins' }));

  s.push(r(401, 568, 28, 22, H_GREEN, { r: 5 }));
  s.push(t('3', 401, 571, 28, 10.5, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('DNASTAR Lasergene modules', 440, 571, 260, 11, { color: H_INK, font: 'Poppins' }));

  s.push({ k: 'image', src: '/assets/oneomics_logo2.png', x: 401, y: 680, w: 130 });
  s.push(...hFooter(367, 378));

  // ==========================================
  // PANEL 3: FRONT COVER (Right, 745..1123)
  // ==========================================
  s.push({ k: 'image', src: '/assets/honeycomb_front_transparent.png', x: 745, y: 440, w: 378 });
  s.push({ k: 'image', src: '/assets/oneomics_logo2.png', x: 779, y: 42, w: 200 });

  s.push(t('GENOMICS SOLUTIONS', 779, 138, 310, 10, { bold: 1, color: H_FOREST, font: 'Poppins', sp: 80 }));
  s.push(t('Sequencing.\nKits.', 779, 168, 310, 36, { bold: 1, color: H_INK, font: 'Poppins', lh: 1.15 }));
  s.push(t('Software.', 779, 252, 310, 36, { bold: 1, color: H_FOREST, font: 'Poppins', lh: 1.15 }));
  s.push(r(779, 310, 48, 4, H_FOREST, { r: 2 }));
  s.push(t('One connected partner, from sample collection to sequencing and analysis.', 779, 332, 300, 12, { color: H_TEXT, font: 'Poppins', lh: 1.45 }));

  return s;
}

// Oneomics Hexagon Modern Tri-fold Brochure — Page 2 (Inside)
export function trifoldHexInside() {
  const s = [];

  // ==========================================
  // PANEL A: SEQUENCING SERVICES (Left: 0..378)
  // ==========================================
  s.push(...hHeader(0, 378, 'Next generation sequencing', 'Sequencing\nServices'));

  // Service 01
  s.push(r(34, 166, 26, 20, H_RED, { r: 5 }));
  s.push(t('01', 34, 168, 26, 10, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('Whole Genome Sequencing', 68, 166, 276, 13, { bold: 1, color: H_INK, font: 'Poppins' }));
  s.push(t('• De novo Sequencing\n• Hi-C Genome Sequencing\n• Mitochondrial Genome Sequencing', 68, 192, 135, 9.5, { color: H_TEXT, font: 'Poppins', lh: 1.35 }));
  s.push(t('• Reference-Based Sequencing\n• Chloroplast Genome Sequencing', 210, 192, 135, 9.5, { color: H_TEXT, font: 'Poppins', lh: 1.35 }));
  s.push(r(34, 256, 310, 1, H_LINE));

  // Service 02
  s.push(r(34, 272, 26, 20, H_BLUE, { r: 5 }));
  s.push(t('02', 34, 274, 26, 10, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('Whole Exome Sequencing', 68, 272, 276, 13, { bold: 1, color: H_INK, font: 'Poppins' }));
  s.push(r(34, 308, 310, 1, H_LINE));

  // Service 03
  s.push(r(34, 324, 26, 20, H_GREEN, { r: 5 }));
  s.push(t('03', 34, 326, 26, 10, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('Epigenetics', 68, 324, 276, 13, { bold: 1, color: H_INK, font: 'Poppins' }));
  s.push(t('• Whole Genome Bisulfite Sequencing', 68, 348, 135, 9.5, { color: H_TEXT, font: 'Poppins', lh: 1.35 }));
  s.push(t('• Whole Genome Methylation Sequencing', 210, 348, 135, 9.5, { color: H_TEXT, font: 'Poppins', lh: 1.35 }));
  s.push(r(34, 394, 310, 1, H_LINE));

  // Service 04
  s.push(r(34, 410, 26, 20, H_RED, { r: 5 }));
  s.push(t('04', 34, 412, 26, 10, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('Genotyping By Sequencing', 68, 410, 276, 13, { bold: 1, color: H_INK, font: 'Poppins' }));
  s.push(r(34, 446, 310, 1, H_LINE));

  // Service 05
  s.push(r(34, 462, 26, 20, H_BLUE, { r: 5 }));
  s.push(t('05', 34, 464, 26, 10, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('Metagenome Sequencing', 68, 462, 276, 13, { bold: 1, color: H_INK, font: 'Poppins' }));
  s.push(t('• 16S (V3–V4) Metagenome\n• ITS Metagenome\n• Shotgun Metagenome\n• Meta-Barcoding', 68, 488, 135, 9.5, { color: H_TEXT, font: 'Poppins', lh: 1.35 }));
  s.push(t('• 16S (V1–V9) rRNA\n• 18S Metagenome\n• Custom Amplicon', 210, 488, 135, 9.5, { color: H_TEXT, font: 'Poppins', lh: 1.35 }));

  s.push(...hFooter(0, 378));

  // ==========================================
  // PANEL B: SEQUENCING SERVICES CONT. (Middle: 378..756)
  // ==========================================
  s.push(r(378, 0, 378, 794, H_SAGE3));
  s.push(...hHeader(378, 378, 'Next generation sequencing', 'Sequencing\nServices (cont.)'));

  // Service 06
  s.push(r(412, 166, 26, 20, H_GREEN, { r: 5 }));
  s.push(t('06', 412, 168, 26, 10, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('Transcriptome Sequencing', 446, 166, 276, 13, { bold: 1, color: H_INK, font: 'Poppins' }));
  s.push(t('• Whole Transcriptome\n• Small RNA Sequencing\n• Dual RNA Sequencing\n• Isoform Sequencing', 446, 192, 135, 9.5, { color: H_TEXT, font: 'Poppins', lh: 1.35 }));
  s.push(t('• mRNA Sequencing\n• Metatranscriptome\n• Single Cell RNA', 588, 192, 135, 9.5, { color: H_TEXT, font: 'Poppins', lh: 1.35 }));
  s.push(r(412, 276, 310, 1, H_LINE));

  // Service 07
  s.push(r(412, 290, 26, 20, H_RED, { r: 5 }));
  s.push(t('07', 412, 292, 26, 10, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('Long Read Sequencing', 446, 290, 276, 13, { bold: 1, color: H_INK, font: 'Poppins' }));
  s.push(t('• PacBio Sequencing', 446, 314, 135, 9.5, { color: H_TEXT, font: 'Poppins' }));
  s.push(t('• Nanopore Sequencing', 588, 314, 135, 9.5, { color: H_TEXT, font: 'Poppins' }));
  s.push(r(412, 342, 310, 1, H_LINE));

  // 2x2 Grid for 08-11
  s.push(r(412, 356, 150, 44, '#ffffff', { r: 6, stroke: H_LINE, sw: 1 }));
  s.push(r(420, 366, 22, 18, H_RED, { r: 4 }));
  s.push(t('08', 420, 368, 22, 9, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('qRT-PCR\nValidation', 448, 362, 108, 9.5, { bold: 1, color: H_INK, font: 'Poppins', lh: 1.2 }));

  s.push(r(572, 356, 150, 44, '#ffffff', { r: 6, stroke: H_LINE, sw: 1 }));
  s.push(r(580, 366, 22, 18, H_BLUE, { r: 4 }));
  s.push(t('09', 580, 368, 22, 9, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('SSR Marker\nValidation', 608, 362, 108, 9.5, { bold: 1, color: H_INK, font: 'Poppins', lh: 1.2 }));

  s.push(r(412, 408, 150, 44, '#ffffff', { r: 6, stroke: H_LINE, sw: 1 }));
  s.push(r(420, 418, 22, 18, H_GREEN, { r: 4 }));
  s.push(t('10', 420, 420, 22, 9, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('Taurine and\nTelomere Assay', 448, 414, 108, 9.5, { bold: 1, color: H_INK, font: 'Poppins', lh: 1.2 }));

  s.push(r(572, 408, 150, 44, '#ffffff', { r: 6, stroke: H_LINE, sw: 1 }));
  s.push(r(580, 418, 22, 18, H_RED, { r: 4 }));
  s.push(t('11', 580, 420, 22, 9, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('ChIP-\nSequencing', 608, 414, 108, 9.5, { bold: 1, color: H_INK, font: 'Poppins', lh: 1.2 }));

  // Lasergene Box
  s.push(r(406, 472, 322, 246, H_SAGE, { r: 12 }));
  s.push(t('SOFTWARE', 422, 484, 290, 9, { bold: 1, color: H_FOREST, font: 'Poppins', sp: 80 }));
  s.push(t('DNASTAR Lasergene', 422, 502, 290, 16, { bold: 1, color: H_INK, font: 'Poppins' }));

  s.push(r(422, 532, 20, 18, H_RED, { r: 4 }));
  s.push(t('1', 422, 534, 20, 9, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('Molecular Biology Module', 450, 530, 260, 11, { bold: 1, color: H_INK, font: 'Poppins' }));
  s.push(t('Sequence viewing, primer design and cloning.', 450, 548, 260, 9.5, { color: H_TEXT, font: 'Poppins' }));

  s.push(r(422, 584, 20, 18, H_BLUE, { r: 4 }));
  s.push(t('2', 422, 586, 20, 9, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('Genomics Module', 450, 582, 260, 11, { bold: 1, color: H_INK, font: 'Poppins' }));
  s.push(t('Assembly and analysis of NGS data.', 450, 600, 260, 9.5, { color: H_TEXT, font: 'Poppins' }));

  s.push(r(422, 636, 20, 18, H_GREEN, { r: 4 }));
  s.push(t('3', 422, 638, 20, 9, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('Proteomics Module', 450, 634, 260, 11, { bold: 1, color: H_INK, font: 'Poppins' }));
  s.push(t('Protein sequence analysis and structure.', 450, 652, 260, 9.5, { color: H_TEXT, font: 'Poppins' }));

  s.push(...hFooter(378, 378));

  // ==========================================
  // PANEL C: OUR RANGE OF PRODUCTS (Right: 756..1123)
  // ==========================================
  s.push(...hHeader(756, 367, 'Kits & reagents', 'Our Range\nof Products'));

  // Section 1: COLLECT & STABILIZE
  s.push(t('COLLECT & STABILIZE', 788, 168, 300, 9.5, { bold: 1, color: H_RED, font: 'Poppins', sp: 80 }));
  s.push(r(788, 184, 300, 1.2, H_RED));

  s.push(r(788, 196, 20, 16, H_RED, { r: 4 }));
  s.push(t('01', 788, 198, 20, 8.5, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('ONESpit™ — Zero-prep saliva collection; DNA stable 1+ year at room temperature.', 814, 196, 274, 9.5, { color: H_TEXT, font: 'Poppins', lh: 1.25 }));

  s.push(r(788, 224, 20, 16, H_RED, { r: 4 }));
  s.push(t('02', 788, 226, 20, 8.5, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('ONEasy™ — Faecal collection & preservation; room-temperature transport up to 2 years*.', 814, 224, 274, 9.5, { color: H_TEXT, font: 'Poppins', lh: 1.25 }));

  s.push(r(788, 252, 20, 16, H_RED, { r: 4 }));
  s.push(t('03', 788, 254, 20, 8.5, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('NucleoGUARD™ — RNA stabilization buffer.', 814, 252, 274, 9.5, { color: H_TEXT, font: 'Poppins', lh: 1.25 }));

  s.push(r(788, 274, 20, 16, H_RED, { r: 4 }));
  s.push(t('04', 788, 276, 20, 8.5, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('RNAguard™ — Ambient shipping of total RNA.', 814, 274, 274, 9.5, { color: H_TEXT, font: 'Poppins', lh: 1.25 }));

  s.push(r(788, 296, 20, 16, H_RED, { r: 4 }));
  s.push(t('05', 788, 298, 20, 8.5, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('ProteinGUARD™ — Ambient shipping of protein.', 814, 296, 274, 9.5, { color: H_TEXT, font: 'Poppins', lh: 1.25 }));

  s.push(r(788, 318, 20, 16, H_RED, { r: 4 }));
  s.push(t('06', 788, 320, 20, 8.5, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('SoilGUARD™ — Soil stabilization buffer.', 814, 318, 274, 9.5, { color: H_TEXT, font: 'Poppins', lh: 1.25 }));

  // Section 2: EXTRACT
  s.push(t('EXTRACT', 788, 350, 300, 9.5, { bold: 1, color: H_BLUE, font: 'Poppins', sp: 80 }));
  s.push(r(788, 366, 300, 1.2, H_BLUE));

  s.push(r(788, 378, 20, 16, H_BLUE, { r: 4 }));
  s.push(t('07', 788, 380, 20, 8.5, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('ONEMag™ Rapid Universal DNA — Under 30 minutes, from diverse sample types.', 814, 378, 274, 9.5, { color: H_TEXT, font: 'Poppins', lh: 1.25 }));

  s.push(r(788, 406, 20, 16, H_BLUE, { r: 4 }));
  s.push(t('08', 788, 408, 20, 8.5, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('ONEMag™ Rapid Soil DNA — Efficient removal of humic acids.', 814, 406, 274, 9.5, { color: H_TEXT, font: 'Poppins', lh: 1.25 }));

  s.push(r(788, 428, 20, 16, H_BLUE, { r: 4 }));
  s.push(t('09', 788, 430, 20, 8.5, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('ONEMag™ Rapid Plant DNA — For polysaccharide- and polyphenol-rich tissue.', 814, 428, 274, 9.5, { color: H_TEXT, font: 'Poppins', lh: 1.25 }));

  s.push(r(788, 456, 20, 16, H_BLUE, { r: 4 }));
  s.push(t('10', 788, 458, 20, 8.5, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('ONEMag™ Rapid Soil RNA — High-integrity RNA from soil samples.', 814, 456, 274, 9.5, { color: H_TEXT, font: 'Poppins', lh: 1.25 }));

  // Section 3: AMPLIFY & SEQUENCE
  s.push(t('AMPLIFY & SEQUENCE', 788, 488, 300, 9.5, { bold: 1, color: H_GREEN, font: 'Poppins', sp: 80 }));
  s.push(r(788, 504, 300, 1.2, H_GREEN));

  s.push(r(788, 516, 20, 16, H_GREEN, { r: 4 }));
  s.push(t('11', 788, 518, 20, 8.5, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('ONENext™ 16S (V3–V4) — Library prep kit for Illumina.', 814, 516, 274, 9.5, { color: H_TEXT, font: 'Poppins', lh: 1.25 }));

  s.push(r(788, 542, 20, 16, H_GREEN, { r: 4 }));
  s.push(t('12', 788, 544, 20, 8.5, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('ONENext™ 16S (V1–V9) — Full-length library prep kit for ONT.', 814, 542, 274, 9.5, { color: H_TEXT, font: 'Poppins', lh: 1.25 }));

  s.push(r(788, 568, 20, 16, H_GREEN, { r: 4 }));
  s.push(t('13', 788, 570, 20, 8.5, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('2X Taq Plus PCR Master Mix — Ready-to-use, with RED dye for direct gel loading.', 814, 568, 274, 9.5, { color: H_TEXT, font: 'Poppins', lh: 1.25 }));

  s.push(t('*Under validated storage conditions. Refer to the product datasheet.', 788, 724, 300, 8.5, { italic: 1, color: H_MUTED, font: 'Poppins' }));
  s.push(...hFooter(756, 367));

  return s;
}

// Colors for Oneomics "Reading Life / Chromatogram" Tri-fold Brochure (Design 5)
const C_BG = '#F6F5FC';
const C_LAV = '#ECEAF9';
const C_INK = '#1D2142';
const C_TEXT = '#41465F';
const C_MUTED = '#8286A0';
const C_LINE = '#DAD8EE';
const C_INDIGO = '#4448B8';
const C_RED = '#E23B32';
const C_BLUE = '#0793EB';
const C_GREEN = '#33A015';
const C_AMBER = '#F2A33A';

const CP_RED = '#FDE6E3';
const CP_BLUE = '#DDEEFC';
const CP_GREEN = '#E0F3DA';
const CP_AMBER = '#FDEFD6';
const CP_IND = '#E6E6F8';

const cTab = (x, y, text) => [
  r(x, y, 130, 22, C_LAV, { r: 11 }),
  c(x + 11, y + 11, 3.5, C_INDIGO),
  t(text.toUpperCase(), x + 20, y + 5, 105, 8.5, { bold: 1, color: C_INDIGO, font: 'Poppins', sp: 60 }),
];

const cTitle = (x, y, kicker, titleHtml) => [
  ...cTab(x, y, kicker),
  t(titleHtml, x, y + 32, 290, 23, { bold: 1, color: C_INK, font: 'Poppins', lh: 1.15 }),
  { k: 'image', src: '/assets/chroma_squiggle_transparent.png', x: x, y: y + 96, w: 90 },
];

const cFooter = (x0, pw) => [
  t('ONEOMICS', x0 + 34, 764, 100, 8.5, { bold: 1, color: C_MUTED, font: 'Poppins' }),
  t('A', x0 + pw - 34 - 36, 762, 12, 10.5, { bold: 1, color: C_GREEN, font: 'Courier' }),
  t('T', x0 + pw - 34 - 24, 762, 12, 10.5, { bold: 1, color: C_RED, font: 'Courier' }),
  t('G', x0 + pw - 34 - 12, 762, 12, 10.5, { bold: 1, color: C_AMBER, font: 'Courier' }),
  t('C', x0 + pw - 34, 762, 12, 10.5, { bold: 1, color: C_BLUE, font: 'Courier' }),
];

// Oneomics Chromatogram Tri-fold Brochure ("Reading life, one base at a time") — Page 1 (Outside)
export function trifoldChroma() {
  const s = [];

  // ==========================================
  // PANEL 1: FLAP (Left, 0..367)
  // ==========================================
  s.push(r(0, 0, 367, 794, C_BG));
  s.push(...cTitle(34, 34, 'Who we are', 'About\nONEOMICS'));
  s.push(t('ONEOMICS Private Limited is a genomics company offering one connected portfolio: sequencing services, sample collection and stabilization products, nucleic-acid extraction and library-prep kits, and bioinformatics software.', 34, 154, 300, 11, { color: C_TEXT, font: 'Poppins', lh: 1.4 }));
  s.push(t('From a single saliva sample to a full metagenome, our integrated solutions help researchers, clinicians and agri-scientists move from sample to insight with confidence.', 34, 258, 300, 11, { color: C_TEXT, font: 'Poppins', lh: 1.4 }));

  // Mission Card
  s.push(r(34, 370, 300, 135, CP_AMBER, { r: 12 }));
  s.push(r(50, 386, 32, 6, C_AMBER, { r: 3 }));
  s.push(t('Our Mission', 50, 400, 268, 14, { bold: 1, color: C_INK, font: 'Poppins' }));
  s.push(t('To make high-quality genomic science accessible through reliable sequencing, robust sample-stabilization products and dependable molecular tools.', 50, 426, 268, 10.5, { color: C_TEXT, font: 'Poppins', lh: 1.35 }));

  // Vision Card
  s.push(r(34, 525, 300, 135, CP_BLUE, { r: 12 }));
  s.push(r(50, 541, 32, 6, C_BLUE, { r: 3 }));
  s.push(t('Our Vision', 50, 555, 268, 14, { bold: 1, color: C_INK, font: 'Poppins' }));
  s.push(t('To be a trusted partner in genomics, enabling discoveries that advance human health, agriculture and the environment.', 50, 581, 268, 10.5, { color: C_TEXT, font: 'Poppins', lh: 1.35 }));

  s.push({ k: 'image', src: '/assets/oneomics_logo2.png', x: 34, y: 686, w: 125 });
  s.push(...cFooter(0, 367));

  // ==========================================
  // PANEL 2: BACK COVER (Middle, 367..745)
  // ==========================================
  s.push(...cTitle(401, 34, 'Software', 'DNASTAR\nLasergene'));
  s.push(t('The trusted desktop suite for sequence analysis, genome assembly and protein research, available through ONEOMICS.', 401, 154, 310, 11, { color: C_TEXT, font: 'Poppins', lh: 1.4 }));

  // 3 Modules
  s.push(r(401, 218, 310, 68, CP_RED, { r: 10 }));
  s.push(c(418, 236, 15, C_RED));
  s.push(t('M', 418, 240, 30, 13, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('Molecular Biology Module', 458, 228, 245, 12.5, { bold: 1, color: C_INK, font: 'Poppins' }));
  s.push(t('Sequence viewing, primer design, cloning and DNA/RNA analysis.', 458, 248, 245, 10, { color: C_TEXT, font: 'Poppins', lh: 1.3 }));

  s.push(r(401, 296, 310, 68, CP_BLUE, { r: 10 }));
  s.push(c(418, 314, 15, C_BLUE));
  s.push(t('G', 418, 318, 30, 13, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('Genomics Module', 458, 306, 245, 12.5, { bold: 1, color: C_INK, font: 'Poppins' }));
  s.push(t('Assembly, alignment and analysis of next-generation sequencing data.', 458, 326, 245, 10, { color: C_TEXT, font: 'Poppins', lh: 1.3 }));

  s.push(r(401, 374, 310, 68, CP_GREEN, { r: 10 }));
  s.push(c(418, 392, 15, C_GREEN));
  s.push(t('P', 418, 396, 30, 13, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('Proteomics Module', 458, 384, 245, 12.5, { bold: 1, color: C_INK, font: 'Poppins' }));
  s.push(t('Protein sequence analysis, structure prediction and visualization.', 458, 404, 245, 10, { color: C_TEXT, font: 'Poppins', lh: 1.3 }));

  // Contact Box
  s.push(r(393, 462, 326, 270, C_LAV, { r: 12 }));
  s.push(t('Get in touch', 411, 480, 290, 16, { bold: 1, color: C_INK, font: 'Poppins' }));
  s.push(t('Tell us about your project, sample type or software needs.', 411, 506, 290, 10, { color: C_MUTED, font: 'Poppins', lh: 1.35 }));

  s.push(r(411, 540, 6, 20, C_RED, { r: 3 }));
  s.push(t('WEB', 426, 536, 60, 8.5, { bold: 1, color: C_MUTED, font: 'Poppins', sp: 60 }));
  s.push(t('www.oneomics.in', 426, 550, 250, 10.5, { color: C_INK, font: 'Poppins' }));

  s.push(r(411, 580, 6, 20, C_BLUE, { r: 3 }));
  s.push(t('EMAIL', 426, 576, 60, 8.5, { bold: 1, color: C_MUTED, font: 'Poppins', sp: 60 }));
  s.push(t('info@oneomics.in', 426, 590, 250, 10.5, { color: C_INK, font: 'Poppins' }));

  s.push(r(411, 620, 6, 20, C_GREEN, { r: 3 }));
  s.push(t('PHONE', 426, 616, 60, 8.5, { bold: 1, color: C_MUTED, font: 'Poppins', sp: 60 }));
  s.push(t('+91 00000 00000', 426, 630, 250, 10.5, { color: C_INK, font: 'Poppins' }));

  s.push(r(411, 660, 6, 20, C_AMBER, { r: 3 }));
  s.push(t('ADDRESS', 426, 656, 60, 8.5, { bold: 1, color: C_MUTED, font: 'Poppins', sp: 60 }));
  s.push(t('Bharathidasan University Technology Park, Khajamalai Campus, Tiruchirappalli – 620 023', 426, 670, 250, 10, { color: C_INK, font: 'Poppins', lh: 1.3 }));

  s.push(...cFooter(367, 378));

  // ==========================================
  // PANEL 3: FRONT COVER (Right, 745..1123)
  // ==========================================
  s.push(r(745, 0, 378, 794, C_BG));
  s.push({ k: 'image', src: '/assets/chromatogram_band_transparent.png', x: 745, y: 418, w: 378 });
  s.push({ k: 'image', src: '/assets/oneomics_logo2.png', x: 779, y: 42, w: 200 });

  s.push(t('Reading life,', 779, 154, 310, 34, { bold: 1, color: C_INK, font: 'Poppins', lh: 1.15 }));
  s.push(t('one base at\na time.', 779, 196, 310, 34, { bold: 1, color: C_INDIGO, font: 'Poppins', lh: 1.15 }));
  s.push(r(779, 284, 52, 4.5, C_INDIGO, { r: 2.2 }));
  s.push(t('Sequencing services, sample collection kits and DNASTAR Lasergene software.', 779, 308, 300, 12, { color: C_TEXT, font: 'Poppins', lh: 1.45 }));

  return s;
}

// Oneomics Chromatogram Tri-fold Brochure — Page 2 (Inside)
export function trifoldChromaInside() {
  const s = [];

  // ==========================================
  // PANEL A: SEQUENCING SERVICES (Left: 0..378)
  // ==========================================
  s.push(...cTitle(34, 34, 'Next generation sequencing', 'Sequencing\nServices'));
  s.push(r(48, 172, 2.5, 470, C_LINE));

  // Service 01
  s.push(c(49, 175, 14, '#ffffff'));
  s.push(c(49, 175, 11, C_RED));
  s.push(t('01', 37, 180, 24, 9, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('Whole Genome Sequencing', 74, 164, 270, 13, { bold: 1, color: C_INK, font: 'Poppins' }));
  const s01Chips = ['De novo', 'Reference-Based', 'Hi-C Genome', 'Chloroplast Genome', 'Mitochondrial Genome'];
  s01Chips.forEach((chip, i) => {
    const colIdx = i % 2;
    const rowIdx = Math.floor(i / 2);
    const cx = 74 + colIdx * 135;
    const cy = 192 + rowIdx * 24;
    s.push(r(cx, cy, 128, 19, CP_RED, { r: 9 }));
    s.push(t(chip, cx + 8, cy + 3.5, 112, 9, { color: C_INK, font: 'Poppins' }));
  });

  // Service 02
  s.push(c(49, 293, 14, '#ffffff'));
  s.push(c(49, 293, 11, C_BLUE));
  s.push(t('02', 37, 298, 24, 9, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('Whole Exome Sequencing', 74, 282, 270, 13, { bold: 1, color: C_INK, font: 'Poppins' }));

  // Service 03
  s.push(c(49, 353, 14, '#ffffff'));
  s.push(c(49, 353, 11, C_GREEN));
  s.push(t('03', 37, 358, 24, 9, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('Epigenetics', 74, 342, 270, 13, { bold: 1, color: C_INK, font: 'Poppins' }));
  s.push(r(74, 370, 260, 19, CP_GREEN, { r: 9 }));
  s.push(t('Whole Genome Bisulfite Sequencing', 82, 373.5, 244, 9, { color: C_INK, font: 'Poppins' }));
  s.push(r(74, 394, 260, 19, CP_GREEN, { r: 9 }));
  s.push(t('Whole Genome Methylation Sequencing', 82, 397.5, 244, 9, { color: C_INK, font: 'Poppins' }));

  // Service 04
  s.push(c(49, 453, 14, '#ffffff'));
  s.push(c(49, 453, 11, C_AMBER));
  s.push(t('04', 37, 458, 24, 9, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('Genotyping By Sequencing', 74, 442, 270, 13, { bold: 1, color: C_INK, font: 'Poppins' }));

  // Service 05
  s.push(c(49, 513, 14, '#ffffff'));
  s.push(c(49, 513, 11, C_INDIGO));
  s.push(t('05', 37, 518, 24, 9, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('Metagenome Sequencing', 74, 502, 270, 13, { bold: 1, color: C_INK, font: 'Poppins' }));
  const s05Chips = ['16S (V3–V4)', '16S (V1–V9) rRNA', 'ITS', '18S', 'Shotgun', 'Custom Amplicon', 'Meta-Barcoding'];
  s05Chips.forEach((chip, i) => {
    const colIdx = i % 2;
    const rowIdx = Math.floor(i / 2);
    const cx = 74 + colIdx * 135;
    const cy = 530 + rowIdx * 24;
    s.push(r(cx, cy, 128, 19, CP_IND, { r: 9 }));
    s.push(t(chip, cx + 8, cy + 3.5, 112, 9, { color: C_INK, font: 'Poppins' }));
  });

  s.push(...cFooter(0, 378));

  // ==========================================
  // PANEL B: SEQUENCING SERVICES CONT. (Middle: 378..756)
  // ==========================================
  s.push(r(378, 0, 378, 794, C_BG));
  s.push(...cTitle(412, 34, 'Next generation sequencing', 'Sequencing\nServices (cont.)'));
  s.push(r(426, 172, 2.5, 430, C_LINE));

  // Service 06
  s.push(c(427, 175, 14, '#ffffff'));
  s.push(c(427, 175, 11, C_GREEN));
  s.push(t('06', 415, 180, 24, 9, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('Transcriptome Sequencing', 452, 164, 270, 13, { bold: 1, color: C_INK, font: 'Poppins' }));
  const s06Chips = ['Whole Transcriptome', 'mRNA', 'Small RNA', 'Metatranscriptome', 'Dual RNA', 'Single Cell RNA', 'Isoform (RNA)'];
  s06Chips.forEach((chip, i) => {
    const colIdx = i % 2;
    const rowIdx = Math.floor(i / 2);
    const cx = 452 + colIdx * 132;
    const cy = 192 + rowIdx * 24;
    s.push(r(cx, cy, 126, 19, CP_GREEN, { r: 9 }));
    s.push(t(chip, cx + 8, cy + 3.5, 110, 9, { color: C_INK, font: 'Poppins' }));
  });

  // Service 07
  s.push(c(427, 303, 14, '#ffffff'));
  s.push(c(427, 303, 11, C_AMBER));
  s.push(t('07', 415, 298, 24, 9, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('Long Read Sequencing', 452, 292, 270, 13, { bold: 1, color: C_INK, font: 'Poppins' }));
  s.push(r(452, 320, 126, 19, CP_AMBER, { r: 9 }));
  s.push(t('PacBio', 460, 323.5, 110, 9, { color: C_INK, font: 'Poppins' }));
  s.push(r(584, 320, 126, 19, CP_AMBER, { r: 9 }));
  s.push(t('Nanopore', 592, 323.5, 110, 9, { color: C_INK, font: 'Poppins' }));

  // Service 08
  s.push(c(427, 373, 14, '#ffffff'));
  s.push(c(427, 373, 11, C_INDIGO));
  s.push(t('08', 415, 378, 24, 9, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('qRT-PCR Validation', 452, 362, 270, 13, { bold: 1, color: C_INK, font: 'Poppins' }));

  // Service 09
  s.push(c(427, 427, 14, '#ffffff'));
  s.push(c(427, 427, 11, C_RED));
  s.push(t('09', 415, 432, 24, 9, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('SSR Marker Validation', 452, 416, 270, 13, { bold: 1, color: C_INK, font: 'Poppins' }));

  // Service 10
  s.push(c(427, 481, 14, '#ffffff'));
  s.push(c(427, 481, 11, C_BLUE));
  s.push(t('10', 415, 486, 24, 9, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('Taurine and Telomere Assay', 452, 470, 270, 13, { bold: 1, color: C_INK, font: 'Poppins' }));

  // Service 11
  s.push(c(427, 535, 14, '#ffffff'));
  s.push(c(427, 535, 11, C_GREEN));
  s.push(t('11', 415, 540, 24, 9, { bold: 1, color: '#ffffff', align: 'center', font: 'Poppins' }));
  s.push(t('ChIP-Sequencing', 452, 524, 270, 13, { bold: 1, color: C_INK, font: 'Poppins' }));

  // Custom project callout
  s.push(r(412, 592, 310, 110, '#ffffff', { r: 12, stroke: C_LINE, sw: 1.2 }));
  s.push(t('Have a custom project?', 428, 608, 278, 14, { bold: 1, color: C_INK, font: 'Poppins' }));
  s.push(t('Share your sample type and research goal and our team will help you choose the right sequencing approach.', 428, 636, 278, 10.5, { color: C_TEXT, font: 'Poppins', lh: 1.35 }));

  s.push(...cFooter(378, 378));

  // ==========================================
  // PANEL C: OUR RANGE OF PRODUCTS (Right: 756..1123)
  // ==========================================
  s.push(...cTitle(788, 34, 'Kits & reagents', 'Our Range\nof Products'));

  // Section 1: COLLECT & STABILIZE
  s.push(c(794, 162, 3.5, C_RED));
  s.push(t('COLLECT & STABILIZE', 804, 154, 280, 9.5, { bold: 1, color: C_RED, font: 'Poppins', sp: 60 }));

  s.push(r(788, 176, 145, 68, CP_RED, { r: 8 }));
  s.push(t('ONESpit™', 794, 182, 133, 10, { bold: 1, color: C_INK, font: 'Poppins' }));
  s.push(t('Zero-prep saliva collection; DNA stable 1+ year at room temp.', 794, 200, 133, 8.5, { color: C_TEXT, font: 'Poppins', lh: 1.2 }));

  s.push(r(941, 176, 145, 68, CP_RED, { r: 8 }));
  s.push(t('ONEasy™', 947, 182, 133, 10, { bold: 1, color: C_INK, font: 'Poppins' }));
  s.push(t('Faecal collection & preservation; room-temp transport up to 2 years*.', 947, 200, 133, 8.5, { color: C_TEXT, font: 'Poppins', lh: 1.2 }));

  s.push(r(788, 252, 145, 52, CP_RED, { r: 8 }));
  s.push(t('NucleoGUARD™', 794, 258, 133, 10, { bold: 1, color: C_INK, font: 'Poppins' }));
  s.push(t('RNA stabilization buffer.', 794, 276, 133, 8.5, { color: C_TEXT, font: 'Poppins' }));

  s.push(r(941, 252, 145, 52, CP_RED, { r: 8 }));
  s.push(t('RNAguard™', 947, 258, 133, 10, { bold: 1, color: C_INK, font: 'Poppins' }));
  s.push(t('Ambient shipping of total RNA.', 947, 276, 133, 8.5, { color: C_TEXT, font: 'Poppins' }));

  s.push(r(788, 312, 145, 52, CP_RED, { r: 8 }));
  s.push(t('ProteinGUARD™', 794, 318, 133, 10, { bold: 1, color: C_INK, font: 'Poppins' }));
  s.push(t('Ambient shipping of protein.', 794, 336, 133, 8.5, { color: C_TEXT, font: 'Poppins' }));

  s.push(r(941, 312, 145, 52, CP_RED, { r: 8 }));
  s.push(t('SoilGUARD™', 947, 318, 133, 10, { bold: 1, color: C_INK, font: 'Poppins' }));
  s.push(t('Soil stabilization buffer.', 947, 336, 133, 8.5, { color: C_TEXT, font: 'Poppins' }));

  // Section 2: EXTRACT
  s.push(c(794, 380, 3.5, C_BLUE));
  s.push(t('EXTRACT', 804, 372, 280, 9.5, { bold: 1, color: C_BLUE, font: 'Poppins', sp: 60 }));

  s.push(r(788, 394, 145, 68, CP_BLUE, { r: 8 }));
  s.push(t('ONEMag™ Rapid\nUniversal DNA', 794, 400, 133, 9.5, { bold: 1, color: C_INK, font: 'Poppins', lh: 1.15 }));
  s.push(t('Under 30 minutes, diverse sample types.', 794, 426, 133, 8.5, { color: C_TEXT, font: 'Poppins' }));

  s.push(r(941, 394, 145, 68, CP_BLUE, { r: 8 }));
  s.push(t('ONEMag™ Rapid\nSoil DNA', 947, 400, 133, 9.5, { bold: 1, color: C_INK, font: 'Poppins', lh: 1.15 }));
  s.push(t('Efficient removal of humic acids.', 947, 426, 133, 8.5, { color: C_TEXT, font: 'Poppins' }));

  s.push(r(788, 470, 145, 68, CP_BLUE, { r: 8 }));
  s.push(t('ONEMag™ Rapid\nPlant DNA', 794, 476, 133, 9.5, { bold: 1, color: C_INK, font: 'Poppins', lh: 1.15 }));
  s.push(t('For polysaccharide- and polyphenol-rich tissue.', 794, 502, 133, 8.5, { color: C_TEXT, font: 'Poppins' }));

  s.push(r(941, 470, 145, 68, CP_BLUE, { r: 8 }));
  s.push(t('ONEMag™ Rapid\nSoil RNA', 947, 476, 133, 9.5, { bold: 1, color: C_INK, font: 'Poppins', lh: 1.15 }));
  s.push(t('High-integrity RNA from soil samples.', 947, 502, 133, 8.5, { color: C_TEXT, font: 'Poppins' }));

  // Section 3: AMPLIFY & SEQUENCE
  s.push(c(794, 554, 3.5, C_GREEN));
  s.push(t('AMPLIFY & SEQUENCE', 804, 546, 280, 9.5, { bold: 1, color: C_GREEN, font: 'Poppins', sp: 60 }));

  s.push(r(788, 568, 145, 60, CP_GREEN, { r: 8 }));
  s.push(t('ONENext™ 16S (V3–V4)', 794, 574, 133, 9.5, { bold: 1, color: C_INK, font: 'Poppins' }));
  s.push(t('Library prep kit for Illumina.', 794, 596, 133, 8.5, { color: C_TEXT, font: 'Poppins' }));

  s.push(r(941, 568, 145, 60, CP_GREEN, { r: 8 }));
  s.push(t('ONENext™ 16S (V1–V9)', 947, 574, 133, 9.5, { bold: 1, color: C_INK, font: 'Poppins' }));
  s.push(t('Full-length library prep kit for ONT.', 947, 596, 133, 8.5, { color: C_TEXT, font: 'Poppins' }));

  s.push(r(788, 636, 298, 52, CP_GREEN, { r: 8 }));
  s.push(t('2X Taq Plus PCR Master Mix', 794, 642, 286, 10, { bold: 1, color: C_INK, font: 'Poppins' }));
  s.push(t('Ready-to-use, with RED dye for direct gel loading.', 794, 660, 286, 8.5, { color: C_TEXT, font: 'Poppins' }));

  s.push(t('*Under validated storage conditions. Refer to the product datasheet.', 788, 724, 300, 8.5, { italic: 1, color: C_MUTED, font: 'Poppins' }));
  s.push(...cFooter(756, 367));

  return s;
}

// Colors for Oneomics "Genomics, end to end" (Warm Apricot / Swiss Modern) Tri-fold Brochure (Design 6)
const A_INK = '#14202B';
const A_TEXT = '#44505B';
const A_MUTED = '#8A949D';
const A_HAIR = '#E2E5E8';
const A_ORANGE = '#FF7A45';
const A_APRICOT = '#FFF0E5';
const A_APRICOT2 = '#FFE0CC';
const A_PAPER = '#FFFFFF';

const aTitle = (x, y, kicker, titleHtml, size = 23) => [
  r(x, y, 38, 4.5, A_ORANGE, { r: 2.2 }),
  t(kicker.toUpperCase(), x, y + 10, 300, 8.5, { bold: 1, color: A_MUTED, font: 'Poppins', sp: 60 }),
  t(titleHtml, x, y + 26, 300, size, { bold: 1, color: A_INK, font: 'Poppins', lh: 1.15 }),
];

const aFooter = (x0, pw, label = 'GENOMICS SOLUTIONS') => [
  r(x0 + 34, 750, pw - 68, 1, A_HAIR),
  t('ONEOMICS', x0 + 34, 760, 120, 9, { bold: 1, color: A_INK, font: 'Poppins' }),
  t(label, x0 + pw - 34 - 170, 760, 170, 8.5, { color: A_MUTED, align: 'right', font: 'Poppins' }),
];

// Oneomics "Genomics, end to end" Tri-fold Brochure — Page 1 (Outside)
export function trifoldApricot() {
  const s = [];

  // ==========================================
  // PANEL 1: FLAP (Left, 0..367)
  // ==========================================
  s.push(r(0, 0, 367, 794, A_PAPER));
  s.push(...aTitle(34, 34, 'Who we are', 'About\nONEOMICS'));
  s.push(t('One connected portfolio for genomics.', 34, 118, 300, 13.5, { bold: 1, color: A_INK, font: 'Poppins', lh: 1.25 }));
  s.push(t('ONEOMICS Private Limited is a genomics company offering sequencing services, sample collection and stabilization products, nucleic-acid extraction and library-prep kits, and bioinformatics software.', 34, 154, 300, 10.5, { color: A_TEXT, font: 'Poppins', lh: 1.38 }));
  s.push(t('From a single saliva sample to a full metagenome, our solutions help researchers, clinicians and agri-scientists move from sample to insight with confidence.', 34, 248, 300, 10.5, { color: A_TEXT, font: 'Poppins', lh: 1.38 }));

  // Mission
  s.push(r(34, 335, 300, 1.2, A_INK));
  s.push(t('Our Mission', 34, 348, 300, 13, { bold: 1, color: A_INK, font: 'Poppins' }));
  s.push(t('To make high-quality genomic science accessible through reliable sequencing, robust sample-stabilization products and dependable molecular tools.', 34, 374, 300, 10.5, { color: A_TEXT, font: 'Poppins', lh: 1.35 }));

  // Vision
  s.push(r(34, 452, 300, 1.2, A_INK));
  s.push(t('Our Vision', 34, 465, 300, 13, { bold: 1, color: A_INK, font: 'Poppins' }));
  s.push(t('To be a trusted partner in genomics, enabling discoveries that advance human health, agriculture and the environment.', 34, 491, 300, 10.5, { color: A_TEXT, font: 'Poppins', lh: 1.35 }));

  s.push({ k: 'image', src: '/assets/oneomics_logo2.png', x: 34, y: 686, w: 125 });
  s.push(...aFooter(0, 367));

  // ==========================================
  // PANEL 2: BACK COVER (Middle, 367..745)
  // ==========================================
  s.push(r(367, 0, 378, 794, A_PAPER));
  s.push(...aTitle(401, 34, 'Software', 'DNASTAR\nLasergene'));
  s.push(t('The trusted desktop suite for sequence analysis, genome assembly and protein research, available through ONEOMICS.', 401, 118, 310, 10.5, { color: A_TEXT, font: 'Poppins', lh: 1.38 }));

  s.push(r(401, 172, 310, 1.2, A_INK));

  // Module 1
  s.push(t('1', 401, 184, 30, 22, { bold: 1, color: A_ORANGE, font: 'Poppins' }));
  s.push(t('Molecular Biology Module', 432, 184, 279, 12, { bold: 1, color: A_INK, font: 'Poppins' }));
  s.push(t('Sequence viewing, primer design, cloning and DNA/RNA analysis.', 432, 204, 279, 10, { color: A_TEXT, font: 'Poppins', lh: 1.3 }));
  s.push(r(401, 246, 310, 1, A_HAIR));

  // Module 2
  s.push(t('2', 401, 258, 30, 22, { bold: 1, color: A_ORANGE, font: 'Poppins' }));
  s.push(t('Genomics Module', 432, 258, 279, 12, { bold: 1, color: A_INK, font: 'Poppins' }));
  s.push(t('Assembly, alignment and analysis of next-generation sequencing data.', 432, 278, 279, 10, { color: A_TEXT, font: 'Poppins', lh: 1.3 }));
  s.push(r(401, 320, 310, 1, A_HAIR));

  // Module 3
  s.push(t('3', 401, 332, 30, 22, { bold: 1, color: A_ORANGE, font: 'Poppins' }));
  s.push(t('Proteomics Module', 432, 332, 279, 12, { bold: 1, color: A_INK, font: 'Poppins' }));
  s.push(t('Protein sequence analysis, structure prediction and visualization.', 432, 352, 279, 10, { color: A_TEXT, font: 'Poppins', lh: 1.3 }));
  s.push(r(401, 394, 310, 1, A_HAIR));

  // Contact Box (Apricot)
  s.push(r(367, 432, 378, 300, A_APRICOT));
  s.push(t('Get in touch', 401, 448, 310, 15, { bold: 1, color: A_INK, font: 'Poppins' }));
  s.push(t('Tell us about your project, sample type or software needs.', 401, 472, 310, 10, { color: A_TEXT, font: 'Poppins', lh: 1.35 }));

  s.push(t('WEB', 401, 508, 60, 8, { bold: 1, color: A_ORANGE, font: 'Poppins', sp: 60 }));
  s.push(t('www.oneomics.in', 466, 506, 245, 10.5, { color: A_INK, font: 'Poppins' }));

  s.push(t('EMAIL', 401, 538, 60, 8, { bold: 1, color: A_ORANGE, font: 'Poppins', sp: 60 }));
  s.push(t('info@oneomics.in', 466, 536, 245, 10.5, { color: A_INK, font: 'Poppins' }));

  s.push(t('PHONE', 401, 568, 60, 8, { bold: 1, color: A_ORANGE, font: 'Poppins', sp: 60 }));
  s.push(t('+91 00000 00000', 466, 566, 245, 10.5, { color: A_INK, font: 'Poppins' }));

  s.push(t('ADDRESS', 401, 598, 60, 8, { bold: 1, color: A_ORANGE, font: 'Poppins', sp: 60 }));
  s.push(t('Bharathidasan University Technology Park, Khajamalai Campus, Tiruchirappalli – 620 023', 466, 596, 245, 9.5, { color: A_INK, font: 'Poppins', lh: 1.3 }));

  s.push({ k: 'image', src: '/assets/oneomics_logo2.png', x: 401, y: 662, w: 120 });
  s.push(...aFooter(367, 378));

  // ==========================================
  // PANEL 3: FRONT COVER (Right, 745..1123)
  // ==========================================
  s.push(r(745, 0, 378, 794, A_PAPER));
  s.push(r(745, 0, 378, 436, A_APRICOT));
  s.push({ k: 'image', src: '/assets/constellation_pattern.png', x: 745, y: 88, w: 378, h: 348 });
  s.push({ k: 'image', src: '/assets/oneomics_logo2.png', x: 779, y: 34, w: 200 });

  s.push(r(779, 484, 38, 4.5, A_ORANGE, { r: 2.2 }));
  s.push(t('Genomics,\nend to end.', 779, 500, 310, 34, { bold: 1, color: A_INK, font: 'Poppins', lh: 1.12 }));
  s.push(t('Sequencing services, sample collection kits and DNASTAR Lasergene software from one partner.', 779, 592, 300, 11, { color: A_TEXT, font: 'Poppins', lh: 1.4 }));

  // Metrics
  s.push(r(779, 680, 95, 1.2, A_INK));
  s.push(t('01', 779, 694, 95, 8.5, { bold: 1, color: A_ORANGE, font: 'Poppins' }));
  s.push(t('Sequencing', 779, 712, 95, 11.5, { bold: 1, color: A_INK, font: 'Poppins' }));

  s.push(r(884, 680, 95, 1.2, A_INK));
  s.push(t('02', 884, 694, 95, 8.5, { bold: 1, color: A_ORANGE, font: 'Poppins' }));
  s.push(t('Kits', 884, 712, 95, 11.5, { bold: 1, color: A_INK, font: 'Poppins' }));

  s.push(r(989, 680, 95, 1.2, A_INK));
  s.push(t('03', 989, 694, 95, 8.5, { bold: 1, color: A_ORANGE, font: 'Poppins' }));
  s.push(t('Software', 989, 712, 95, 11.5, { bold: 1, color: A_INK, font: 'Poppins' }));

  return s;
}

// Oneomics "Genomics, end to end" Tri-fold Brochure — Page 2 (Inside)
export function trifoldApricotInside() {
  const s = [];

  // ==========================================
  // PANEL A: SEQUENCING SERVICES (Left: 0..378)
  // ==========================================
  s.push(r(0, 0, 378, 794, A_PAPER));
  s.push(...aTitle(34, 34, 'Next generation sequencing', 'Sequencing\nServices'));
  s.push(r(34, 118, 310, 1.2, A_INK));

  // 01
  s.push(t('01', 34, 130, 42, 22, { bold: 1, color: A_ORANGE, font: 'Poppins' }));
  s.push(t('Whole Genome Sequencing', 82, 130, 262, 12.5, { bold: 1, color: A_INK, font: 'Poppins' }));
  s.push(t('De novo Sequencing  /  Reference-Based Sequencing  /  Hi-C Genome Sequencing  /  Chloroplast Genome Sequencing  /  Mitochondrial Genome Sequencing', 82, 152, 262, 9.5, { color: A_TEXT, font: 'Poppins', lh: 1.35 }));
  s.push(r(34, 234, 310, 1, A_HAIR));

  // 02
  s.push(t('02', 34, 246, 42, 22, { bold: 1, color: A_ORANGE, font: 'Poppins' }));
  s.push(t('Whole Exome Sequencing', 82, 246, 262, 12.5, { bold: 1, color: A_INK, font: 'Poppins' }));
  s.push(r(34, 284, 310, 1, A_HAIR));

  // 03
  s.push(t('03', 34, 296, 42, 22, { bold: 1, color: A_ORANGE, font: 'Poppins' }));
  s.push(t('Epigenetics', 82, 296, 262, 12.5, { bold: 1, color: A_INK, font: 'Poppins' }));
  s.push(t('Whole Genome Bisulfite Sequencing  /  Whole Genome Methylation Sequencing', 82, 318, 262, 9.5, { color: A_TEXT, font: 'Poppins', lh: 1.35 }));
  s.push(r(34, 368, 310, 1, A_HAIR));

  // 04
  s.push(t('04', 34, 380, 42, 22, { bold: 1, color: A_ORANGE, font: 'Poppins' }));
  s.push(t('Genotyping By Sequencing', 82, 380, 262, 12.5, { bold: 1, color: A_INK, font: 'Poppins' }));
  s.push(r(34, 418, 310, 1, A_HAIR));

  // 05
  s.push(t('05', 34, 430, 42, 22, { bold: 1, color: A_ORANGE, font: 'Poppins' }));
  s.push(t('Metagenome Sequencing', 82, 430, 262, 12.5, { bold: 1, color: A_INK, font: 'Poppins' }));
  s.push(t('16S (V3–V4) Metagenome Sequencing  /  16S (V1–V9) rRNA Sequencing  /  ITS Metagenome Sequencing  /  18S Metagenome Sequencing  /  Shotgun Metagenome Sequencing  /  Custom Amplicon Sequencing  /  Meta-Barcoding', 82, 452, 262, 9.5, { color: A_TEXT, font: 'Poppins', lh: 1.35 }));
  s.push(r(34, 574, 310, 1, A_HAIR));
  s.push(...aFooter(0, 378));

  // ==========================================
  // PANEL B: SEQUENCING SERVICES (CONT.) (Middle: 378..756)
  // ==========================================
  s.push(r(378, 0, 378, 794, A_APRICOT));
  s.push(...aTitle(412, 34, 'Next generation sequencing', 'Sequencing\nServices (cont.)'));
  s.push(r(412, 118, 310, 1.2, A_INK));

  // 06
  s.push(t('06', 412, 130, 42, 22, { bold: 1, color: A_ORANGE, font: 'Poppins' }));
  s.push(t('Transcriptome Sequencing', 460, 130, 262, 12.5, { bold: 1, color: A_INK, font: 'Poppins' }));
  s.push(t('Whole Transcriptome (mRNA + lncRNA)  /  mRNA Sequencing  /  Small RNA Sequencing  /  Metatranscriptome Sequencing  /  Dual RNA Sequencing  /  Single Cell RNA Sequencing  /  Isoform Sequencing (RNA)', 460, 152, 262, 9.5, { color: A_TEXT, font: 'Poppins', lh: 1.35 }));
  s.push(r(412, 274, 310, 1, A_HAIR));

  // 07
  s.push(t('07', 412, 286, 42, 22, { bold: 1, color: A_ORANGE, font: 'Poppins' }));
  s.push(t('Long Read Sequencing', 460, 286, 262, 12.5, { bold: 1, color: A_INK, font: 'Poppins' }));
  s.push(t('PacBio Sequencing  /  Nanopore Sequencing', 460, 308, 262, 9.5, { color: A_TEXT, font: 'Poppins', lh: 1.35 }));
  s.push(r(412, 350, 310, 1, A_HAIR));

  // 08
  s.push(t('08', 412, 362, 42, 22, { bold: 1, color: A_ORANGE, font: 'Poppins' }));
  s.push(t('qRT-PCR Validation', 460, 362, 262, 12.5, { bold: 1, color: A_INK, font: 'Poppins' }));
  s.push(r(412, 400, 310, 1, A_HAIR));

  // 09
  s.push(t('09', 412, 412, 42, 22, { bold: 1, color: A_ORANGE, font: 'Poppins' }));
  s.push(t('SSR Marker Validation', 460, 412, 262, 12.5, { bold: 1, color: A_INK, font: 'Poppins' }));
  s.push(r(412, 450, 310, 1, A_HAIR));

  // 10
  s.push(t('10', 412, 462, 42, 22, { bold: 1, color: A_ORANGE, font: 'Poppins' }));
  s.push(t('Taurine and Telomere Assay', 460, 462, 262, 12.5, { bold: 1, color: A_INK, font: 'Poppins' }));
  s.push(r(412, 500, 310, 1, A_HAIR));

  // 11
  s.push(t('11', 412, 512, 42, 22, { bold: 1, color: A_ORANGE, font: 'Poppins' }));
  s.push(t('ChIP-Sequencing', 460, 512, 262, 12.5, { bold: 1, color: A_INK, font: 'Poppins' }));
  s.push(r(412, 550, 310, 1, A_HAIR));

  // Custom project callout box
  s.push(r(412, 574, 310, 95, A_PAPER, { r: 6 }));
  s.push(r(412, 574, 4.5, 95, A_ORANGE, { r: 2 }));
  s.push(t('Have a custom project?', 426, 586, 280, 13, { bold: 1, color: A_INK, font: 'Poppins' }));
  s.push(t('Share your sample type and research goal and our team will help you choose the right sequencing approach.', 426, 610, 280, 10, { color: A_TEXT, font: 'Poppins', lh: 1.35 }));
  s.push(...aFooter(378, 378));

  // ==========================================
  // PANEL C: PRODUCTS (Right: 756..1123)
  // ==========================================
  s.push(r(756, 0, 367, 794, A_PAPER));
  s.push(...aTitle(790, 34, 'Kits & reagents', 'Our Range\nof Products'));

  // Section 1: COLLECT & STABILIZE
  s.push(r(790, 114, 300, 20, A_APRICOT, { r: 3 }));
  s.push(r(790, 114, 4.5, 20, A_ORANGE, { r: 2 }));
  s.push(t('COLLECT & STABILIZE', 802, 119, 280, 8.5, { bold: 1, color: A_INK, font: 'Poppins', sp: 60 }));

  const g1Items = [
    ['01', 'ONESpit™', 'Zero-prep saliva collection; DNA stable 1+ year at room temperature.'],
    ['02', 'ONEasy™', 'Faecal collection & preservation; room-temp transport up to 2 years*.'],
    ['03', 'NucleoGUARD™', 'RNA stabilization buffer.'],
    ['04', 'RNAguard™', 'Ambient shipping of total RNA.'],
    ['05', 'ProteinGUARD™', 'Ambient shipping of protein.'],
    ['06', 'SoilGUARD™', 'Soil stabilization buffer.'],
  ];
  let curY = 138;
  g1Items.forEach(([n, name, desc]) => {
    s.push(t(n, 790, curY, 24, 8.5, { bold: 1, color: A_ORANGE, font: 'Poppins' }));
    s.push(t(name, 816, curY, 274, 10, { bold: 1, color: A_INK, font: 'Poppins' }));
    s.push(t(desc, 816, curY + 14, 274, 8.5, { color: A_TEXT, font: 'Poppins' }));
    s.push(r(790, curY + 30, 300, 1, A_HAIR));
    curY += 33;
  });

  // Section 2: EXTRACT
  s.push(r(790, 342, 300, 20, A_APRICOT, { r: 3 }));
  s.push(r(790, 342, 4.5, 20, A_ORANGE, { r: 2 }));
  s.push(t('EXTRACT', 802, 347, 280, 8.5, { bold: 1, color: A_INK, font: 'Poppins', sp: 60 }));

  const g2Items = [
    ['07', 'ONEMag™ Rapid Universal DNA', 'Under 30 minutes, from diverse sample types.'],
    ['08', 'ONEMag™ Rapid Soil DNA', 'Efficient removal of humic acids.'],
    ['09', 'ONEMag™ Rapid Plant DNA', 'For polysaccharide- and polyphenol-rich tissue.'],
    ['10', 'ONEMag™ Rapid Soil RNA', 'High-integrity RNA from soil samples.'],
  ];
  curY = 366;
  g2Items.forEach(([n, name, desc]) => {
    s.push(t(n, 790, curY, 24, 8.5, { bold: 1, color: A_ORANGE, font: 'Poppins' }));
    s.push(t(name, 816, curY, 274, 10, { bold: 1, color: A_INK, font: 'Poppins' }));
    s.push(t(desc, 816, curY + 14, 274, 8.5, { color: A_TEXT, font: 'Poppins' }));
    s.push(r(790, curY + 30, 300, 1, A_HAIR));
    curY += 33;
  });

  // Section 3: AMPLIFY & SEQUENCE
  s.push(r(790, 504, 300, 20, A_APRICOT, { r: 3 }));
  s.push(r(790, 504, 4.5, 20, A_ORANGE, { r: 2 }));
  s.push(t('AMPLIFY & SEQUENCE', 802, 509, 280, 8.5, { bold: 1, color: A_INK, font: 'Poppins', sp: 60 }));

  const g3Items = [
    ['11', 'ONENext™ 16S (V3–V4)', 'Library prep kit for Illumina.'],
    ['12', 'ONENext™ 16S (V1–V9)', 'Full-length library prep kit for ONT.'],
    ['13', '2X Taq Plus PCR Master Mix', 'Ready-to-use, with RED dye for direct gel loading.'],
  ];
  curY = 528;
  g3Items.forEach(([n, name, desc]) => {
    s.push(t(n, 790, curY, 24, 8.5, { bold: 1, color: A_ORANGE, font: 'Poppins' }));
    s.push(t(name, 816, curY, 274, 10, { bold: 1, color: A_INK, font: 'Poppins' }));
    s.push(t(desc, 816, curY + 14, 274, 8.5, { color: A_TEXT, font: 'Poppins' }));
    s.push(r(790, curY + 30, 300, 1, A_HAIR));
    curY += 33;
  });

  s.push(t('*Under validated storage conditions. Refer to the product datasheet.', 790, 724, 300, 8, { italic: 1, color: A_MUTED, font: 'Poppins' }));
  s.push(...aFooter(756, 367));

  return s;
}

// Colors for Oneomics "Teal Modern" Tri-fold Brochure (Design 7)
const TL_NAVY = '#123A44';
const TL_TEAL = '#0E9F8E';
const TL_MINT = '#E6F5F2';
const TL_GREY = '#4E6068';
const TL_MUTED = '#8A96A3';
const TL_RULE = '#CFE3DF';
const TL_WHITE = '#FFFFFF';

const tlTitle = (x, y, kicker, titleHtml, size = 23) => [
  r(x, y, 38, 4.5, TL_TEAL, { r: 2.2 }),
  t(kicker.toUpperCase(), x, y + 10, 300, 8.5, { bold: 1, color: TL_MUTED, font: 'Poppins', sp: 60 }),
  t(titleHtml, x, y + 26, 300, size, { bold: 1, color: TL_NAVY, font: 'Poppins', lh: 1.15 }),
];

const tlFooter = (x0, pw, label = 'GENOMICS SOLUTIONS') => [
  r(x0 + 34, 750, pw - 68, 1, TL_RULE),
  t('ONEOMICS', x0 + 34, 760, 120, 9, { bold: 1, color: TL_NAVY, font: 'Poppins' }),
  t(label, x0 + pw - 34 - 170, 760, 170, 8.5, { color: TL_MUTED, align: 'right', font: 'Poppins' }),
];

// Oneomics "Teal Modern" Tri-fold Brochure — Page 1 (Outside)
export function trifoldTeal() {
  const s = [];

  // ==========================================
  // PANEL 1: FLAP (Left, 0..367)
  // ==========================================
  s.push(r(0, 0, 367, 794, TL_WHITE));
  s.push(...tlTitle(34, 34, 'Who we are', 'About\nONEOMICS'));
  s.push(t('One connected portfolio for genomics.', 34, 126, 300, 13, { bold: 1, color: TL_NAVY, font: 'Poppins', lh: 1.25 }));
  s.push(t('ONEOMICS Private Limited is a genomics company offering sequencing services, sample collection and stabilization products, nucleic-acid extraction and library-prep kits, and bioinformatics software.', 34, 154, 300, 10, { color: TL_GREY, font: 'Poppins', lh: 1.38 }));
  s.push(t('From a single saliva sample to a full metagenome, our solutions help researchers, clinicians and agri-scientists move from sample to insight with confidence.', 34, 232, 300, 10, { color: TL_GREY, font: 'Poppins', lh: 1.38 }));

  // Mission
  s.push(r(34, 304, 300, 1, TL_NAVY));
  s.push(t('Our Mission', 34, 314, 300, 12.5, { bold: 1, color: TL_NAVY, font: 'Poppins' }));
  s.push(t('To make high-quality genomic science accessible through reliable sequencing, robust sample-stabilization products and dependable molecular tools.', 34, 334, 300, 9.5, { color: TL_GREY, font: 'Poppins', lh: 1.35 }));

  // Vision
  s.push(r(34, 396, 300, 1, TL_NAVY));
  s.push(t('Our Vision', 34, 406, 300, 12.5, { bold: 1, color: TL_NAVY, font: 'Poppins' }));
  s.push(t('To be a trusted partner in genomics, enabling discoveries that advance human health, agriculture and the environment.', 34, 426, 300, 9.5, { color: TL_GREY, font: 'Poppins', lh: 1.35 }));

  // What we offer
  s.push(r(34, 486, 300, 1, TL_NAVY));
  s.push(t('What we offer', 34, 496, 300, 12.5, { bold: 1, color: TL_NAVY, font: 'Poppins' }));
  s.push(t('Sequencing: genomes, exomes, transcriptomes, metagenomes, epigenomes and long reads.', 34, 518, 300, 9.5, { color: TL_GREY, font: 'Poppins', lh: 1.35 }));
  s.push(t('Kits & reagents: 13 products to collect, stabilize, extract and amplify.', 34, 554, 300, 9.5, { color: TL_GREY, font: 'Poppins', lh: 1.35 }));
  s.push(t('Software: DNASTAR Lasergene for sequence, genome and protein analysis.', 34, 590, 300, 9.5, { color: TL_GREY, font: 'Poppins', lh: 1.35 }));

  s.push(...tlFooter(0, 367));

  // ==========================================
  // PANEL 2: BACK COVER (Middle, 367..745)
  // ==========================================
  s.push(r(367, 0, 378, 794, TL_WHITE));
  s.push(...tlTitle(401, 34, 'Software', 'DNASTAR\nLasergene'));
  s.push(t('The trusted desktop suite for sequence analysis, genome assembly and protein research, available through ONEOMICS.', 401, 126, 310, 10, { color: TL_GREY, font: 'Poppins', lh: 1.38 }));

  s.push(r(401, 170, 310, 1, TL_NAVY));

  // Module 1
  s.push(t('1', 401, 182, 30, 24, { bold: 1, color: TL_TEAL, font: 'Poppins' }));
  s.push(t('Molecular Biology Module', 434, 184, 277, 12.5, { bold: 1, color: TL_NAVY, font: 'Poppins' }));
  s.push(t('Sequence viewing, primer design, cloning and DNA/RNA analysis.', 434, 204, 277, 9.5, { color: TL_GREY, font: 'Poppins', lh: 1.3 }));
  s.push(r(401, 244, 310, 1, TL_RULE));

  // Module 2
  s.push(t('2', 401, 256, 30, 24, { bold: 1, color: TL_TEAL, font: 'Poppins' }));
  s.push(t('Genomics Module', 434, 258, 277, 12.5, { bold: 1, color: TL_NAVY, font: 'Poppins' }));
  s.push(t('Assembly, alignment and analysis of next-generation sequencing data.', 434, 278, 277, 9.5, { color: TL_GREY, font: 'Poppins', lh: 1.3 }));
  s.push(r(401, 318, 310, 1, TL_RULE));

  // Module 3
  s.push(t('3', 401, 330, 30, 24, { bold: 1, color: TL_TEAL, font: 'Poppins' }));
  s.push(t('Proteomics Module', 434, 332, 277, 12.5, { bold: 1, color: TL_NAVY, font: 'Poppins' }));
  s.push(t('Protein sequence analysis, structure prediction and visualization.', 434, 352, 277, 9.5, { color: TL_GREY, font: 'Poppins', lh: 1.3 }));

  // Contact Box (MINT)
  s.push(r(385, 420, 342, 240, TL_MINT, { r: 6 }));
  s.push(t('Get in touch', 401, 436, 310, 15, { bold: 1, color: TL_NAVY, font: 'Poppins' }));
  s.push(t('Tell us about your project, sample type or software needs.', 401, 460, 310, 9.5, { color: TL_GREY, font: 'Poppins' }));

  s.push(t('WEB', 401, 492, 58, 8.5, { bold: 1, color: TL_TEAL, font: 'Poppins', sp: 60 }));
  s.push(t('www.[your-website].com', 465, 491, 240, 10, { color: TL_NAVY, font: 'Poppins' }));

  s.push(t('EMAIL', 401, 520, 58, 8.5, { bold: 1, color: TL_TEAL, font: 'Poppins', sp: 60 }));
  s.push(t('[info@your-domain.com]', 465, 519, 240, 10, { color: TL_NAVY, font: 'Poppins' }));

  s.push(t('PHONE', 401, 548, 58, 8.5, { bold: 1, color: TL_TEAL, font: 'Poppins', sp: 60 }));
  s.push(t('[+91 00000 00000]', 465, 547, 240, 10, { color: TL_NAVY, font: 'Poppins' }));

  s.push(t('ADDRESS', 401, 576, 58, 8.5, { bold: 1, color: TL_TEAL, font: 'Poppins', sp: 60 }));
  s.push(t('[Company address, City, State, PIN]', 465, 575, 240, 9, { color: TL_NAVY, font: 'Poppins', lh: 1.3 }));

  s.push(...tlFooter(367, 378));

  // ==========================================
  // PANEL 3: FRONT COVER (Right, 745..1123)
  // ==========================================
  s.push(r(745, 0, 378, 794, TL_MINT));
  s.push({ k: 'image', src: '/assets/oneomics_logo2.png', x: 779, y: 56, w: 220 });

  s.push(r(779, 180, 42, 5, TL_TEAL, { r: 2.5 }));
  s.push(t('Genomics,\nend to end.', 779, 206, 320, 42, { bold: 1, color: TL_NAVY, font: 'Poppins', lh: 1.12 }));
  s.push(t('Sequencing services, sample collection kits and DNASTAR Lasergene software from one partner.', 779, 320, 310, 12, { color: TL_GREY, font: 'Poppins', lh: 1.45 }));

  s.push(t('SEQUENCING   ·   KITS   ·   SOFTWARE', 779, 580, 310, 9.5, { bold: 1, color: TL_TEAL, font: 'Poppins', sp: 60 }));

  // 3 Pillars
  s.push(r(779, 608, 310, 1.2, TL_NAVY));
  s.push(t('01', 779, 620, 95, 9, { bold: 1, color: TL_TEAL, font: 'Poppins' }));
  s.push(t('Sequencing', 779, 638, 95, 12, { bold: 1, color: TL_NAVY, font: 'Poppins' }));

  s.push(t('02', 886, 620, 95, 9, { bold: 1, color: TL_TEAL, font: 'Poppins' }));
  s.push(t('Kits', 886, 638, 95, 12, { bold: 1, color: TL_NAVY, font: 'Poppins' }));

  s.push(t('03', 993, 620, 95, 9, { bold: 1, color: TL_TEAL, font: 'Poppins' }));
  s.push(t('Software', 993, 638, 95, 12, { bold: 1, color: TL_NAVY, font: 'Poppins' }));

  return s;
}

// Oneomics "Teal Modern" Tri-fold Brochure — Page 2 (Inside)
export function trifoldTealInside() {
  const s = [];

  // ==========================================
  // PANEL A: SEQUENCING SERVICES (Left: 0..378)
  // ==========================================
  s.push(r(0, 0, 378, 794, TL_WHITE));
  s.push(...tlTitle(34, 34, 'Next generation sequencing', 'Sequencing\nServices'));
  s.push(r(34, 126, 310, 1, TL_NAVY));

  // 01
  s.push(t('01', 34, 138, 30, 14, { bold: 1, color: TL_TEAL, font: 'Poppins' }));
  s.push(t('Whole Genome Sequencing', 70, 138, 274, 12.5, { bold: 1, color: TL_NAVY, font: 'Poppins' }));
  s.push(t('De novo / Reference-Based / Hi-C Genome / Chloroplast Genome / Mitochondrial Genome Sequencing', 70, 158, 274, 9.5, { color: TL_GREY, font: 'Poppins', lh: 1.35 }));

  // 02
  s.push(t('02', 34, 220, 30, 14, { bold: 1, color: TL_TEAL, font: 'Poppins' }));
  s.push(t('Whole Exome Sequencing', 70, 220, 274, 12.5, { bold: 1, color: TL_NAVY, font: 'Poppins' }));

  // 03
  s.push(t('03', 34, 260, 30, 14, { bold: 1, color: TL_TEAL, font: 'Poppins' }));
  s.push(t('Epigenetics', 70, 260, 274, 12.5, { bold: 1, color: TL_NAVY, font: 'Poppins' }));
  s.push(t('Whole Genome Bisulfite Sequencing / Whole Genome Methylation Sequencing', 70, 280, 274, 9.5, { color: TL_GREY, font: 'Poppins', lh: 1.35 }));

  // 04
  s.push(t('04', 34, 335, 30, 14, { bold: 1, color: TL_TEAL, font: 'Poppins' }));
  s.push(t('Genotyping By Sequencing', 70, 335, 274, 12.5, { bold: 1, color: TL_NAVY, font: 'Poppins' }));

  // 05
  s.push(t('05', 34, 375, 30, 14, { bold: 1, color: TL_TEAL, font: 'Poppins' }));
  s.push(t('Metagenome Sequencing', 70, 375, 274, 12.5, { bold: 1, color: TL_NAVY, font: 'Poppins' }));
  s.push(t('16S (V3–V4) Metagenome / 16S (V1–V9) rRNA / ITS Metagenome / 18S Metagenome / Shotgun Metagenome / Custom Amplicon Sequencing / Meta-Barcoding', 70, 395, 274, 9.5, { color: TL_GREY, font: 'Poppins', lh: 1.35 }));

  s.push(...tlFooter(0, 378));

  // ==========================================
  // PANEL B: SEQUENCING SERVICES (CONT.) (Middle: 378..756)
  // ==========================================
  s.push(r(378, 0, 378, 794, TL_WHITE));
  s.push(...tlTitle(412, 34, 'Next generation sequencing', 'Sequencing\nServices (cont.)'));
  s.push(r(412, 126, 310, 1, TL_NAVY));

  // 06
  s.push(t('06', 412, 138, 30, 14, { bold: 1, color: TL_TEAL, font: 'Poppins' }));
  s.push(t('Transcriptome Sequencing', 448, 138, 274, 12.5, { bold: 1, color: TL_NAVY, font: 'Poppins' }));
  s.push(t('Whole Transcriptome (mRNA + lncRNA) / mRNA / Small RNA / Metatranscriptome / Dual RNA / Single Cell RNA / Isoform Sequencing (RNA)', 448, 158, 274, 9.5, { color: TL_GREY, font: 'Poppins', lh: 1.35 }));

  // 07
  s.push(t('07', 412, 220, 30, 14, { bold: 1, color: TL_TEAL, font: 'Poppins' }));
  s.push(t('Long Read Sequencing', 448, 220, 274, 12.5, { bold: 1, color: TL_NAVY, font: 'Poppins' }));
  s.push(t('PacBio Sequencing / Nanopore Sequencing', 448, 240, 274, 9.5, { color: TL_GREY, font: 'Poppins', lh: 1.35 }));

  // 08
  s.push(t('08', 412, 280, 30, 14, { bold: 1, color: TL_TEAL, font: 'Poppins' }));
  s.push(t('qRT-PCR Validation', 448, 280, 274, 12.5, { bold: 1, color: TL_NAVY, font: 'Poppins' }));

  // 09
  s.push(t('09', 412, 320, 30, 14, { bold: 1, color: TL_TEAL, font: 'Poppins' }));
  s.push(t('SSR Marker Validation', 448, 320, 274, 12.5, { bold: 1, color: TL_NAVY, font: 'Poppins' }));

  // 10
  s.push(t('10', 412, 360, 30, 14, { bold: 1, color: TL_TEAL, font: 'Poppins' }));
  s.push(t('Taurine and Telomere Assay', 448, 360, 274, 12.5, { bold: 1, color: TL_NAVY, font: 'Poppins' }));

  // 11
  s.push(t('11', 412, 400, 30, 14, { bold: 1, color: TL_TEAL, font: 'Poppins' }));
  s.push(t('ChIP-Sequencing', 448, 400, 274, 12.5, { bold: 1, color: TL_NAVY, font: 'Poppins' }));

  // Custom project callout box (MINT)
  s.push(r(398, 460, 338, 90, TL_MINT, { r: 6 }));
  s.push(t('Have a custom project?', 414, 474, 306, 13.5, { bold: 1, color: TL_NAVY, font: 'Poppins' }));
  s.push(t('Share your sample type and research goal and our team will help you choose the right sequencing approach.', 414, 498, 306, 10, { color: TL_GREY, font: 'Poppins', lh: 1.35 }));

  s.push(...tlFooter(378, 378));

  // ==========================================
  // PANEL C: PRODUCTS (Right: 756..1123)
  // ==========================================
  s.push(r(756, 0, 367, 794, TL_WHITE));
  s.push(...tlTitle(790, 34, 'Kits & reagents', 'Our Range\nof Products'));

  // Section 1: COLLECT & STABILIZE
  s.push(t('COLLECT & STABILIZE', 790, 124, 300, 9, { bold: 1, color: TL_TEAL, font: 'Poppins', sp: 60 }));
  s.push(r(790, 140, 300, 1, TL_RULE));

  const g1Items = [
    ['01', 'ONESpit™', 'Zero-prep saliva collection; DNA stable 1+ year at room temperature.'],
    ['02', 'ONEasy™', 'Faecal collection & preservation; room-temperature transport up to 2 years*.'],
    ['03', 'NucleoGUARD™', 'RNA stabilization buffer.'],
    ['04', 'RNAguard™', 'Ambient shipping of total RNA.'],
    ['05', 'ProteinGUARD™', 'Ambient shipping of protein.'],
    ['06', 'SoilGUARD™', 'Soil stabilization buffer.'],
  ];
  let curY = 148;
  g1Items.forEach(([n, name, desc]) => {
    s.push(t(n, 790, curY, 22, 9, { bold: 1, color: TL_TEAL, font: 'Poppins' }));
    s.push(t(name, 816, curY, 274, 10.5, { bold: 1, color: TL_NAVY, font: 'Poppins' }));
    s.push(t(desc, 816, curY + 14, 274, 8.5, { color: TL_GREY, font: 'Poppins' }));
    curY += (desc.length > 50 ? 32 : 28);
  });

  // Section 2: EXTRACT
  s.push(t('EXTRACT', 790, curY + 8, 300, 9, { bold: 1, color: TL_TEAL, font: 'Poppins', sp: 60 }));
  s.push(r(790, curY + 24, 300, 1, TL_RULE));
  curY += 32;

  const g2Items = [
    ['07', 'ONEMag™ Rapid Universal DNA', 'Under 30 minutes, from diverse sample types.'],
    ['08', 'ONEMag™ Rapid Soil DNA', 'Efficient removal of humic acids.'],
    ['09', 'ONEMag™ Rapid Plant DNA', 'For polysaccharide- and polyphenol-rich tissue.'],
    ['10', 'ONEMag™ Rapid Soil RNA', 'High-integrity RNA from soil samples.'],
  ];
  g2Items.forEach(([n, name, desc]) => {
    s.push(t(n, 790, curY, 22, 9, { bold: 1, color: TL_TEAL, font: 'Poppins' }));
    s.push(t(name, 816, curY, 274, 10.5, { bold: 1, color: TL_NAVY, font: 'Poppins' }));
    s.push(t(desc, 816, curY + 14, 274, 8.5, { color: TL_GREY, font: 'Poppins' }));
    curY += 28;
  });

  // Section 3: AMPLIFY & SEQUENCE
  s.push(t('AMPLIFY & SEQUENCE', 790, curY + 8, 300, 9, { bold: 1, color: TL_TEAL, font: 'Poppins', sp: 60 }));
  s.push(r(790, curY + 24, 300, 1, TL_RULE));
  curY += 32;

  const g3Items = [
    ['11', 'ONENext™ 16S (V3–V4)', 'Library prep kit for Illumina.'],
    ['12', 'ONENext™ 16S (V1–V9)', 'Full-length library prep kit for ONT.'],
    ['13', '2X Taq Plus PCR Master Mix', 'Ready-to-use, with RED dye for direct gel loading.'],
  ];
  g3Items.forEach(([n, name, desc]) => {
    s.push(t(n, 790, curY, 22, 9, { bold: 1, color: TL_TEAL, font: 'Poppins' }));
    s.push(t(name, 816, curY, 274, 10.5, { bold: 1, color: TL_NAVY, font: 'Poppins' }));
    s.push(t(desc, 816, curY + 14, 274, 8.5, { color: TL_GREY, font: 'Poppins' }));
    curY += 28;
  });

  s.push(t('*Under validated storage conditions. Refer to the product datasheet.', 790, curY + 10, 300, 8, { italic: 1, color: TL_MUTED, font: 'Poppins' }));
  s.push(...tlFooter(756, 367));

  return s;
}

// Colors for Oneomics "Rose & Mulberry" Tri-fold Brochure (Design 8)
const RS_NAVY = '#3B1F33';
const RS_ROSE = '#D6457A';
const RS_BLUSH = '#FCECF2';
const RS_GREY = '#6A5560';
const RS_MUTED = '#8A96A3';
const RS_RULE = '#F0D5E0';
const RS_WHITE = '#FFFFFF';

const rsTitle = (x, y, kicker, titleHtml, size = 23) => [
  r(x, y, 38, 4.5, RS_ROSE, { r: 2.2 }),
  t(kicker.toUpperCase(), x, y + 10, 300, 8.5, { bold: 1, color: RS_MUTED, font: 'Poppins', sp: 60 }),
  t(titleHtml, x, y + 26, 300, size, { bold: 1, color: RS_NAVY, font: 'Poppins', lh: 1.15 }),
];

const rsFooter = (x0, pw, label = 'GENOMICS SOLUTIONS') => [
  r(x0 + 34, 750, pw - 68, 1, RS_RULE),
  t('ONEOMICS', x0 + 34, 760, 120, 9, { bold: 1, color: RS_NAVY, font: 'Poppins' }),
  t(label, x0 + pw - 34 - 170, 760, 170, 8.5, { color: RS_MUTED, align: 'right', font: 'Poppins' }),
];

// Oneomics "Rose & Mulberry" Tri-fold Brochure — Page 1 (Outside)
export function trifoldRose() {
  const s = [];

  // ==========================================
  // PANEL 1: FLAP (Left, 0..367)
  // ==========================================
  s.push(r(0, 0, 367, 794, RS_WHITE));
  s.push(...rsTitle(34, 34, 'Why ONEOMICS', 'From sample\nto insight.'));
  s.push(t('ONEOMICS Private Limited brings the whole genomics workflow together: collect, extract, sequence and analyse, with one connected partner.', 34, 126, 300, 10, { color: RS_GREY, font: 'Poppins', lh: 1.38 }));

  s.push(r(34, 180, 300, 1, RS_NAVY));

  // 01
  s.push(t('01', 34, 192, 30, 14, { bold: 1, color: RS_ROSE, font: 'Poppins' }));
  s.push(t('Collect anywhere', 70, 192, 264, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('Room-temperature collection and shipping kits for saliva, faeces, RNA, protein and soil samples.', 70, 210, 264, 9, { color: RS_GREY, font: 'Poppins', lh: 1.35 }));

  // 02
  s.push(t('02', 34, 250, 30, 14, { bold: 1, color: RS_ROSE, font: 'Poppins' }));
  s.push(t('Extract with ease', 70, 250, 264, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('Magnetic-bead DNA and RNA kits with no hazardous organic solvents. The Universal DNA kit takes under 30 minutes.', 70, 268, 264, 9, { color: RS_GREY, font: 'Poppins', lh: 1.35 }));

  // 03
  s.push(t('03', 34, 316, 30, 14, { bold: 1, color: RS_ROSE, font: 'Poppins' }));
  s.push(t('Sequence with confidence', 70, 316, 264, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('Illumina, PacBio and Nanopore services across genomes, transcriptomes and metagenomes.', 70, 334, 264, 9, { color: RS_GREY, font: 'Poppins', lh: 1.35 }));

  // 04
  s.push(t('04', 34, 374, 30, 14, { bold: 1, color: RS_ROSE, font: 'Poppins' }));
  s.push(t('Analyse in one place', 70, 374, 264, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('DNASTAR Lasergene for sequence, genome and protein analysis.', 70, 392, 264, 9, { color: RS_GREY, font: 'Poppins', lh: 1.35 }));

  s.push(r(34, 436, 300, 1, RS_NAVY));

  // Mission
  s.push(t('Our Mission', 34, 448, 300, 12.5, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('To make high-quality genomic science accessible through reliable sequencing, robust sample-stabilization products and dependable molecular tools.', 34, 468, 300, 9.5, { color: RS_GREY, font: 'Poppins', lh: 1.35 }));

  // Vision
  s.push(t('Our Vision', 34, 532, 300, 12.5, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('To be a trusted partner in genomics, enabling discoveries that advance human health, agriculture and the environment.', 34, 552, 300, 9.5, { color: RS_GREY, font: 'Poppins', lh: 1.35 }));

  s.push(...rsFooter(0, 367));

  // ==========================================
  // PANEL 2: BACK COVER (Middle, 367..745)
  // ==========================================
  s.push(r(367, 0, 378, 794, RS_WHITE));
  s.push(...rsTitle(401, 34, 'Software', 'DNASTAR\nLasergene'));
  s.push(t('The trusted desktop suite for sequence analysis, genome assembly and protein research, available through ONEOMICS.', 401, 126, 310, 10, { color: RS_GREY, font: 'Poppins', lh: 1.38 }));

  s.push(r(401, 170, 310, 1, RS_NAVY));

  // Module 1
  s.push(t('1', 401, 182, 30, 24, { bold: 1, color: RS_ROSE, font: 'Poppins' }));
  s.push(t('Molecular Biology Module', 434, 184, 277, 12.5, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('Sequence viewing, primer design, cloning and DNA/RNA analysis.', 434, 204, 277, 9.5, { color: RS_GREY, font: 'Poppins', lh: 1.3 }));
  s.push(r(401, 244, 310, 1, RS_RULE));

  // Module 2
  s.push(t('2', 401, 256, 30, 24, { bold: 1, color: RS_ROSE, font: 'Poppins' }));
  s.push(t('Genomics Module', 434, 258, 277, 12.5, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('Assembly, alignment and analysis of next-generation sequencing data.', 434, 278, 277, 9.5, { color: RS_GREY, font: 'Poppins', lh: 1.3 }));
  s.push(r(401, 318, 310, 1, RS_RULE));

  // Module 3
  s.push(t('3', 401, 330, 30, 24, { bold: 1, color: RS_ROSE, font: 'Poppins' }));
  s.push(t('Proteomics Module', 434, 332, 277, 12.5, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('Protein sequence analysis, structure prediction and visualization.', 434, 352, 277, 9.5, { color: RS_GREY, font: 'Poppins', lh: 1.3 }));

  // Contact Box (Blush)
  s.push(r(385, 420, 342, 240, RS_BLUSH, { r: 6 }));
  s.push(t('Get in touch', 401, 436, 310, 15, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('Tell us about your project, sample type or software needs.', 401, 460, 310, 9.5, { color: RS_GREY, font: 'Poppins' }));

  s.push(t('WEB', 401, 492, 58, 8.5, { bold: 1, color: RS_ROSE, font: 'Poppins', sp: 60 }));
  s.push(t('www.[your-website].com', 465, 491, 240, 10, { color: RS_NAVY, font: 'Poppins' }));

  s.push(t('EMAIL', 401, 520, 58, 8.5, { bold: 1, color: RS_ROSE, font: 'Poppins', sp: 60 }));
  s.push(t('[info@your-domain.com]', 465, 519, 240, 10, { color: RS_NAVY, font: 'Poppins' }));

  s.push(t('PHONE', 401, 548, 58, 8.5, { bold: 1, color: RS_ROSE, font: 'Poppins', sp: 60 }));
  s.push(t('[+91 00000 00000]', 465, 547, 240, 10, { color: RS_NAVY, font: 'Poppins' }));

  s.push(t('ADDRESS', 401, 576, 58, 8.5, { bold: 1, color: RS_ROSE, font: 'Poppins', sp: 60 }));
  s.push(t('[Company address, City, State, PIN]', 465, 575, 240, 9, { color: RS_NAVY, font: 'Poppins', lh: 1.3 }));

  s.push(...rsFooter(367, 378));

  // ==========================================
  // PANEL 3: FRONT COVER (Right, 745..1123)
  // ==========================================
  s.push(r(745, 0, 378, 794, RS_BLUSH));
  s.push({ k: 'image', src: '/assets/oneomics_logo2.png', x: 779, y: 56, w: 220 });

  s.push(r(779, 180, 42, 5, RS_ROSE, { r: 2.5 }));
  s.push(t('From sample\nto insight.', 779, 206, 320, 42, { bold: 1, color: RS_NAVY, font: 'Poppins', lh: 1.12 }));
  s.push(t('Sequencing services, sample collection kits and DNASTAR Lasergene software from one partner.', 779, 320, 310, 12, { color: RS_GREY, font: 'Poppins', lh: 1.45 }));

  s.push(t('SEQUENCING   ·   KITS   ·   SOFTWARE', 779, 580, 310, 9.5, { bold: 1, color: RS_ROSE, font: 'Poppins', sp: 60 }));

  // 3 Pillars
  s.push(r(779, 608, 310, 1.2, RS_NAVY));
  s.push(t('01', 779, 620, 95, 9, { bold: 1, color: RS_ROSE, font: 'Poppins' }));
  s.push(t('Sequencing', 779, 638, 95, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));

  s.push(t('02', 886, 620, 95, 9, { bold: 1, color: RS_ROSE, font: 'Poppins' }));
  s.push(t('Kits', 886, 638, 95, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));

  s.push(t('03', 993, 620, 95, 9, { bold: 1, color: RS_ROSE, font: 'Poppins' }));
  s.push(t('Software', 993, 638, 95, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));

  return s;
}

// Oneomics "Rose & Mulberry" Tri-fold Brochure — Page 2 (Inside)
export function trifoldRoseInside() {
  const s = [];

  // ==========================================
  // PANEL A: SEQUENCING SERVICES (Left: 0..378)
  // ==========================================
  s.push(r(0, 0, 378, 794, RS_WHITE));
  s.push(...rsTitle(34, 34, 'Next generation sequencing', 'Sequencing\nServices'));

  // Genomes
  s.push(t('GENOMES', 34, 124, 310, 9, { bold: 1, color: RS_ROSE, font: 'Poppins', sp: 60 }));
  s.push(r(34, 138, 310, 1, RS_RULE));
  s.push(t('Whole Genome Sequencing', 34, 148, 310, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('De novo · Reference-Based · Hi-C · Chloroplast · Mitochondrial', 34, 166, 310, 9, { color: RS_GREY, font: 'Poppins' }));
  s.push(t('Whole Exome Sequencing', 34, 190, 310, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('Genotyping By Sequencing', 34, 214, 310, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));

  // Epigenetics
  s.push(t('EPIGENETICS', 34, 246, 310, 9, { bold: 1, color: RS_ROSE, font: 'Poppins', sp: 60 }));
  s.push(r(34, 260, 310, 1, RS_RULE));
  s.push(t('Whole Genome Bisulfite Sequencing', 34, 270, 310, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('Whole Genome Methylation Sequencing', 34, 294, 310, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('ChIP-Sequencing', 34, 318, 310, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));

  // Metagenomes
  s.push(t('METAGENOMES', 34, 350, 310, 9, { bold: 1, color: RS_ROSE, font: 'Poppins', sp: 60 }));
  s.push(r(34, 364, 310, 1, RS_RULE));
  s.push(t('16S (V3–V4) and 16S (V1–V9) rRNA Sequencing', 34, 374, 310, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('ITS and 18S Metagenome Sequencing', 34, 398, 310, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('Shotgun Metagenome Sequencing', 34, 422, 310, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('Custom Amplicon Sequencing and Meta-Barcoding', 34, 446, 310, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));

  // Built for
  s.push(r(34, 520, 310, 1, RS_NAVY));
  s.push(t('Built for', 34, 532, 310, 13, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('Human health: clinical and diagnostic research.', 34, 556, 310, 9.5, { color: RS_GREY, font: 'Poppins' }));
  s.push(t('Agriculture: crop, soil and rhizosphere studies.', 34, 580, 310, 9.5, { color: RS_GREY, font: 'Poppins' }));
  s.push(t('Environment: microbiome and eDNA analysis.', 34, 604, 310, 9.5, { color: RS_GREY, font: 'Poppins' }));

  s.push(...rsFooter(0, 378));

  // ==========================================
  // PANEL B: SEQUENCING SERVICES (CONT.) (Middle: 378..756)
  // ==========================================
  s.push(r(378, 0, 378, 794, RS_WHITE));
  s.push(...rsTitle(412, 34, 'Next generation sequencing', 'Sequencing\nServices (cont.)'));

  // Transcriptomes
  s.push(t('TRANSCRIPTOMES', 412, 124, 310, 9, { bold: 1, color: RS_ROSE, font: 'Poppins', sp: 60 }));
  s.push(r(412, 138, 310, 1, RS_RULE));
  s.push(t('Whole Transcriptome (mRNA + lncRNA)', 412, 148, 310, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('mRNA and Small RNA Sequencing', 412, 172, 310, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('Metatranscriptome and Dual RNA Sequencing', 412, 196, 310, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('Single Cell RNA Sequencing', 412, 220, 310, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('Isoform Sequencing (RNA)', 412, 244, 310, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));

  // Long Read
  s.push(t('LONG READ', 412, 276, 310, 9, { bold: 1, color: RS_ROSE, font: 'Poppins', sp: 60 }));
  s.push(r(412, 290, 310, 1, RS_RULE));
  s.push(t('PacBio Sequencing', 412, 300, 310, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('Nanopore Sequencing', 412, 324, 310, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));

  // Validation & Assays
  s.push(t('VALIDATION & ASSAYS', 412, 356, 310, 9, { bold: 1, color: RS_ROSE, font: 'Poppins', sp: 60 }));
  s.push(r(412, 370, 310, 1, RS_RULE));
  s.push(t('qRT-PCR Validation', 412, 380, 310, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('SSR Marker Validation', 412, 404, 310, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('Taurine and Telomere Assay', 412, 428, 310, 12, { bold: 1, color: RS_NAVY, font: 'Poppins' }));

  // Custom project callout box (Blush)
  s.push(r(398, 466, 338, 86, RS_BLUSH, { r: 6 }));
  s.push(t('Have a custom project?', 414, 478, 306, 13.5, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('Share your sample type and research goal and our team will help you choose the right sequencing approach.', 414, 502, 306, 9.5, { color: RS_GREY, font: 'Poppins', lh: 1.35 }));

  // Platforms
  s.push(r(412, 570, 310, 1, RS_NAVY));
  s.push(t('Sequencing platforms', 412, 582, 310, 13, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
  s.push(t('Illumina: high-accuracy short-read sequencing.', 412, 606, 310, 9.5, { color: RS_GREY, font: 'Poppins' }));
  s.push(t('PacBio: long-read and isoform sequencing.', 412, 630, 310, 9.5, { color: RS_GREY, font: 'Poppins' }));
  s.push(t('Nanopore: long-read and full-length 16S sequencing.', 412, 654, 310, 9.5, { color: RS_GREY, font: 'Poppins' }));

  s.push(...rsFooter(378, 378));

  // ==========================================
  // PANEL C: PRODUCTS (Right: 756..1123)
  // ==========================================
  s.push(r(756, 0, 367, 794, RS_WHITE));
  s.push(...rsTitle(790, 34, 'Kits & reagents', 'Our Range\nof Products'));

  // Section 1: COLLECT & STABILIZE
  s.push(t('COLLECT & STABILIZE', 790, 124, 300, 9, { bold: 1, color: RS_ROSE, font: 'Poppins', sp: 60 }));
  s.push(r(790, 140, 300, 1, RS_RULE));

  const g1Items = [
    ['01', 'ONESpit™', 'Zero-prep saliva collection; DNA stable 1+ year at room temperature.'],
    ['02', 'ONEasy™', 'Faecal collection & preservation; room-temperature transport up to 2 years*.'],
    ['03', 'NucleoGUARD™', 'RNA stabilization buffer.'],
    ['04', 'RNAguard™', 'Ambient shipping of total RNA.'],
    ['05', 'ProteinGUARD™', 'Ambient shipping of protein.'],
    ['06', 'SoilGUARD™', 'Soil stabilization buffer.'],
  ];
  let curY = 148;
  g1Items.forEach(([n, name, desc]) => {
    s.push(t(n, 790, curY, 22, 9, { bold: 1, color: RS_ROSE, font: 'Poppins' }));
    s.push(t(name, 816, curY, 274, 10.5, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
    s.push(t(desc, 816, curY + 14, 274, 8.5, { color: RS_GREY, font: 'Poppins' }));
    curY += (desc.length > 50 ? 32 : 28);
  });

  // Section 2: EXTRACT
  s.push(t('EXTRACT', 790, curY + 8, 300, 9, { bold: 1, color: RS_ROSE, font: 'Poppins', sp: 60 }));
  s.push(r(790, curY + 24, 300, 1, RS_RULE));
  curY += 32;

  const g2Items = [
    ['07', 'ONEMag™ Rapid Universal DNA', 'Under 30 minutes, from diverse sample types.'],
    ['08', 'ONEMag™ Rapid Soil DNA', 'Efficient removal of humic acids.'],
    ['09', 'ONEMag™ Rapid Plant DNA', 'For polysaccharide- and polyphenol-rich tissue.'],
    ['10', 'ONEMag™ Rapid Soil RNA', 'High-integrity RNA from soil samples.'],
  ];
  g2Items.forEach(([n, name, desc]) => {
    s.push(t(n, 790, curY, 22, 9, { bold: 1, color: RS_ROSE, font: 'Poppins' }));
    s.push(t(name, 816, curY, 274, 10.5, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
    s.push(t(desc, 816, curY + 14, 274, 8.5, { color: RS_GREY, font: 'Poppins' }));
    curY += 28;
  });

  // Section 3: AMPLIFY & SEQUENCE
  s.push(t('AMPLIFY & SEQUENCE', 790, curY + 8, 300, 9, { bold: 1, color: RS_ROSE, font: 'Poppins', sp: 60 }));
  s.push(r(790, curY + 24, 300, 1, RS_RULE));
  curY += 32;

  const g3Items = [
    ['11', 'ONENext™ 16S (V3–V4)', 'Library prep kit for Illumina.'],
    ['12', 'ONENext™ 16S (V1–V9)', 'Full-length library prep kit for ONT.'],
    ['13', '2X Taq Plus PCR Master Mix', 'Ready-to-use, with RED dye for direct gel loading.'],
  ];
  g3Items.forEach(([n, name, desc]) => {
    s.push(t(n, 790, curY, 22, 9, { bold: 1, color: RS_ROSE, font: 'Poppins' }));
    s.push(t(name, 816, curY, 274, 10.5, { bold: 1, color: RS_NAVY, font: 'Poppins' }));
    s.push(t(desc, 816, curY + 14, 274, 8.5, { color: RS_GREY, font: 'Poppins' }));
    curY += 28;
  });

  s.push(t('*Under validated storage conditions. Refer to the product datasheet.', 790, curY + 10, 300, 8, { italic: 1, color: RS_MUTED, font: 'Poppins' }));
  s.push(...rsFooter(756, 367));

  return s;
}

// --- Tri-fold 9: Forest & Olive (Oneomics) ---
const OL_NAVY = '#23352A';
const OL_GREEN = '#5F9A4A';
const OL_SAGE = '#EDF5E8';
const OL_GREY = '#55645A';
const OL_MUTED = '#8A96A3';
const OL_RULE = '#D3E3CB';
const OL_WHITE = '#FFFFFF';

const olTitle = (x, y, kicker, titleHtml, size = 28) => [
  r(x, y, 38, 4.5, OL_GREEN, { r: 2.2 }),
  t(kicker.toUpperCase(), x, y + 10, 300, 8.5, { bold: 1, color: OL_MUTED, font: 'Poppins', sp: 60 }),
  t(titleHtml, x, y + 26, 300, size, { bold: 1, color: OL_NAVY, font: 'Poppins', lh: 1.15 }),
];

const olFooter = (x0, pw, label = 'GENOMICS SOLUTIONS') => [
  r(x0 + 34, 750, pw - 68, 1, OL_RULE),
  t('ONEOMICS', x0 + 34, 760, 120, 9, { bold: 1, color: OL_NAVY, font: 'Poppins' }),
  t(label, x0 + pw - 34 - 170, 760, 170, 8.5, { color: OL_MUTED, align: 'right', font: 'Poppins' }),
];

// Oneomics "Forest & Olive" Tri-fold Brochure — Page 1 (Outside)
export function trifoldOlive() {
  const s = [];

  // ==========================================
  // PANEL 1: FLAP (Left, 0..367)
  // ==========================================
  s.push(r(0, 0, 367, 794, OL_WHITE));
  s.push(...olTitle(34, 34, 'Who We Are', 'About\nONEOMICS'));
  s.push(t('Genomics made simple.', 34, 134, 300, 13.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('ONEOMICS Private Limited is a genomics company offering sequencing services, sample collection and stabilization products, nucleic-acid extraction and library-prep kits, and bioinformatics software.', 34, 160, 300, 9.5, { color: OL_GREY, font: 'Poppins', lh: 1.35 }));

  s.push(r(34, 235, 300, 1, OL_NAVY));

  s.push(t('Who we serve', 34, 248, 300, 12, { bold: 1, color: OL_NAVY, font: 'Poppins' }));

  // 01 Researchers
  s.push(t('01', 34, 274, 30, 14, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('Researchers', 68, 274, 266, 12, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('Genomics, transcriptomics and microbiome studies.', 68, 292, 266, 9, { color: OL_GREY, font: 'Poppins' }));

  // 02 Clinicians
  s.push(t('02', 34, 322, 30, 14, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('Clinicians', 68, 322, 266, 12, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('Sample collection and stabilization for diagnostic and clinical research.', 68, 340, 266, 9, { color: OL_GREY, font: 'Poppins', lh: 1.3 }));

  // 03 Agri-scientists
  s.push(t('03', 34, 376, 30, 14, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('Agri-scientists', 68, 376, 266, 12, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('Soil, plant and rhizosphere workflows.', 68, 394, 266, 9, { color: OL_GREY, font: 'Poppins' }));

  s.push(r(34, 436, 300, 1, OL_NAVY));

  // Mission
  s.push(t('Our Mission', 34, 448, 300, 12.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('To make high-quality genomic science accessible through reliable sequencing, robust sample-stabilization products and dependable molecular tools.', 34, 468, 300, 9.5, { color: OL_GREY, font: 'Poppins', lh: 1.35 }));

  // Vision
  s.push(t('Our Vision', 34, 532, 300, 12.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('To be a trusted partner in genomics, enabling discoveries that advance human health, agriculture and the environment.', 34, 552, 300, 9.5, { color: OL_GREY, font: 'Poppins', lh: 1.35 }));

  s.push(...olFooter(0, 367));

  // ==========================================
  // PANEL 2: BACK COVER (Middle, 367..745)
  // ==========================================
  s.push(r(367, 0, 378, 794, OL_WHITE));
  s.push(...olTitle(401, 34, 'Software', 'DNASTAR\nLasergene'));
  s.push(t('The trusted desktop suite for sequence analysis, genome assembly and protein research, available through ONEOMICS.', 401, 126, 310, 10, { color: OL_GREY, font: 'Poppins', lh: 1.38 }));

  s.push(r(401, 170, 310, 1, OL_NAVY));

  // Module 1
  s.push(t('1', 401, 182, 30, 24, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('Molecular Biology Module', 434, 184, 277, 12.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('Sequence viewing, primer design, cloning and DNA/RNA analysis.', 434, 204, 277, 9.5, { color: OL_GREY, font: 'Poppins', lh: 1.3 }));
  s.push(r(401, 244, 310, 1, OL_RULE));

  // Module 2
  s.push(t('2', 401, 256, 30, 24, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('Genomics Module', 434, 258, 277, 12.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('Assembly, alignment and analysis of next-generation sequencing data.', 434, 278, 277, 9.5, { color: OL_GREY, font: 'Poppins', lh: 1.3 }));
  s.push(r(401, 318, 310, 1, OL_RULE));

  // Module 3
  s.push(t('3', 401, 330, 30, 24, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('Proteomics Module', 434, 332, 277, 12.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('Protein sequence analysis, structure prediction and visualization.', 434, 352, 277, 9.5, { color: OL_GREY, font: 'Poppins', lh: 1.3 }));

  // Contact Box (Sage)
  s.push(r(385, 420, 342, 240, OL_SAGE, { r: 6 }));
  s.push(t('Get in touch', 401, 436, 310, 15, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('Tell us about your project, sample type or software needs.', 401, 460, 310, 9.5, { color: OL_GREY, font: 'Poppins' }));

  s.push(t('WEB', 401, 492, 58, 8.5, { bold: 1, color: OL_GREEN, font: 'Poppins', sp: 60 }));
  s.push(t('www.[your-website].com', 465, 491, 240, 10, { color: OL_NAVY, font: 'Poppins' }));

  s.push(t('EMAIL', 401, 520, 58, 8.5, { bold: 1, color: OL_GREEN, font: 'Poppins', sp: 60 }));
  s.push(t('[info@your-domain.com]', 465, 519, 240, 10, { color: OL_NAVY, font: 'Poppins' }));

  s.push(t('PHONE', 401, 548, 58, 8.5, { bold: 1, color: OL_GREEN, font: 'Poppins', sp: 60 }));
  s.push(t('[+91 00000 00000]', 465, 547, 240, 10, { color: OL_NAVY, font: 'Poppins' }));

  s.push(t('ADDRESS', 401, 576, 58, 8.5, { bold: 1, color: OL_GREEN, font: 'Poppins', sp: 60 }));
  s.push(t('[Company address, City, State, PIN]', 465, 575, 240, 9, { color: OL_NAVY, font: 'Poppins', lh: 1.3 }));

  s.push(...olFooter(367, 378));

  // ==========================================
  // PANEL 3: FRONT COVER (Right, 745..1123)
  // ==========================================
  s.push(r(745, 0, 378, 794, OL_SAGE));
  s.push({ k: 'image', src: '/assets/oneomics_logo2.png', x: 779, y: 56, w: 220 });

  s.push(r(779, 180, 42, 5, OL_GREEN, { r: 2.5 }));
  s.push(t('Your partner\nin genomics.', 779, 206, 320, 42, { bold: 1, color: OL_NAVY, font: 'Poppins', lh: 1.12 }));
  s.push(t('Sequencing services, sample collection kits and DNASTAR Lasergene software, all in one place.', 779, 320, 310, 12, { color: OL_GREY, font: 'Poppins', lh: 1.45 }));

  s.push(t('SEQUENCING   ·   KITS   ·   SOFTWARE', 779, 580, 310, 9.5, { bold: 1, color: OL_GREEN, font: 'Poppins', sp: 60 }));

  // 3 Pillars
  s.push(r(779, 608, 310, 1.2, OL_NAVY));
  s.push(t('01', 779, 620, 95, 9, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('Sequencing', 779, 638, 95, 12, { bold: 1, color: OL_NAVY, font: 'Poppins' }));

  s.push(t('02', 886, 620, 95, 9, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('Kits', 886, 638, 95, 12, { bold: 1, color: OL_NAVY, font: 'Poppins' }));

  s.push(t('03', 993, 620, 95, 9, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('Software', 993, 638, 95, 12, { bold: 1, color: OL_NAVY, font: 'Poppins' }));

  return s;
}

// Oneomics "Forest & Olive" Tri-fold Brochure — Page 2 (Inside)
export function trifoldOliveInside() {
  const s = [];

  // ==========================================
  // PANEL A: KITS & REAGENTS (Left: 0..378)
  // ==========================================
  s.push(r(0, 0, 378, 794, OL_WHITE));
  s.push(...olTitle(34, 34, 'Kits & Reagents', 'Collect &\nStabilize'));
  s.push(r(34, 124, 310, 1.2, OL_NAVY));

  // 01 ONESpit
  s.push(t('01', 34, 142, 28, 13, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('ONESpit™', 66, 142, 278, 12, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('Zero-prep saliva collection. DNA stable 1+ year at room temperature, no refrigeration.', 66, 160, 278, 9, { color: OL_GREY, font: 'Poppins', lh: 1.3 }));

  // 02 ONEasy
  s.push(t('02', 34, 204, 28, 13, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('ONEasy™', 66, 204, 278, 12, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('Faecal collection and preservation, built for at-home use. Room-temperature transport up to 2 years*.', 66, 222, 278, 9, { color: OL_GREY, font: 'Poppins', lh: 1.3 }));

  // 03 NucleoGUARD
  s.push(t('03', 34, 268, 28, 13, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('NucleoGUARD™', 66, 268, 278, 12, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('RNA stabilization buffer that helps minimize RNA degradation.', 66, 286, 278, 9, { color: OL_GREY, font: 'Poppins', lh: 1.3 }));

  // 04 RNAguard
  s.push(t('04', 34, 328, 28, 13, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('RNAguard™', 66, 328, 278, 12, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('Ambient shipping of total RNA, with less need for dry ice.', 66, 346, 278, 9, { color: OL_GREY, font: 'Poppins', lh: 1.3 }));

  // 05 ProteinGUARD
  s.push(t('05', 34, 388, 28, 13, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('ProteinGUARD™', 66, 388, 278, 12, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('Ambient shipping of protein, with less reliance on ice packs where validated.', 66, 406, 278, 9, { color: OL_GREY, font: 'Poppins', lh: 1.3 }));

  // 06 SoilGUARD
  s.push(t('06', 34, 448, 28, 13, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('SoilGUARD™', 66, 448, 278, 12, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('Soil stabilization buffer that helps reduce soil-derived inhibitors.', 66, 466, 278, 9, { color: OL_GREY, font: 'Poppins', lh: 1.3 }));

  // Callout card (Sage)
  s.push(r(34, 536, 310, 78, OL_SAGE, { r: 6 }));
  s.push(t('Less cold chain', 50, 548, 278, 13.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('Stabilization kits let samples travel at room temperature, cutting dependence on dry ice and ice packs.', 50, 570, 278, 9, { color: OL_GREY, font: 'Poppins', lh: 1.35 }));

  s.push(t('*Under validated storage conditions. Refer to the product datasheet.', 34, 626, 310, 8, { color: OL_GREY, font: 'Poppins' }));

  s.push(...olFooter(0, 378));

  // ==========================================
  // PANEL B: KITS & REAGENTS (CONT.) (Middle: 378..756)
  // ==========================================
  s.push(r(378, 0, 378, 794, OL_WHITE));
  s.push(...olTitle(412, 34, 'Kits & Reagents', 'Extract &\nAmplify'));
  s.push(r(412, 124, 310, 1.2, OL_NAVY));

  // 07 ONEMag Universal DNA
  s.push(t('07', 412, 142, 28, 13, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('ONEMag™ Rapid Universal DNA', 444, 142, 278, 11.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('Under 30 minutes, from diverse sample types including blood, saliva and swabs.', 444, 160, 278, 8.8, { color: OL_GREY, font: 'Poppins', lh: 1.3 }));

  // 08 ONEMag Soil DNA
  s.push(t('08', 412, 202, 28, 13, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('ONEMag™ Rapid Soil DNA', 444, 202, 278, 11.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('Efficient removal of humic acids.', 444, 220, 278, 8.8, { color: OL_GREY, font: 'Poppins', lh: 1.3 }));

  // 09 ONEMag Plant DNA
  s.push(t('09', 412, 250, 28, 13, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('ONEMag™ Rapid Plant DNA', 444, 250, 278, 11.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('For polysaccharide- and polyphenol-rich tissue.', 444, 268, 278, 8.8, { color: OL_GREY, font: 'Poppins', lh: 1.3 }));

  // 10 ONEMag Soil RNA
  s.push(t('10', 412, 298, 28, 13, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('ONEMag™ Rapid Soil RNA', 444, 298, 278, 11.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('High-integrity RNA from soil samples.', 444, 316, 278, 8.8, { color: OL_GREY, font: 'Poppins', lh: 1.3 }));

  // 11 ONENext 16S (V3-V4)
  s.push(t('11', 412, 346, 28, 13, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('ONENext™ 16S (V3–V4)', 444, 346, 278, 11.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('Indexed library prep kit for Illumina.', 444, 364, 278, 8.8, { color: OL_GREY, font: 'Poppins', lh: 1.3 }));

  // 12 ONENext 16S (V1-V9)
  s.push(t('12', 412, 394, 28, 13, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('ONENext™ 16S (V1–V9)', 444, 394, 278, 11.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('Full-length (~1.5 kb) library prep kit for ONT.', 444, 412, 278, 8.8, { color: OL_GREY, font: 'Poppins', lh: 1.3 }));

  // 13 2X Taq Plus
  s.push(t('13', 412, 442, 28, 13, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('2X Taq Plus PCR Master Mix', 444, 442, 278, 11.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('Ready-to-use, with RED dye for direct gel loading.', 444, 460, 278, 8.8, { color: OL_GREY, font: 'Poppins', lh: 1.3 }));

  // Callout card (Sage)
  s.push(r(412, 536, 310, 78, OL_SAGE, { r: 6 }));
  s.push(t('Solvent-free purification', 428, 548, 278, 13.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('Magnetic-bead chemistry avoids hazardous organic solvents and works in manual and automated workflows.', 428, 570, 278, 9, { color: OL_GREY, font: 'Poppins', lh: 1.35 }));

  s.push(...olFooter(378, 378));

  // ==========================================
  // PANEL C: SEQUENCING SERVICES (Right: 756..1123)
  // ==========================================
  s.push(r(756, 0, 367, 794, OL_WHITE));
  s.push(...olTitle(790, 34, 'Next Generation Sequencing', 'Sequencing\nServices'));
  s.push(r(790, 124, 300, 1.2, OL_NAVY));

  // 01 Whole Genome
  s.push(t('01', 790, 142, 26, 12, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('Whole Genome', 820, 142, 270, 11.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('De novo, reference-based, Hi-C, chloroplast, mitochondrial', 820, 158, 270, 8.5, { color: OL_GREY, font: 'Poppins', lh: 1.25 }));

  // 02 Whole Exome
  s.push(t('02', 790, 194, 26, 12, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('Whole Exome', 820, 194, 270, 11.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));

  // 03 Epigenetics
  s.push(t('03', 790, 222, 26, 12, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('Epigenetics', 820, 222, 270, 11.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('Whole genome bisulfite and methylation sequencing', 820, 238, 270, 8.5, { color: OL_GREY, font: 'Poppins', lh: 1.25 }));

  // 04 Genotyping
  s.push(t('04', 790, 264, 26, 12, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('Genotyping By Sequencing', 820, 264, 270, 11.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));

  // 05 Metagenome
  s.push(t('05', 790, 292, 26, 12, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('Metagenome', 820, 292, 270, 11.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('16S V3–V4, 16S V1–V9, ITS, 18S, shotgun, custom amplicon, meta-barcoding', 820, 308, 270, 8.5, { color: OL_GREY, font: 'Poppins', lh: 1.25 }));

  // 06 Transcriptome
  s.push(t('06', 790, 344, 26, 12, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('Transcriptome', 820, 344, 270, 11.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('Whole transcriptome, mRNA, small RNA, metatranscriptome, dual RNA, single cell RNA, isoform', 820, 360, 270, 8.5, { color: OL_GREY, font: 'Poppins', lh: 1.25 }));

  // 07 Long Read
  s.push(t('07', 790, 404, 26, 12, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('Long Read', 820, 404, 270, 11.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('PacBio and Nanopore sequencing', 820, 420, 270, 8.5, { color: OL_GREY, font: 'Poppins', lh: 1.25 }));

  // 08 qRT-PCR
  s.push(t('08', 790, 444, 26, 12, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('qRT-PCR Validation', 820, 444, 270, 11.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));

  // 09 SSR Marker
  s.push(t('09', 790, 470, 26, 12, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('SSR Marker Validation', 820, 470, 270, 11.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));

  // 10 Taurine and Telomere Assay
  s.push(t('10', 790, 496, 26, 12, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('Taurine and Telomere Assay', 820, 496, 270, 11.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));

  // 11 ChIP-Sequencing
  s.push(t('11', 790, 522, 26, 12, { bold: 1, color: OL_GREEN, font: 'Poppins' }));
  s.push(t('ChIP-Sequencing', 820, 522, 270, 11.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));

  // Callout card (Sage)
  s.push(r(790, 566, 300, 78, OL_SAGE, { r: 6 }));
  s.push(t('Have a custom project?', 804, 578, 272, 13.5, { bold: 1, color: OL_NAVY, font: 'Poppins' }));
  s.push(t('Share your sample type and research goal and our team will help you choose the right sequencing approach.', 804, 600, 272, 9, { color: OL_GREY, font: 'Poppins', lh: 1.35 }));

  s.push(...olFooter(756, 367));

  return s;
}

// --- Tri-fold 10: Lavender & Violet (Oneomics) ---
const LV_NAVY = '#2E2352';
const LV_PURPLE = '#7B5CD6';
const LV_LAVENDER = '#F0ECFB';
const LV_GREY = '#5B5675';
const LV_MUTED = '#8A96A3';
const LV_RULE = '#DDD6F3';
const LV_WHITE = '#FFFFFF';

const lvTitle = (x, y, kicker, titleHtml, size = 28) => [
  r(x, y, 38, 4.5, LV_PURPLE, { r: 2.2 }),
  t(kicker.toUpperCase(), x, y + 10, 300, 8.5, { bold: 1, color: LV_MUTED, font: 'Poppins', sp: 60 }),
  t(titleHtml, x, y + 26, 300, size, { bold: 1, color: LV_NAVY, font: 'Poppins', lh: 1.15 }),
];

const lvFooter = (x0, pw, label = 'GENOMICS SOLUTIONS') => [
  r(x0 + 34, 750, pw - 68, 1, LV_RULE),
  t('ONEOMICS', x0 + 34, 760, 120, 9, { bold: 1, color: LV_NAVY, font: 'Poppins' }),
  t(label, x0 + pw - 34 - 170, 760, 170, 8.5, { color: LV_MUTED, align: 'right', font: 'Poppins' }),
];

// Oneomics "Lavender & Violet" Tri-fold Brochure — Page 1 (Outside)
export function trifoldLavender() {
  const s = [];

  // ==========================================
  // PANEL 1: FLAP (Left, 0..367)
  // ==========================================
  s.push(r(0, 0, 367, 794, LV_WHITE));
  s.push(...lvTitle(34, 34, 'How We Work', 'Four steps,\none partner.'));
  s.push(t('ONEOMICS Private Limited connects every stage of the genomics workflow, from the first sample to the final analysis.', 34, 126, 300, 10, { color: LV_GREY, font: 'Poppins', lh: 1.38 }));

  s.push(r(34, 180, 300, 1, LV_NAVY));

  // 01 Collect
  s.push(t('01', 34, 192, 30, 14, { bold: 1, color: LV_PURPLE, font: 'Poppins' }));
  s.push(t('Collect', 70, 192, 264, 12, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('ONESpit™, ONEasy™, NucleoGUARD™, RNAguard™, ProteinGUARD™ and SoilGUARD™ keep samples stable in transit.', 70, 210, 264, 9, { color: LV_GREY, font: 'Poppins', lh: 1.35 }));

  // 02 Extract
  s.push(t('02', 34, 252, 30, 14, { bold: 1, color: LV_PURPLE, font: 'Poppins' }));
  s.push(t('Extract', 70, 252, 264, 12, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('ONEMag™ magnetic-bead kits for DNA and RNA from diverse sample types.', 70, 270, 264, 9, { color: LV_GREY, font: 'Poppins', lh: 1.35 }));

  // 03 Sequence
  s.push(t('03', 34, 312, 30, 14, { bold: 1, color: LV_PURPLE, font: 'Poppins' }));
  s.push(t('Sequence', 70, 312, 264, 12, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('ONENext™ library prep kits and a full range of sequencing services.', 70, 330, 264, 9, { color: LV_GREY, font: 'Poppins', lh: 1.35 }));

  // 04 Analyse
  s.push(t('04', 34, 372, 30, 14, { bold: 1, color: LV_PURPLE, font: 'Poppins' }));
  s.push(t('Analyse', 70, 372, 264, 12, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('DNASTAR Lasergene for sequence, genome and protein analysis.', 70, 390, 264, 9, { color: LV_GREY, font: 'Poppins', lh: 1.35 }));

  s.push(r(34, 436, 300, 1, LV_NAVY));

  // Mission
  s.push(t('Our Mission', 34, 448, 300, 12.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('To make high-quality genomic science accessible through reliable sequencing, robust sample-stabilization products and dependable molecular tools.', 34, 468, 300, 9.5, { color: LV_GREY, font: 'Poppins', lh: 1.35 }));

  // Vision
  s.push(t('Our Vision', 34, 532, 300, 12.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('To be a trusted partner in genomics, enabling discoveries that advance human health, agriculture and the environment.', 34, 552, 300, 9.5, { color: LV_GREY, font: 'Poppins', lh: 1.35 }));

  s.push(...lvFooter(0, 367));

  // ==========================================
  // PANEL 2: BACK COVER (Middle, 367..745)
  // ==========================================
  s.push(r(367, 0, 378, 794, LV_WHITE));
  s.push(...lvTitle(401, 34, 'Software', 'DNASTAR\nLasergene'));
  s.push(t('The trusted desktop suite for sequence analysis, genome assembly and protein research, available through ONEOMICS.', 401, 126, 310, 10, { color: LV_GREY, font: 'Poppins', lh: 1.38 }));

  s.push(r(401, 170, 310, 1, LV_NAVY));

  // Module 1
  s.push(t('1', 401, 182, 30, 24, { bold: 1, color: LV_PURPLE, font: 'Poppins' }));
  s.push(t('Molecular Biology Module', 434, 184, 277, 12.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('Sequence viewing, primer design, cloning and DNA/RNA analysis.', 434, 204, 277, 9.5, { color: LV_GREY, font: 'Poppins', lh: 1.3 }));
  s.push(r(401, 244, 310, 1, LV_RULE));

  // Module 2
  s.push(t('2', 401, 256, 30, 24, { bold: 1, color: LV_PURPLE, font: 'Poppins' }));
  s.push(t('Genomics Module', 434, 258, 277, 12.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('Assembly, alignment and analysis of next-generation sequencing data.', 434, 278, 277, 9.5, { color: LV_GREY, font: 'Poppins', lh: 1.3 }));
  s.push(r(401, 318, 310, 1, LV_RULE));

  // Module 3
  s.push(t('3', 401, 330, 30, 24, { bold: 1, color: LV_PURPLE, font: 'Poppins' }));
  s.push(t('Proteomics Module', 434, 332, 277, 12.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('Protein sequence analysis, structure prediction and visualization.', 434, 352, 277, 9.5, { color: LV_GREY, font: 'Poppins', lh: 1.3 }));

  // Contact Box (Lavender)
  s.push(r(385, 420, 342, 240, LV_LAVENDER, { r: 6 }));
  s.push(t('Get in touch', 401, 436, 310, 15, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('Tell us about your project, sample type or software needs.', 401, 460, 310, 9.5, { color: LV_GREY, font: 'Poppins' }));

  s.push(t('WEB', 401, 492, 58, 8.5, { bold: 1, color: LV_PURPLE, font: 'Poppins', sp: 60 }));
  s.push(t('www.[your-website].com', 465, 491, 240, 10, { color: LV_NAVY, font: 'Poppins' }));

  s.push(t('EMAIL', 401, 520, 58, 8.5, { bold: 1, color: LV_PURPLE, font: 'Poppins', sp: 60 }));
  s.push(t('[info@your-domain.com]', 465, 519, 240, 10, { color: LV_NAVY, font: 'Poppins' }));

  s.push(t('PHONE', 401, 548, 58, 8.5, { bold: 1, color: LV_PURPLE, font: 'Poppins', sp: 60 }));
  s.push(t('[+91 00000 00000]', 465, 547, 240, 10, { color: LV_NAVY, font: 'Poppins' }));

  s.push(t('ADDRESS', 401, 576, 58, 8.5, { bold: 1, color: LV_PURPLE, font: 'Poppins', sp: 60 }));
  s.push(t('[Company address, City, State, PIN]', 465, 575, 240, 9, { color: LV_NAVY, font: 'Poppins', lh: 1.3 }));

  s.push(...lvFooter(367, 378));

  // ==========================================
  // PANEL 3: FRONT COVER (Right, 745..1123)
  // ==========================================
  s.push(r(745, 0, 378, 794, LV_LAVENDER));
  s.push({ k: 'image', src: '/assets/oneomics_logo2.png', x: 779, y: 56, w: 220 });

  s.push(r(779, 180, 42, 5, LV_PURPLE, { r: 2.5 }));
  s.push(t('Every sample\ntells a story.', 779, 206, 320, 42, { bold: 1, color: LV_NAVY, font: 'Poppins', lh: 1.12 }));
  s.push(t('Sequencing services, sample collection kits and DNASTAR Lasergene software from one partner.', 779, 320, 310, 12, { color: LV_GREY, font: 'Poppins', lh: 1.45 }));

  s.push(t('SEQUENCING   ·   KITS   ·   SOFTWARE', 779, 580, 310, 9.5, { bold: 1, color: LV_PURPLE, font: 'Poppins', sp: 60 }));

  // 3 Pillars
  s.push(r(779, 608, 310, 1.2, LV_NAVY));
  s.push(t('01', 779, 620, 95, 9, { bold: 1, color: LV_PURPLE, font: 'Poppins' }));
  s.push(t('Sequencing', 779, 638, 95, 12, { bold: 1, color: LV_NAVY, font: 'Poppins' }));

  s.push(t('02', 886, 620, 95, 9, { bold: 1, color: LV_PURPLE, font: 'Poppins' }));
  s.push(t('Kits', 886, 638, 95, 12, { bold: 1, color: LV_NAVY, font: 'Poppins' }));

  s.push(t('03', 993, 620, 95, 9, { bold: 1, color: LV_PURPLE, font: 'Poppins' }));
  s.push(t('Software', 993, 638, 95, 12, { bold: 1, color: LV_NAVY, font: 'Poppins' }));

  return s;
}

// Oneomics "Lavender & Violet" Tri-fold Brochure — Page 2 (Inside)
export function trifoldLavenderInside() {
  const s = [];

  // ==========================================
  // PANEL A: SEQUENCING BY QUESTION (Left: 0..378)
  // ==========================================
  s.push(r(0, 0, 378, 794, LV_WHITE));
  s.push(...lvTitle(34, 34, 'Next Generation Sequencing', 'Sequencing\nby Question'));

  // Understand a genome
  s.push(t('UNDERSTAND A GENOME', 34, 124, 310, 9, { bold: 1, color: LV_PURPLE, font: 'Poppins', sp: 60 }));
  s.push(r(34, 138, 310, 1, LV_RULE));
  s.push(t('Whole Genome Sequencing', 34, 148, 310, 12, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('De novo · Reference-Based · Hi-C · Chloroplast · Mitochondrial', 34, 166, 310, 9, { color: LV_GREY, font: 'Poppins' }));
  s.push(t('Whole Exome Sequencing', 34, 190, 310, 12, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('Genotyping By Sequencing', 34, 214, 310, 12, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('Long Read Sequencing', 34, 238, 310, 12, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('PacBio · Nanopore', 34, 256, 310, 9, { color: LV_GREY, font: 'Poppins' }));

  // Read gene activity and regulation
  s.push(t('READ GENE ACTIVITY AND REGULATION', 34, 282, 310, 9, { bold: 1, color: LV_PURPLE, font: 'Poppins', sp: 60 }));
  s.push(r(34, 296, 310, 1, LV_RULE));
  s.push(t('Transcriptome Sequencing', 34, 306, 310, 12, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('Whole transcriptome · mRNA · Small RNA · Metatranscriptome · Dual RNA · Single cell RNA · Isoform', 34, 324, 310, 8.8, { color: LV_GREY, font: 'Poppins', lh: 1.25 }));
  s.push(t('Epigenetics', 34, 354, 310, 12, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('Whole genome bisulfite · Whole genome methylation', 34, 372, 310, 9, { color: LV_GREY, font: 'Poppins' }));
  s.push(t('ChIP-Sequencing', 34, 396, 310, 12, { bold: 1, color: LV_NAVY, font: 'Poppins' }));

  // Profile a microbiome
  s.push(t('PROFILE A MICROBIOME', 34, 426, 310, 9, { bold: 1, color: LV_PURPLE, font: 'Poppins', sp: 60 }));
  s.push(r(34, 440, 310, 1, LV_RULE));
  s.push(t('Metagenome Sequencing', 34, 450, 310, 12, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('16S V3–V4 · 16S V1–V9 · ITS · 18S · Shotgun · Custom amplicon · Meta-barcoding', 34, 468, 310, 8.8, { color: LV_GREY, font: 'Poppins', lh: 1.25 }));

  // Validate your findings
  s.push(t('VALIDATE YOUR FINDINGS', 34, 498, 310, 9, { bold: 1, color: LV_PURPLE, font: 'Poppins', sp: 60 }));
  s.push(r(34, 512, 310, 1, LV_RULE));
  s.push(t('qRT-PCR Validation', 34, 522, 310, 11.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('SSR Marker Validation', 34, 544, 310, 11.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('Taurine and Telomere Assay', 34, 566, 310, 11.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));

  // Callout Box (Lavender)
  s.push(r(34, 608, 310, 78, LV_LAVENDER, { r: 6 }));
  s.push(t('Have a custom project?', 48, 620, 282, 13.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('Share your sample type and research goal and we will help you choose the right approach.', 48, 642, 282, 9, { color: LV_GREY, font: 'Poppins', lh: 1.35 }));

  s.push(...lvFooter(0, 378));

  // ==========================================
  // PANEL B: KITS BY SAMPLE TYPE (Middle: 378..756)
  // ==========================================
  s.push(r(378, 0, 378, 794, LV_WHITE));
  s.push(...lvTitle(412, 34, 'Find Your Kit', 'Kits by\nSample Type'));
  s.push(r(412, 124, 310, 1.2, LV_NAVY));

  // Saliva
  s.push(t('Saliva', 412, 142, 310, 12.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('ONESpit™ to collect   ·   ONEMag™ Rapid Universal DNA to extract', 412, 160, 310, 9, { color: LV_GREY, font: 'Poppins' }));

  // Faecal
  s.push(t('Faecal', 412, 190, 310, 12.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('ONEasy™ to collect   ·   ONEMag™ Rapid Universal DNA to extract', 412, 208, 310, 9, { color: LV_GREY, font: 'Poppins' }));

  // Soil
  s.push(t('Soil', 412, 238, 310, 12.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('SoilGUARD™ to stabilize   ·   ONEMag™ Rapid Soil DNA or Soil RNA to extract', 412, 256, 310, 9, { color: LV_GREY, font: 'Poppins', lh: 1.25 }));

  // Plant tissue
  s.push(t('Plant tissue', 412, 288, 310, 12.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('ONEMag™ Rapid Plant DNA', 412, 306, 310, 9, { color: LV_GREY, font: 'Poppins' }));

  // RNA samples
  s.push(t('RNA samples', 412, 334, 310, 12.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('NucleoGUARD™ to stabilize   ·   RNAguard™ to ship at ambient temperature', 412, 352, 310, 9, { color: LV_GREY, font: 'Poppins', lh: 1.25 }));

  // Protein
  s.push(t('Protein', 412, 384, 310, 12.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('ProteinGUARD™ for ambient shipping', 412, 402, 310, 9, { color: LV_GREY, font: 'Poppins' }));

  // Microbiome libraries
  s.push(t('Microbiome libraries', 412, 430, 310, 12.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('ONENext™ 16S (V3–V4) for Illumina   ·   ONENext™ 16S (V1–V9) for ONT', 412, 448, 310, 9, { color: LV_GREY, font: 'Poppins', lh: 1.25 }));

  // Routine PCR
  s.push(t('Routine PCR', 412, 480, 310, 12.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('2X Taq Plus PCR Master Mix with RED dye', 412, 498, 310, 9, { color: LV_GREY, font: 'Poppins' }));

  // Callout Box (Lavender)
  s.push(r(412, 546, 310, 78, LV_LAVENDER, { r: 6 }));
  s.push(t('Not sure which kit?', 426, 558, 282, 13.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('Tell us your sample type and downstream application and our team will point you to the right product.', 426, 580, 282, 9, { color: LV_GREY, font: 'Poppins', lh: 1.35 }));

  s.push(...lvFooter(378, 378));

  // ==========================================
  // PANEL C: KITS & REAGENTS (Right: 756..1123)
  // ==========================================
  s.push(r(756, 0, 367, 794, LV_WHITE));
  s.push(...lvTitle(790, 34, 'Kits & Reagents', 'Our Range\nof Products'));

  // Collect & stabilize
  s.push(t('COLLECT & STABILIZE', 790, 124, 300, 9, { bold: 1, color: LV_PURPLE, font: 'Poppins', sp: 60 }));
  s.push(r(790, 138, 300, 1, LV_RULE));

  // 01 ONESpit
  s.push(t('01', 790, 148, 24, 10.5, { bold: 1, color: LV_PURPLE, font: 'Poppins' }));
  s.push(t('ONESpit™', 816, 148, 274, 10.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('Zero-prep saliva collection; DNA stable 1+ year at room temperature.', 816, 162, 274, 8.5, { color: LV_GREY, font: 'Poppins' }));

  // 02 ONEasy
  s.push(t('02', 790, 186, 24, 10.5, { bold: 1, color: LV_PURPLE, font: 'Poppins' }));
  s.push(t('ONEasy™', 816, 186, 274, 10.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('Faecal collection & preservation; room-temperature transport up to 2 years*.', 816, 200, 274, 8.5, { color: LV_GREY, font: 'Poppins' }));

  // 03 NucleoGUARD
  s.push(t('03', 790, 224, 24, 10.5, { bold: 1, color: LV_PURPLE, font: 'Poppins' }));
  s.push(t('NucleoGUARD™', 816, 224, 274, 10.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('RNA stabilization buffer.', 816, 238, 274, 8.5, { color: LV_GREY, font: 'Poppins' }));

  // 04 RNAguard
  s.push(t('04', 790, 256, 24, 10.5, { bold: 1, color: LV_PURPLE, font: 'Poppins' }));
  s.push(t('RNAguard™', 816, 256, 274, 10.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('Ambient shipping of total RNA.', 816, 270, 274, 8.5, { color: LV_GREY, font: 'Poppins' }));

  // 05 ProteinGUARD
  s.push(t('05', 790, 288, 24, 10.5, { bold: 1, color: LV_PURPLE, font: 'Poppins' }));
  s.push(t('ProteinGUARD™', 816, 288, 274, 10.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('Ambient shipping of protein.', 816, 302, 274, 8.5, { color: LV_GREY, font: 'Poppins' }));

  // 06 SoilGUARD
  s.push(t('06', 790, 320, 24, 10.5, { bold: 1, color: LV_PURPLE, font: 'Poppins' }));
  s.push(t('SoilGUARD™', 816, 320, 274, 10.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('Soil stabilization buffer.', 816, 334, 274, 8.5, { color: LV_GREY, font: 'Poppins' }));

  // Extract
  s.push(t('EXTRACT', 790, 358, 300, 9, { bold: 1, color: LV_PURPLE, font: 'Poppins', sp: 60 }));
  s.push(r(790, 372, 300, 1, LV_RULE));

  // 07 ONEMag Universal DNA
  s.push(t('07', 790, 382, 24, 10.5, { bold: 1, color: LV_PURPLE, font: 'Poppins' }));
  s.push(t('ONEMag™ Rapid Universal DNA', 816, 382, 274, 10.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('Under 30 minutes, from diverse sample types.', 816, 396, 274, 8.5, { color: LV_GREY, font: 'Poppins' }));

  // 08 ONEMag Soil DNA
  s.push(t('08', 790, 420, 24, 10.5, { bold: 1, color: LV_PURPLE, font: 'Poppins' }));
  s.push(t('ONEMag™ Rapid Soil DNA', 816, 420, 274, 10.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('Efficient removal of humic acids.', 816, 434, 274, 8.5, { color: LV_GREY, font: 'Poppins' }));

  // 09 ONEMag Plant DNA
  s.push(t('09', 790, 458, 24, 10.5, { bold: 1, color: LV_PURPLE, font: 'Poppins' }));
  s.push(t('ONEMag™ Rapid Plant DNA', 816, 458, 274, 10.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('For polysaccharide- and polyphenol-rich tissue.', 816, 472, 274, 8.5, { color: LV_GREY, font: 'Poppins' }));

  // 10 ONEMag Soil RNA
  s.push(t('10', 790, 496, 24, 10.5, { bold: 1, color: LV_PURPLE, font: 'Poppins' }));
  s.push(t('ONEMag™ Rapid Soil RNA', 816, 496, 274, 10.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('High-integrity RNA from soil samples.', 816, 510, 274, 8.5, { color: LV_GREY, font: 'Poppins' }));

  // Amplify & Sequence
  s.push(t('AMPLIFY & SEQUENCE', 790, 534, 300, 9, { bold: 1, color: LV_PURPLE, font: 'Poppins', sp: 60 }));
  s.push(r(790, 548, 300, 1, LV_RULE));

  // 11 ONENext 16S (V3-V4)
  s.push(t('11', 790, 558, 24, 10.5, { bold: 1, color: LV_PURPLE, font: 'Poppins' }));
  s.push(t('ONENext™ 16S (V3–V4)', 816, 558, 274, 10.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('Library prep kit for Illumina.', 816, 572, 274, 8.5, { color: LV_GREY, font: 'Poppins' }));

  // 12 ONENext 16S (V1-V9)
  s.push(t('12', 790, 596, 24, 10.5, { bold: 1, color: LV_PURPLE, font: 'Poppins' }));
  s.push(t('ONENext™ 16S (V1–V9)', 816, 596, 274, 10.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('Full-length library prep kit for ONT.', 816, 610, 274, 8.5, { color: LV_GREY, font: 'Poppins' }));

  // 13 2X Taq Plus
  s.push(t('13', 790, 634, 24, 10.5, { bold: 1, color: LV_PURPLE, font: 'Poppins' }));
  s.push(t('2X Taq Plus PCR Master Mix', 816, 634, 274, 10.5, { bold: 1, color: LV_NAVY, font: 'Poppins' }));
  s.push(t('Ready-to-use, with RED dye for direct gel loading.', 816, 648, 274, 8.5, { color: LV_GREY, font: 'Poppins' }));

  // Footnote
  s.push(t('*Under validated storage conditions. Refer to the product datasheet.', 790, 680, 300, 8, { italic: 1, color: LV_MUTED, font: 'Poppins' }));
  s.push(...lvFooter(756, 367));

  return s;
}

// --- Tri-fold 11: Amber & Gold (Oneomics) ---
const AM_NAVY = '#14213D';
const AM_AMBER = '#D68A00';
const AM_CREAM = '#FFF5DC';
const AM_GREY = '#566075';
const AM_MUTED = '#8A96A3';
const AM_RULE = '#F0E3BF';
const AM_WHITE = '#FFFFFF';

const amTitle = (x, y, kicker, titleHtml, size = 28) => [
  r(x, y, 38, 4.5, AM_AMBER, { r: 2.2 }),
  t(kicker.toUpperCase(), x, y + 10, 300, 8.5, { bold: 1, color: AM_MUTED, font: 'Poppins', sp: 60 }),
  t(titleHtml, x, y + 26, 300, size, { bold: 1, color: AM_NAVY, font: 'Poppins', lh: 1.15 }),
];

const amFooter = (x0, pw, label = 'GENOMICS SOLUTIONS') => [
  r(x0 + 34, 750, pw - 68, 1, AM_RULE),
  t('ONEOMICS', x0 + 34, 760, 120, 9, { bold: 1, color: AM_NAVY, font: 'Poppins' }),
  t(label, x0 + pw - 34 - 170, 760, 170, 8.5, { color: AM_MUTED, align: 'right', font: 'Poppins' }),
];

// Oneomics "Amber & Gold" Tri-fold Brochure — Page 1 (Outside)
export function trifoldAmber() {
  const s = [];

  // ==========================================
  // PANEL 1: FLAP (Left, 0..367)
  // ==========================================
  s.push(r(0, 0, 367, 794, AM_WHITE));
  s.push(...amTitle(34, 34, 'At a glance', 'ONEOMICS\nin numbers.'));
  s.push(t('ONEOMICS Private Limited is a genomics company offering sequencing services, sample collection and stabilization products, extraction and library-prep kits, and bioinformatics software.', 34, 126, 300, 9.5, { color: AM_GREY, font: 'Poppins', lh: 1.35 }));

  // Stats Grid (2 columns, 3 rows)
  // Row 1
  s.push(r(34, 196, 136, 1.5, AM_AMBER));
  s.push(t('13', 34, 204, 136, 24, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Kits and reagents', 34, 234, 136, 9, { color: AM_GREY, font: 'Poppins' }));

  s.push(r(186, 196, 148, 1.5, AM_AMBER));
  s.push(t('11', 186, 204, 148, 24, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Sequencing service lines', 186, 234, 148, 9, { color: AM_GREY, font: 'Poppins' }));

  // Row 2
  s.push(r(34, 264, 136, 1.5, AM_AMBER));
  s.push(t('3', 34, 272, 136, 24, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Lasergene software modules', 34, 302, 136, 9, { color: AM_GREY, font: 'Poppins' }));

  s.push(r(186, 264, 148, 1.5, AM_AMBER));
  s.push(t('3', 186, 272, 148, 24, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Sequencing platforms', 186, 302, 148, 9, { color: AM_GREY, font: 'Poppins' }));

  // Row 3
  s.push(r(34, 332, 136, 1.5, AM_AMBER));
  s.push(t('<30 min', 34, 340, 136, 20, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Universal DNA extraction', 34, 368, 136, 9, { color: AM_GREY, font: 'Poppins' }));

  s.push(r(186, 332, 148, 1.5, AM_AMBER));
  s.push(t('1+ yr', 186, 340, 148, 20, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('DNA stable at room temperature with ONESpit™', 186, 368, 148, 8.5, { color: AM_GREY, font: 'Poppins', lh: 1.25 }));

  s.push(r(34, 436, 300, 1, AM_NAVY));

  // Mission
  s.push(t('Our Mission', 34, 448, 300, 12.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('To make high-quality genomic science accessible through reliable sequencing, robust sample-stabilization products and dependable molecular tools.', 34, 468, 300, 9.5, { color: AM_GREY, font: 'Poppins', lh: 1.35 }));

  // Vision
  s.push(t('Our Vision', 34, 532, 300, 12.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('To be a trusted partner in genomics, enabling discoveries that advance human health, agriculture and the environment.', 34, 552, 300, 9.5, { color: AM_GREY, font: 'Poppins', lh: 1.35 }));

  s.push(...amFooter(0, 367));

  // ==========================================
  // PANEL 2: BACK COVER (Middle, 367..745)
  // ==========================================
  s.push(r(367, 0, 378, 794, AM_WHITE));
  s.push(...amTitle(401, 34, 'Get in touch', 'Let\'s start\nyour project.'));
  s.push(t('Whether you need a single kit, a sequencing project or analysis software, tell us what you are working on.', 401, 126, 310, 10, { color: AM_GREY, font: 'Poppins', lh: 1.38 }));

  // Contact Box (Cream / Peach)
  s.push(r(385, 172, 342, 196, AM_CREAM, { r: 6 }));
  s.push(t('Get in touch', 401, 186, 310, 14, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Tell us about your project, sample type or software needs.', 401, 206, 310, 9, { color: AM_GREY, font: 'Poppins' }));

  s.push(t('WEB', 401, 234, 58, 8.5, { bold: 1, color: AM_AMBER, font: 'Poppins', sp: 60 }));
  s.push(t('www.[your-website].com', 465, 233, 240, 9.5, { color: AM_NAVY, font: 'Poppins' }));

  s.push(t('EMAIL', 401, 258, 58, 8.5, { bold: 1, color: AM_AMBER, font: 'Poppins', sp: 60 }));
  s.push(t('[info@your-domain.com]', 465, 257, 240, 9.5, { color: AM_NAVY, font: 'Poppins' }));

  s.push(t('PHONE', 401, 282, 58, 8.5, { bold: 1, color: AM_AMBER, font: 'Poppins', sp: 60 }));
  s.push(t('[+91 00000 00000]', 465, 281, 240, 9.5, { color: AM_NAVY, font: 'Poppins' }));

  s.push(t('ADDRESS', 401, 306, 58, 8.5, { bold: 1, color: AM_AMBER, font: 'Poppins', sp: 60 }));
  s.push(t('[Company address, City, State, PIN]', 465, 305, 240, 8.5, { color: AM_NAVY, font: 'Poppins', lh: 1.3 }));

  s.push(r(401, 386, 310, 1, AM_NAVY));

  // What happens next
  s.push(t('What happens next', 401, 398, 310, 12.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));

  // 01
  s.push(t('01', 401, 422, 28, 12, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('Tell us about your project', 432, 422, 279, 11, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Share your sample type and research goal.', 432, 438, 279, 8.5, { color: AM_GREY, font: 'Poppins' }));

  // 02
  s.push(t('02', 401, 464, 28, 12, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('We recommend an approach', 432, 464, 279, 11, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Our team helps you pick the right kit or sequencing service.', 432, 480, 279, 8.5, { color: AM_GREY, font: 'Poppins' }));

  // 03
  s.push(t('03', 401, 506, 28, 12, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('Get started', 432, 506, 279, 11, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Collect your samples and move from sample to insight.', 432, 522, 279, 8.5, { color: AM_GREY, font: 'Poppins' }));

  s.push(r(401, 552, 310, 1, AM_NAVY));

  // Who we work with
  s.push(t('Who we work with', 401, 564, 310, 12.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('<b>Researchers:</b> genomics and microbiome studies.', 401, 586, 310, 9, { color: AM_GREY, font: 'Poppins' }));
  s.push(t('<b>Clinicians:</b> diagnostic and clinical research.', 401, 608, 310, 9, { color: AM_GREY, font: 'Poppins' }));
  s.push(t('<b>Agri-scientists:</b> soil, plant and rhizosphere work.', 401, 630, 310, 9, { color: AM_GREY, font: 'Poppins' }));

  s.push(...amFooter(367, 378));

  // ==========================================
  // PANEL 3: FRONT COVER (Right, 745..1123)
  // ==========================================
  s.push(r(745, 0, 378, 794, AM_CREAM));
  s.push({ k: 'image', src: '/assets/oneomics_logo2.png', x: 779, y: 56, w: 220 });

  s.push(r(779, 180, 42, 5, AM_AMBER, { r: 2.5 }));
  s.push(t('Decode\nwhat matters.', 779, 206, 320, 42, { bold: 1, color: AM_NAVY, font: 'Poppins', lh: 1.12 }));
  s.push(t('Sequencing services, sample collection kits and DNASTAR Lasergene software from one partner.', 779, 320, 310, 12, { color: AM_GREY, font: 'Poppins', lh: 1.45 }));

  s.push(t('SEQUENCING   ·   KITS   ·   SOFTWARE', 779, 580, 310, 9.5, { bold: 1, color: AM_AMBER, font: 'Poppins', sp: 60 }));

  // 3 Pillars
  s.push(r(779, 608, 310, 1.2, AM_NAVY));
  s.push(t('01', 779, 620, 95, 9, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('Sequencing', 779, 638, 95, 12, { bold: 1, color: AM_NAVY, font: 'Poppins' }));

  s.push(t('02', 886, 620, 95, 9, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('Kits', 886, 638, 95, 12, { bold: 1, color: AM_NAVY, font: 'Poppins' }));

  s.push(t('03', 993, 620, 95, 9, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('Software', 993, 638, 95, 12, { bold: 1, color: AM_NAVY, font: 'Poppins' }));

  return s;
}

// Oneomics "Amber & Gold" Tri-fold Brochure — Page 2 (Inside)
export function trifoldAmberInside() {
  const s = [];

  // ==========================================
  // PANEL A: SEQUENCING SERVICES (Left: 0..378)
  // ==========================================
  s.push(r(0, 0, 378, 794, AM_WHITE));
  s.push(...amTitle(34, 34, 'Next Generation Sequencing', 'Sequencing\nServices'));
  s.push(r(34, 124, 310, 1.2, AM_NAVY));

  // 01 Whole Genome
  s.push(t('01', 34, 142, 26, 12, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('Whole Genome', 64, 142, 280, 11.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('De novo, reference-based, Hi-C, chloroplast, mitochondrial', 64, 158, 280, 8.5, { color: AM_GREY, font: 'Poppins', lh: 1.25 }));

  // 02 Whole Exome
  s.push(t('02', 34, 194, 26, 12, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('Whole Exome', 64, 194, 280, 11.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));

  // 03 Epigenetics
  s.push(t('03', 34, 222, 26, 12, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('Epigenetics', 64, 222, 280, 11.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Whole genome bisulfite and methylation sequencing', 64, 238, 280, 8.5, { color: AM_GREY, font: 'Poppins', lh: 1.25 }));

  // 04 Genotyping
  s.push(t('04', 34, 264, 26, 12, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('Genotyping By Sequencing', 64, 264, 280, 11.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));

  // 05 Metagenome
  s.push(t('05', 34, 292, 26, 12, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('Metagenome', 64, 292, 280, 11.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('16S V3–V4, 16S V1–V9, ITS, 18S, shotgun, custom amplicon, meta-barcoding', 64, 308, 280, 8.5, { color: AM_GREY, font: 'Poppins', lh: 1.25 }));

  // 06 Transcriptome
  s.push(t('06', 34, 344, 26, 12, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('Transcriptome', 64, 344, 280, 11.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Whole transcriptome, mRNA, small RNA, metatranscriptome, dual RNA, single cell RNA, isoform', 64, 360, 280, 8.5, { color: AM_GREY, font: 'Poppins', lh: 1.25 }));

  // 07 Long Read
  s.push(t('07', 34, 404, 26, 12, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('Long Read', 64, 404, 280, 11.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('PacBio and Nanopore sequencing', 64, 420, 280, 8.5, { color: AM_GREY, font: 'Poppins', lh: 1.25 }));

  // 08 qRT-PCR
  s.push(t('08', 34, 444, 26, 12, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('qRT-PCR Validation', 64, 444, 280, 11.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));

  // 09 SSR Marker
  s.push(t('09', 34, 470, 26, 12, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('SSR Marker Validation', 64, 470, 280, 11.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));

  // 10 Taurine and Telomere Assay
  s.push(t('10', 34, 496, 26, 12, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('Taurine and Telomere Assay', 64, 496, 280, 11.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));

  // 11 ChIP-Sequencing
  s.push(t('11', 34, 522, 26, 12, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('ChIP-Sequencing', 64, 522, 280, 11.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));

  // Callout card (Cream)
  s.push(r(34, 566, 310, 78, AM_CREAM, { r: 6 }));
  s.push(t('Have a custom project?', 48, 578, 282, 13.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Share your sample type and research goal and our team will help you choose the right sequencing approach.', 48, 600, 282, 9, { color: AM_GREY, font: 'Poppins', lh: 1.35 }));

  s.push(...amFooter(0, 378));

  // ==========================================
  // PANEL B: KITS & REAGENTS (Middle: 378..756)
  // ==========================================
  s.push(r(378, 0, 378, 794, AM_WHITE));
  s.push(...amTitle(412, 34, 'Kits & Reagents', 'Collect,\nStabilize & Extract'));

  // Collect & stabilize
  s.push(t('COLLECT & STABILIZE', 412, 124, 310, 9, { bold: 1, color: AM_AMBER, font: 'Poppins', sp: 60 }));
  s.push(r(412, 138, 310, 1, AM_RULE));

  // 01 ONESpit
  s.push(t('01', 412, 148, 24, 10.5, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('ONESpit™', 438, 148, 284, 10.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Zero-prep saliva collection; DNA stable 1+ year at room temperature.', 438, 162, 284, 8.5, { color: AM_GREY, font: 'Poppins' }));

  // 02 ONEasy
  s.push(t('02', 412, 186, 24, 10.5, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('ONEasy™', 438, 186, 284, 10.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Faecal collection and preservation; room-temperature transport up to 2 years*.', 438, 200, 284, 8.5, { color: AM_GREY, font: 'Poppins' }));

  // 03 NucleoGUARD
  s.push(t('03', 412, 224, 24, 10.5, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('NucleoGUARD™', 438, 224, 284, 10.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('RNA stabilization buffer.', 438, 238, 284, 8.5, { color: AM_GREY, font: 'Poppins' }));

  // 04 RNAguard
  s.push(t('04', 412, 256, 24, 10.5, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('RNAguard™', 438, 256, 284, 10.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Ambient shipping of total RNA.', 438, 270, 284, 8.5, { color: AM_GREY, font: 'Poppins' }));

  // 05 ProteinGUARD
  s.push(t('05', 412, 288, 24, 10.5, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('ProteinGUARD™', 438, 288, 284, 10.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Ambient shipping of protein.', 438, 302, 284, 8.5, { color: AM_GREY, font: 'Poppins' }));

  // 06 SoilGUARD
  s.push(t('06', 412, 320, 24, 10.5, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('SoilGUARD™', 438, 320, 284, 10.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Soil stabilization buffer.', 438, 334, 284, 8.5, { color: AM_GREY, font: 'Poppins' }));

  // Extract
  s.push(t('EXTRACT', 412, 358, 310, 9, { bold: 1, color: AM_AMBER, font: 'Poppins', sp: 60 }));
  s.push(r(412, 372, 310, 1, AM_RULE));

  // 07 ONEMag Universal DNA
  s.push(t('07', 412, 382, 24, 10.5, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('ONEMag™ Rapid Universal DNA', 438, 382, 284, 10.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Under 30 minutes, from diverse sample types.', 438, 396, 284, 8.5, { color: AM_GREY, font: 'Poppins' }));

  // 08 ONEMag Soil DNA
  s.push(t('08', 412, 420, 24, 10.5, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('ONEMag™ Rapid Soil DNA', 438, 420, 284, 10.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Efficient removal of humic acids.', 438, 434, 284, 8.5, { color: AM_GREY, font: 'Poppins' }));

  // 09 ONEMag Plant DNA
  s.push(t('09', 412, 458, 24, 10.5, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('ONEMag™ Rapid Plant DNA', 438, 458, 284, 10.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('For polysaccharide- and polyphenol-rich tissue.', 438, 472, 284, 8.5, { color: AM_GREY, font: 'Poppins' }));

  // 10 ONEMag Soil RNA
  s.push(t('10', 412, 496, 24, 10.5, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('ONEMag™ Rapid Soil RNA', 438, 496, 284, 10.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('High-integrity RNA from soil samples.', 438, 510, 284, 8.5, { color: AM_GREY, font: 'Poppins' }));

  // Footnote
  s.push(t('*Under validated storage conditions. Refer to the product datasheet.', 412, 546, 310, 8, { italic: 1, color: AM_MUTED, font: 'Poppins' }));
  s.push(...amFooter(378, 378));

  // ==========================================
  // PANEL C: KITS & SOFTWARE (Right: 756..1123)
  // ==========================================
  s.push(r(756, 0, 367, 794, AM_WHITE));
  s.push(...amTitle(790, 34, 'Kits & Software', 'Amplify &\nAnalyse'));

  // Library prep & PCR
  s.push(t('LIBRARY PREP & PCR', 790, 124, 300, 9, { bold: 1, color: AM_AMBER, font: 'Poppins', sp: 60 }));
  s.push(r(790, 138, 300, 1, AM_RULE));

  // 11 ONENext 16S (V3-V4)
  s.push(t('11', 790, 148, 24, 10.5, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('ONENext™ 16S (V3–V4)', 816, 148, 274, 10.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Library prep kit for Illumina, with indexed, multiplexed sequencing.', 816, 162, 274, 8.5, { color: AM_GREY, font: 'Poppins', lh: 1.25 }));

  // 12 ONENext 16S (V1-V9)
  s.push(t('12', 790, 196, 24, 10.5, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('ONENext™ 16S (V1–V9)', 816, 196, 274, 10.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Full-length (~1.5 kb) library prep kit for Oxford Nanopore.', 816, 210, 274, 8.5, { color: AM_GREY, font: 'Poppins' }));

  // 13 2X Taq Plus
  s.push(t('13', 790, 240, 24, 10.5, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('2X Taq Plus PCR Master Mix', 816, 240, 274, 10.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Ready-to-use, with RED dye for direct gel loading.', 816, 254, 274, 8.5, { color: AM_GREY, font: 'Poppins' }));

  // Software
  s.push(t('SOFTWARE', 790, 286, 300, 9, { bold: 1, color: AM_AMBER, font: 'Poppins', sp: 60 }));
  s.push(r(790, 300, 300, 1, AM_RULE));

  s.push(t('DNASTAR Lasergene', 790, 310, 300, 13.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('The trusted desktop suite for sequence analysis, genome assembly and protein research, available through ONEOMICS.', 790, 328, 300, 8.8, { color: AM_GREY, font: 'Poppins', lh: 1.3 }));

  // 1 Molecular Biology
  s.push(t('1', 790, 368, 20, 11, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('Molecular Biology Module', 810, 368, 280, 10.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Sequence viewing, primer design, cloning and DNA/RNA analysis.', 810, 382, 280, 8.5, { color: AM_GREY, font: 'Poppins' }));

  // 2 Genomics
  s.push(t('2', 790, 410, 20, 11, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('Genomics Module', 810, 410, 280, 10.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Assembly, alignment and analysis of next-generation sequencing data.', 810, 424, 280, 8.5, { color: AM_GREY, font: 'Poppins' }));

  // 3 Proteomics
  s.push(t('3', 790, 452, 20, 11, { bold: 1, color: AM_AMBER, font: 'Poppins' }));
  s.push(t('Proteomics Module', 810, 452, 280, 10.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Protein sequence analysis, structure prediction and visualization.', 810, 466, 280, 8.5, { color: AM_GREY, font: 'Poppins' }));

  // Callout card (Cream)
  s.push(r(790, 524, 300, 78, AM_CREAM, { r: 6 }));
  s.push(t('Want to know more?', 804, 536, 272, 13.5, { bold: 1, color: AM_NAVY, font: 'Poppins' }));
  s.push(t('Contact ONEOMICS for DNASTAR Lasergene module details and for help choosing the right kit.', 804, 558, 272, 9, { color: AM_GREY, font: 'Poppins', lh: 1.35 }));

  s.push(...amFooter(756, 367));

  return s;
}

// --- Tri-fold 12: Sky & Cerulean (Oneomics) ---
const SK_NAVY = '#0B3C5D';
const SK_BLUE = '#1E9BD7';
const SK_ICE = '#E8F4FB';
const SK_GREY = '#4F6475';
const SK_MUTED = '#8A96A3';
const SK_RULE = '#CFE5F2';
const SK_WHITE = '#FFFFFF';

const skTitle = (x, y, kicker, titleHtml, size = 28) => [
  r(x, y, 38, 4.5, SK_BLUE, { r: 2.2 }),
  t(kicker.toUpperCase(), x, y + 10, 300, 8.5, { bold: 1, color: SK_MUTED, font: 'Poppins', sp: 60 }),
  t(titleHtml, x, y + 26, 300, size, { bold: 1, color: SK_NAVY, font: 'Poppins', lh: 1.15 }),
];

const skFooter = (x0, pw, label = 'GENOMICS SOLUTIONS') => [
  r(x0 + 34, 750, pw - 68, 1, SK_RULE),
  t('ONEOMICS', x0 + 34, 760, 120, 9, { bold: 1, color: SK_NAVY, font: 'Poppins' }),
  t(label, x0 + pw - 34 - 170, 760, 170, 8.5, { color: SK_MUTED, align: 'right', font: 'Poppins' }),
];

// Oneomics "Sky & Cerulean" Tri-fold Brochure — Page 1 (Outside)
export function trifoldSky() {
  const s = [];

  // ==========================================
  // PANEL 1: FLAP (Left, 0..367)
  // ==========================================
  s.push(r(0, 0, 367, 794, SK_WHITE));
  s.push(...skTitle(34, 34, 'Solutions by field', 'Genomics for\nevery field.'));
  s.push(t('ONEOMICS helps researchers, clinicians and agri-scientists move from sample to insight with confidence.', 34, 126, 300, 9.5, { color: SK_GREY, font: 'Poppins', lh: 1.35 }));

  s.push(r(34, 180, 300, 1, SK_NAVY));

  // 01 Human health
  s.push(t('01', 34, 196, 28, 13, { bold: 1, color: SK_BLUE, font: 'Poppins' }));
  s.push(t('Human health', 68, 196, 266, 12.5, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('ONESpit™ and ONEasy™ collection kits, Whole Exome and methylation sequencing, ONEMag™ Universal DNA.', 68, 214, 266, 9, { color: SK_GREY, font: 'Poppins', lh: 1.3 }));

  // 02 Agriculture
  s.push(t('02', 34, 262, 28, 13, { bold: 1, color: SK_BLUE, font: 'Poppins' }));
  s.push(t('Agriculture', 68, 262, 266, 12.5, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('ONEMag™ Plant DNA, Genotyping By Sequencing and SSR Marker Validation.', 68, 280, 266, 9, { color: SK_GREY, font: 'Poppins', lh: 1.3 }));

  // 03 Environment
  s.push(t('03', 34, 328, 28, 13, { bold: 1, color: SK_BLUE, font: 'Poppins' }));
  s.push(t('Environment', 68, 328, 266, 12.5, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('SoilGUARD™, ONEMag™ Soil DNA and RNA, and eDNA analysis.', 68, 346, 266, 9, { color: SK_GREY, font: 'Poppins', lh: 1.3 }));

  // 04 Microbiome
  s.push(t('04', 34, 394, 28, 13, { bold: 1, color: SK_BLUE, font: 'Poppins' }));
  s.push(t('Microbiome', 68, 394, 266, 12.5, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('ONENext™ 16S library prep with 16S, ITS and shotgun metagenome sequencing.', 68, 412, 266, 9, { color: SK_GREY, font: 'Poppins', lh: 1.3 }));

  s.push(r(34, 468, 300, 1, SK_NAVY));

  // Mission & Vision
  s.push(t('<b>Mission:</b> to make high-quality genomic science accessible through reliable sequencing, robust sample-stabilization products and dependable molecular tools.', 34, 482, 300, 9.5, { color: SK_GREY, font: 'Poppins', lh: 1.35 }));
  s.push(t('<b>Vision:</b> to be a trusted partner in genomics, enabling discoveries that advance human health, agriculture and the environment.', 34, 546, 300, 9.5, { color: SK_GREY, font: 'Poppins', lh: 1.35 }));

  s.push(...skFooter(0, 367));

  // ==========================================
  // PANEL 2: BACK COVER (Middle, 367..745)
  // ==========================================
  s.push(r(367, 0, 378, 794, SK_WHITE));
  s.push(...skTitle(401, 34, 'Software', 'DNASTAR\nLasergene'));
  s.push(t('The trusted desktop suite for sequence analysis, genome assembly and protein research, available through ONEOMICS.', 401, 126, 310, 10, { color: SK_GREY, font: 'Poppins', lh: 1.38 }));

  s.push(r(401, 170, 310, 1, SK_NAVY));

  // Module 1
  s.push(t('1', 401, 182, 30, 24, { bold: 1, color: SK_BLUE, font: 'Poppins' }));
  s.push(t('Molecular Biology Module', 434, 184, 277, 12.5, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('Sequence viewing, primer design, cloning and DNA/RNA analysis.', 434, 204, 277, 9.5, { color: SK_GREY, font: 'Poppins', lh: 1.3 }));
  s.push(r(401, 244, 310, 1, SK_RULE));

  // Module 2
  s.push(t('2', 401, 256, 30, 24, { bold: 1, color: SK_BLUE, font: 'Poppins' }));
  s.push(t('Genomics Module', 434, 258, 277, 12.5, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('Assembly, alignment and analysis of next-generation sequencing data.', 434, 278, 277, 9.5, { color: SK_GREY, font: 'Poppins', lh: 1.3 }));
  s.push(r(401, 318, 310, 1, SK_RULE));

  // Module 3
  s.push(t('3', 401, 330, 30, 24, { bold: 1, color: SK_BLUE, font: 'Poppins' }));
  s.push(t('Proteomics Module', 434, 332, 277, 12.5, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('Protein sequence analysis, structure prediction and visualization.', 434, 352, 277, 9.5, { color: SK_GREY, font: 'Poppins', lh: 1.3 }));

  // Contact Box (Ice Blue)
  s.push(r(385, 420, 342, 240, SK_ICE, { r: 6 }));
  s.push(t('Get in touch', 401, 436, 310, 15, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('Tell us about your project, sample type or software needs.', 401, 460, 310, 9.5, { color: SK_GREY, font: 'Poppins' }));

  s.push(t('WEB', 401, 492, 58, 8.5, { bold: 1, color: SK_BLUE, font: 'Poppins', sp: 60 }));
  s.push(t('www.[your-website].com', 465, 491, 240, 10, { color: SK_NAVY, font: 'Poppins' }));

  s.push(t('EMAIL', 401, 520, 58, 8.5, { bold: 1, color: SK_BLUE, font: 'Poppins', sp: 60 }));
  s.push(t('[info@your-domain.com]', 465, 519, 240, 10, { color: SK_NAVY, font: 'Poppins' }));

  s.push(t('PHONE', 401, 548, 58, 8.5, { bold: 1, color: SK_BLUE, font: 'Poppins', sp: 60 }));
  s.push(t('[+91 00000 00000]', 465, 547, 240, 10, { color: SK_NAVY, font: 'Poppins' }));

  s.push(t('ADDRESS', 401, 576, 58, 8.5, { bold: 1, color: SK_BLUE, font: 'Poppins', sp: 60 }));
  s.push(t('[Company address, City, State, PIN]', 465, 575, 240, 9, { color: SK_NAVY, font: 'Poppins', lh: 1.3 }));

  s.push(...skFooter(367, 378));

  // ==========================================
  // PANEL 3: FRONT COVER (Right, 745..1123)
  // ==========================================
  s.push(r(745, 0, 378, 794, SK_ICE));
  s.push({ k: 'image', src: '/assets/oneomics_logo2.png', x: 779, y: 56, w: 220 });

  s.push(r(779, 180, 42, 5, SK_BLUE, { r: 2.5 }));
  s.push(t('Genomics\nwithin reach.', 779, 206, 320, 42, { bold: 1, color: SK_NAVY, font: 'Poppins', lh: 1.12 }));
  s.push(t('Sequencing services, sample collection kits and DNASTAR Lasergene software from one partner.', 779, 320, 310, 12, { color: SK_GREY, font: 'Poppins', lh: 1.45 }));

  s.push(t('SEQUENCING   ·   KITS   ·   SOFTWARE', 779, 580, 310, 9.5, { bold: 1, color: SK_BLUE, font: 'Poppins', sp: 60 }));

  // 3 Pillars
  s.push(r(779, 608, 310, 1.2, SK_NAVY));
  s.push(t('01', 779, 620, 95, 9, { bold: 1, color: SK_BLUE, font: 'Poppins' }));
  s.push(t('Sequencing', 779, 638, 95, 12, { bold: 1, color: SK_NAVY, font: 'Poppins' }));

  s.push(t('02', 886, 620, 95, 9, { bold: 1, color: SK_BLUE, font: 'Poppins' }));
  s.push(t('Kits', 886, 638, 95, 12, { bold: 1, color: SK_NAVY, font: 'Poppins' }));

  s.push(t('03', 993, 620, 95, 9, { bold: 1, color: SK_BLUE, font: 'Poppins' }));
  s.push(t('Software', 993, 638, 95, 12, { bold: 1, color: SK_NAVY, font: 'Poppins' }));

  return s;
}

// Oneomics "Sky & Cerulean" Tri-fold Brochure — Page 2 (Inside)
export function trifoldSkyInside() {
  const s = [];

  // ==========================================
  // PANEL A: NEXT GENERATION SEQUENCING (Left: 0..378)
  // ==========================================
  s.push(r(0, 0, 378, 794, SK_WHITE));
  s.push(...skTitle(34, 34, 'Next Generation Sequencing', 'Which service\nis right for you?'));
  s.push(r(34, 124, 310, 1.2, SK_NAVY));

  // Q1
  s.push(t('Read a whole genome?', 34, 138, 310, 12, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('Whole Genome Sequencing: de novo, reference-based, Hi-C, chloroplast or mitochondrial.', 34, 154, 310, 8.8, { color: SK_GREY, font: 'Poppins', lh: 1.25 }));

  // Q2
  s.push(t('Focus on coding regions?', 34, 194, 310, 12, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('Whole Exome Sequencing.', 34, 210, 310, 8.8, { color: SK_GREY, font: 'Poppins' }));

  // Q3
  s.push(t('Genotype many samples?', 34, 236, 310, 12, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('Genotyping By Sequencing.', 34, 252, 310, 8.8, { color: SK_GREY, font: 'Poppins' }));

  // Q4
  s.push(t('Measure gene expression?', 34, 278, 310, 12, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('Transcriptome Sequencing, from whole transcriptome and small RNA to single cell, with qRT-PCR Validation.', 34, 294, 310, 8.8, { color: SK_GREY, font: 'Poppins', lh: 1.25 }));

  // Q5
  s.push(t('Study methylation or regulation?', 34, 336, 310, 12, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('Epigenetics (bisulfite and methylation sequencing) and ChIP-Sequencing.', 34, 352, 310, 8.8, { color: SK_GREY, font: 'Poppins' }));

  // Q6
  s.push(t('Identify microbes?', 34, 378, 310, 12, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('Metagenome Sequencing: 16S, ITS, 18S, shotgun, custom amplicon and meta-barcoding.', 34, 394, 310, 8.8, { color: SK_GREY, font: 'Poppins', lh: 1.25 }));

  // Q7
  s.push(t('Need long reads?', 34, 436, 310, 12, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('PacBio and Nanopore sequencing.', 34, 452, 310, 8.8, { color: SK_GREY, font: 'Poppins' }));

  // Q8
  s.push(t('Validate markers or run assays?', 34, 478, 310, 12, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('SSR Marker Validation and Taurine and Telomere Assay.', 34, 494, 310, 8.8, { color: SK_GREY, font: 'Poppins' }));

  // Callout card (Ice Blue)
  s.push(r(34, 550, 310, 78, SK_ICE, { r: 6 }));
  s.push(t('Have a custom project?', 48, 562, 282, 13.5, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('Share your sample type and research goal and our team will help you choose the right approach.', 48, 584, 282, 9, { color: SK_GREY, font: 'Poppins', lh: 1.35 }));

  s.push(...skFooter(0, 378));

  // ==========================================
  // PANEL B: KITS & REAGENTS (Middle: 378..756)
  // ==========================================
  s.push(r(378, 0, 378, 794, SK_WHITE));
  s.push(...skTitle(412, 34, 'Kits & Reagents', 'Kits that\ntravel well.'));

  // Section: NO COLD CHAIN
  s.push(t('NO COLD CHAIN', 412, 124, 310, 9, { bold: 1, color: SK_BLUE, font: 'Poppins', sp: 60 }));
  s.push(r(412, 138, 310, 1, SK_RULE));

  // 01 ONESpit
  s.push(t('01', 412, 148, 24, 10.5, { bold: 1, color: SK_BLUE, font: 'Poppins' }));
  s.push(t('ONESpit™', 438, 148, 284, 11, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('Saliva collection; DNA stable 1+ year at room temperature.', 438, 164, 284, 8.8, { color: SK_GREY, font: 'Poppins' }));

  // 02 ONEasy
  s.push(t('02', 412, 192, 24, 10.5, { bold: 1, color: SK_BLUE, font: 'Poppins' }));
  s.push(t('ONEasy™', 438, 192, 284, 11, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('Faecal collection; room-temperature transport up to 2 years*.', 438, 208, 284, 8.8, { color: SK_GREY, font: 'Poppins' }));

  // 03 RNAguard
  s.push(t('03', 412, 236, 24, 10.5, { bold: 1, color: SK_BLUE, font: 'Poppins' }));
  s.push(t('RNAguard™', 438, 236, 284, 11, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('Ambient shipping of total RNA.', 438, 252, 284, 8.8, { color: SK_GREY, font: 'Poppins' }));

  // 04 ProteinGUARD
  s.push(t('04', 412, 276, 24, 10.5, { bold: 1, color: SK_BLUE, font: 'Poppins' }));
  s.push(t('ProteinGUARD™', 438, 276, 284, 11, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('Ambient shipping of protein.', 438, 292, 284, 8.8, { color: SK_GREY, font: 'Poppins' }));

  // Section: FAST AND READY TO USE
  s.push(t('FAST AND READY TO USE', 412, 322, 310, 9, { bold: 1, color: SK_BLUE, font: 'Poppins', sp: 60 }));
  s.push(r(412, 336, 310, 1, SK_RULE));

  // 05 ONEMag Universal DNA
  s.push(t('05', 412, 346, 24, 10.5, { bold: 1, color: SK_BLUE, font: 'Poppins' }));
  s.push(t('ONEMag™ Rapid Universal DNA', 438, 346, 284, 11, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('Under 30 minutes, from diverse sample types.', 438, 362, 284, 8.8, { color: SK_GREY, font: 'Poppins' }));

  // 06 2X Taq Plus
  s.push(t('06', 412, 390, 24, 10.5, { bold: 1, color: SK_BLUE, font: 'Poppins' }));
  s.push(t('2X Taq Plus PCR Master Mix', 438, 390, 284, 11, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('Ready-to-use, with RED dye for direct gel loading.', 438, 406, 284, 8.8, { color: SK_GREY, font: 'Poppins' }));

  // 07 ONENext 16S (V3-V4)
  s.push(t('07', 412, 434, 24, 10.5, { bold: 1, color: SK_BLUE, font: 'Poppins' }));
  s.push(t('ONENext™ 16S (V3–V4)', 438, 434, 284, 11, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('Library prep kit for Illumina.', 438, 450, 284, 8.8, { color: SK_GREY, font: 'Poppins' }));

  // 08 ONENext 16S (V1-V9)
  s.push(t('08', 412, 478, 24, 10.5, { bold: 1, color: SK_BLUE, font: 'Poppins' }));
  s.push(t('ONENext™ 16S (V1–V9)', 438, 478, 284, 11, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('Full-length library prep kit for ONT.', 438, 494, 284, 8.8, { color: SK_GREY, font: 'Poppins' }));

  // Callout card (Ice Blue)
  s.push(r(412, 532, 310, 68, SK_ICE, { r: 6 }));
  s.push(t('Less cold chain', 426, 542, 282, 13, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('Ambient shipping reduces dependence on dry ice and ice packs.', 426, 562, 282, 8.8, { color: SK_GREY, font: 'Poppins' }));

  // Footnote
  s.push(t('*Under validated storage conditions. Refer to the product datasheet.', 412, 614, 310, 8, { italic: 1, color: SK_MUTED, font: 'Poppins' }));
  s.push(...skFooter(378, 378));

  // ==========================================
  // PANEL C: KITS & REAGENTS (Right: 756..1123)
  // ==========================================
  s.push(r(756, 0, 367, 794, SK_WHITE));
  s.push(...skTitle(790, 34, 'Kits & Reagents', 'Cleaner\nsamples.'));

  // Section: STABILIZE AND PURIFY
  s.push(t('STABILIZE AND PURIFY', 790, 124, 300, 9, { bold: 1, color: SK_BLUE, font: 'Poppins', sp: 60 }));
  s.push(r(790, 138, 300, 1, SK_RULE));

  // 09 NucleoGUARD
  s.push(t('09', 790, 148, 24, 11, { bold: 1, color: SK_BLUE, font: 'Poppins' }));
  s.push(t('NucleoGUARD™', 816, 148, 274, 11, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('RNA stabilization buffer that helps minimize RNA degradation.', 816, 164, 274, 8.8, { color: SK_GREY, font: 'Poppins', lh: 1.25 }));

  // 10 SoilGUARD
  s.push(t('10', 790, 202, 24, 11, { bold: 1, color: SK_BLUE, font: 'Poppins' }));
  s.push(t('SoilGUARD™', 816, 202, 274, 11, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('Soil stabilization buffer that helps reduce soil-derived inhibitors.', 816, 218, 274, 8.8, { color: SK_GREY, font: 'Poppins', lh: 1.25 }));

  // 11 ONEMag Soil DNA
  s.push(t('11', 790, 256, 24, 11, { bold: 1, color: SK_BLUE, font: 'Poppins' }));
  s.push(t('ONEMag™ Rapid Soil DNA', 816, 256, 274, 11, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('Efficient removal of humic acids.', 816, 272, 274, 8.8, { color: SK_GREY, font: 'Poppins' }));

  // 12 ONEMag Plant DNA
  s.push(t('12', 790, 300, 24, 11, { bold: 1, color: SK_BLUE, font: 'Poppins' }));
  s.push(t('ONEMag™ Rapid Plant DNA', 816, 300, 274, 11, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('For polysaccharide- and polyphenol-rich tissue.', 816, 316, 274, 8.8, { color: SK_GREY, font: 'Poppins' }));

  // 13 ONEMag Soil RNA
  s.push(t('13', 790, 344, 24, 11, { bold: 1, color: SK_BLUE, font: 'Poppins' }));
  s.push(t('ONEMag™ Rapid Soil RNA', 816, 344, 274, 11, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('High-integrity RNA from soil samples.', 816, 360, 274, 8.8, { color: SK_GREY, font: 'Poppins' }));

  // Callout card 1 (Ice Blue)
  s.push(r(790, 420, 300, 68, SK_ICE, { r: 6 }));
  s.push(t('Solvent-free purification', 804, 430, 272, 13, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('Magnetic-bead chemistry avoids hazardous organic solvents.', 804, 450, 272, 8.8, { color: SK_GREY, font: 'Poppins' }));

  // Callout card 2 (Ice Blue)
  s.push(r(790, 508, 300, 78, SK_ICE, { r: 6 }));
  s.push(t('Not sure which kit?', 804, 518, 272, 13, { bold: 1, color: SK_NAVY, font: 'Poppins' }));
  s.push(t('Tell us your sample type and downstream application and our team will point you to the right product.', 804, 538, 272, 8.8, { color: SK_GREY, font: 'Poppins', lh: 1.3 }));

  s.push(...skFooter(756, 367));

  return s;
}

// --- Tri-fold 13: Ocean & Mint (Oneomics) ---
const OC_NAVY = '#0B4F6C';
const OC_MINT = '#1FA88A';
const OC_PALE = '#F2FAF8';
const OC_COV = '#E6F6F2';
const OC_TEXT = '#1F3A4D';
const OC_GREY = '#5A7686';
const OC_RULE = '#1FA88A';
const OC_WHITE = '#FFFFFF';

const ocHeader = (x, y, title, w = 310) => [
  t(title, x, y, w, 18, { bold: 1, color: OC_NAVY, font: 'Poppins' }),
  r(x, y + 28, w, 2, OC_MINT),
];

const ocCard = (x, y, w, h, title, subtitle, bg = OC_WHITE) => [
  r(x, y, w, h, bg, { r: 3 }),
  r(x, y, 3.5, h, OC_MINT, { r: 1.5 }),
  t(title, x + 10, y + 6, w - 16, 10, { bold: 1, color: OC_NAVY, font: 'Poppins' }),
  t(subtitle, x + 10, y + 24, w - 16, 8.5, { color: OC_GREY, font: 'Poppins', lh: 1.25 }),
];

const ocPill = (text, x, y, w = 68, h = 20) => [
  r(x, y, w, h, OC_WHITE, { stroke: OC_MINT, strokeWidth: 1, r: 10 }),
  t(text, x, y + 3.5, w, 8, { color: OC_NAVY, align: 'center', font: 'Poppins' }),
];

const ocBullet = (x, y, text, w = 300, isBold = false) => [
  r(x, y + 5, 4, 4, OC_MINT, { r: 2 }),
  t(text, x + 12, y, w - 12, 9.5, { color: isBold ? OC_NAVY : OC_TEXT, bold: isBold ? 1 : 0, font: 'Poppins' }),
];

const ocBottomBar = () => [
  r(0, 775, 1123, 19, OC_NAVY),
  r(0, 775, 560, 19, OC_MINT),
];

// Oneomics "Ocean & Mint" Tri-fold Brochure — Page 1 (Outside)
export function trifoldOcean() {
  const s = [];

  // ==========================================
  // PANEL 1: FLAP (Left, 0..367)
  // ==========================================
  s.push(r(0, 0, 367, 794, OC_PALE));
  s.push(...ocHeader(34, 34, 'Our Range of Products', 300));

  // 6 Cards
  s.push(...ocCard(34, 74, 300, 48, 'ONESpit™ – Saliva Collection & Preservation Kit', 'Zero-prep, non-invasive; DNA stable 1+ year at room temperature.'));
  s.push(...ocCard(34, 130, 300, 48, 'ONEasy™ – Faecal Collection & Preservation Kit', 'At-home collection; DNA/RNA stabilised, ambient transport up to 2 years*.'));
  s.push(...ocCard(34, 186, 300, 48, 'NucleoGUARD™ – RNA Stabilization Buffer', 'Minimises RNA degradation from the moment of collection.'));
  s.push(...ocCard(34, 242, 300, 48, 'RNAguard™ – Ambient Shipping of Total RNA', 'Protects against nucleases; reduces dry-ice cold chain.'));
  s.push(...ocCard(34, 298, 300, 48, 'ProteinGUARD™ – Ambient Shipping of Protein', 'Ship validated protein products with less cold-chain dependence.'));
  s.push(...ocCard(34, 354, 300, 48, 'SoilGUARD™ – Soil Stabilization Buffer', 'Reduces humic-substance inhibitors for cleaner nucleic-acid workflows.'));

  // Applications
  s.push(t('APPLICATIONS', 34, 420, 300, 8.5, { bold: 1, color: OC_MINT, font: 'Poppins', sp: 60 }));
  s.push(...ocPill('Diagnostics', 34, 440, 72, 22));
  s.push(...ocPill('Microbiome', 112, 440, 72, 22));
  s.push(...ocPill('RNA-Seq', 190, 440, 64, 22));
  s.push(...ocPill('PCR / qPCR', 260, 440, 74, 22));
  s.push(...ocPill('NGS', 34, 468, 48, 22));
  s.push(...ocPill('Field collection', 88, 468, 92, 22));

  s.push(t('*Per product validation.', 34, 745, 300, 8, { italic: 1, color: OC_GREY, font: 'Poppins' }));

  // ==========================================
  // PANEL 2: BACK COVER (Middle, 367..745)
  // ==========================================
  s.push(r(367, 0, 378, 794, OC_WHITE));
  s.push(...ocHeader(401, 34, 'About ONEOMICS', 310));
  s.push(t('ONEOMICS Private Limited provides end-to-end genomics solutions – from sample collection and nucleic-acid extraction to library preparation, sequencing and data analysis – for research, agriculture, environmental and clinical communities.', 401, 74, 310, 9.5, { color: OC_TEXT, font: 'Poppins', lh: 1.38 }));

  // Mission
  s.push(t('MISSION', 401, 160, 310, 8.5, { bold: 1, color: OC_MINT, font: 'Poppins', sp: 60 }));
  s.push(t('To make high-quality genomic science accessible, reliable and simple for every researcher.', 401, 178, 310, 9.5, { color: OC_TEXT, font: 'Poppins', lh: 1.35 }));

  // Vision
  s.push(t('VISION', 401, 230, 310, 8.5, { bold: 1, color: OC_MINT, font: 'Poppins', sp: 60 }));
  s.push(t('To be a trusted partner in omics-driven discovery, enabling innovation in health, food and the environment.', 401, 248, 310, 9.5, { color: OC_TEXT, font: 'Poppins', lh: 1.35 }));

  // Why ONEOMICS
  s.push(t('WHY ONEOMICS', 401, 304, 310, 8.5, { bold: 1, color: OC_MINT, font: 'Poppins', sp: 60 }));
  s.push(...ocBullet(401, 324, 'Services across Illumina, PacBio and Nanopore', 310));
  s.push(...ocBullet(401, 346, 'Ambient-stable collection & shipping products', 310));
  s.push(...ocBullet(401, 368, 'Rapid magnetic-bead extraction kits', 310));
  s.push(...ocBullet(401, 390, 'DNASTAR Lasergene software for analysis', 310));

  // Contact
  s.push(t('CONTACT', 401, 434, 310, 8.5, { bold: 1, color: OC_MINT, font: 'Poppins', sp: 60 }));
  s.push(t('[Address]  ·  [Phone]  ·  [Email]\n[Website]', 401, 452, 310, 9.5, { color: OC_TEXT, font: 'Poppins', lh: 1.4 }));

  // ==========================================
  // PANEL 3: FRONT COVER (Right, 745..1123)
  // ==========================================
  s.push(r(745, 0, 378, 794, OC_COV));
  s.push({ k: 'image', src: '/assets/oneomics_logo2.png', x: 779, y: 56, w: 220 });

  // Big decorative curves
  s.push(r(900, 260, 220, 220, '#1fa88a14', { r: 110 }));

  s.push(t('GENOMICS   ·   SERVICES   ·   PRODUCTS', 779, 180, 310, 8.5, { bold: 1, color: OC_MINT, font: 'Poppins', sp: 60 }));
  s.push(t('From Sample to\nInsight.', 779, 206, 320, 38, { bold: 1, color: OC_NAVY, font: 'Poppins', lh: 1.15 }));
  s.push(t('Next Generation Sequencing, sample-prep kits and analysis software – one partner for your omics workflow.', 779, 310, 310, 11.5, { color: OC_GREY, font: 'Poppins', lh: 1.45 }));

  // Cover Pills
  s.push(...ocPill('NGS', 779, 410, 48, 22));
  s.push(...ocPill('Extraction Kits', 833, 410, 98, 22));
  s.push(...ocPill('Stabilisation', 937, 410, 86, 22));
  s.push(...ocPill('Lasergene', 1029, 410, 76, 22));

  // Bottom bar
  s.push(...ocBottomBar());

  return s;
}

// Oneomics "Ocean & Mint" Tri-fold Brochure — Page 2 (Inside)
export function trifoldOceanInside() {
  const s = [];

  // ==========================================
  // PANEL A: NEXT GENERATION SEQUENCING (Left: 0..378)
  // ==========================================
  s.push(r(0, 0, 378, 794, OC_WHITE));
  s.push(...ocHeader(34, 34, 'Next Generation Sequencing', 310));

  // Whole Genome Sequencing
  s.push(t('WHOLE GENOME SEQUENCING', 34, 78, 310, 8.5, { bold: 1, color: OC_MINT, font: 'Poppins', sp: 60 }));
  s.push(...ocBullet(34, 96, 'De novo Sequencing', 310));
  s.push(...ocBullet(34, 116, 'Reference-Based Sequencing', 310));
  s.push(...ocBullet(34, 136, 'Hi-C Genome Sequencing', 310));
  s.push(...ocBullet(34, 156, 'Chloroplast Genome Sequencing', 310));
  s.push(...ocBullet(34, 176, 'Mitochondrial Genome Sequencing', 310));

  // Whole Exome Sequencing
  s.push(t('WHOLE EXOME SEQUENCING', 34, 208, 310, 8.5, { bold: 1, color: OC_MINT, font: 'Poppins', sp: 60 }));

  // Epigenetics
  s.push(t('EPIGENETICS', 34, 236, 310, 8.5, { bold: 1, color: OC_MINT, font: 'Poppins', sp: 60 }));
  s.push(...ocBullet(34, 254, 'Whole Genome Bisulfite Sequencing', 310));
  s.push(...ocBullet(34, 274, 'Whole Genome Methylation Sequencing', 310));

  // Genotyping By Sequencing
  s.push(t('GENOTYPING BY SEQUENCING', 34, 306, 310, 8.5, { bold: 1, color: OC_MINT, font: 'Poppins', sp: 60 }));

  // Metagenome Sequencing
  s.push(t('METAGENOME SEQUENCING', 34, 334, 310, 8.5, { bold: 1, color: OC_MINT, font: 'Poppins', sp: 60 }));
  s.push(...ocBullet(34, 352, '16S (V3-V4) Metagenome Sequencing', 310));
  s.push(...ocBullet(34, 372, '16S (V1-V9) rRNA Sequencing', 310));
  s.push(...ocBullet(34, 392, 'ITS Metagenome Sequencing', 310));
  s.push(...ocBullet(34, 412, '18S Metagenome Sequencing', 310));
  s.push(...ocBullet(34, 432, 'Shotgun Metagenome Sequencing', 310));
  s.push(...ocBullet(34, 452, 'Custom Amplicon Sequencing', 310));
  s.push(...ocBullet(34, 472, 'Meta-Barcoding', 310));

  // ==========================================
  // PANEL B: SERVICES (CONTINUED) (Middle: 378..756)
  // ==========================================
  s.push(r(378, 0, 378, 794, OC_PALE));
  s.push(...ocHeader(412, 34, 'Services (continued)', 310));

  // Transcriptome Sequencing
  s.push(t('TRANSCRIPTOME SEQUENCING', 412, 78, 310, 8.5, { bold: 1, color: OC_MINT, font: 'Poppins', sp: 60 }));
  s.push(...ocBullet(412, 96, 'Whole Transcriptome (mRNA + lncRNA)', 310));
  s.push(...ocBullet(412, 116, 'mRNA Sequencing', 310));
  s.push(...ocBullet(412, 136, 'Small RNA Sequencing', 310));
  s.push(...ocBullet(412, 156, 'Metatranscriptome Sequencing', 310));
  s.push(...ocBullet(412, 176, 'Dual RNA Sequencing', 310));
  s.push(...ocBullet(412, 196, 'Single Cell RNA Sequencing', 310));
  s.push(...ocBullet(412, 216, 'Isoform Sequencing (RNA)', 310));

  // Long Read Sequencing
  s.push(t('LONG READ SEQUENCING', 412, 248, 310, 8.5, { bold: 1, color: OC_MINT, font: 'Poppins', sp: 60 }));
  s.push(...ocBullet(412, 266, 'PacBio Sequencing', 310));
  s.push(...ocBullet(412, 286, 'Nanopore Sequencing', 310));

  // Validation & Assays
  s.push(t('VALIDATION & ASSAYS', 412, 318, 310, 8.5, { bold: 1, color: OC_MINT, font: 'Poppins', sp: 60 }));
  s.push(...ocBullet(412, 336, 'qRT-PCR Validation', 310));
  s.push(...ocBullet(412, 356, 'SSR Marker Validation', 310));
  s.push(...ocBullet(412, 376, 'Taurine and Telomere Assay', 310));
  s.push(...ocBullet(412, 396, 'ChIP-Sequencing', 310));

  // DNASTAR Lasergene
  s.push(t('DNASTAR LASERGENE', 412, 428, 310, 8.5, { bold: 1, color: OC_MINT, font: 'Poppins', sp: 60 }));
  s.push(...ocBullet(412, 446, 'Molecular Biology Module', 310));
  s.push(...ocBullet(412, 466, 'Genomics Module', 310));
  s.push(...ocBullet(412, 486, 'Proteomics Module', 310));

  // ==========================================
  // PANEL C: EXTRACTION & LIBRARY PREP (Right: 756..1123)
  // ==========================================
  s.push(r(756, 0, 367, 794, OC_WHITE));
  s.push(...ocHeader(790, 34, 'Extraction & Library Prep', 300));

  // 7 Cards
  s.push(...ocCard(790, 74, 300, 48, 'ONEMag™ Rapid Universal DNA Kit', 'Blood, tissue, saliva, faecal, swabs, microbes – DNA in under 30 min.', OC_PALE));
  s.push(...ocCard(790, 130, 300, 48, 'ONEMag™ Rapid Soil DNA Kit', 'Removes humic acids; ready for 16S, ITS & shotgun metagenomics.', OC_PALE));
  s.push(...ocCard(790, 186, 300, 48, 'ONEMag™ Rapid Plant DNA Kit', 'Clears polysaccharides & polyphenols for PCR, genotyping, NGS.', OC_PALE));
  s.push(...ocCard(790, 242, 300, 48, 'ONEMag™ Rapid Soil RNA Kit', 'High-integrity RNA for RT-qPCR, RNA-Seq, metatranscriptomics.', OC_PALE));
  s.push(...ocCard(790, 298, 300, 48, 'ONENext™ 16S (V3-V4) Library Prep – Illumina', 'Indexed, multiplexed libraries for paired-end sequencing.', OC_PALE));
  s.push(...ocCard(790, 354, 300, 48, 'ONENext™ 16S (V1-V9) Library Prep – ONT', 'Near full-length ~1.5 kb 16S for higher taxonomic resolution.', OC_PALE));
  s.push(...ocCard(790, 410, 300, 44, '2X Taq Plus PCR Master Mix (RED Dye)', 'Ready-to-use mix with direct gel loading.', OC_PALE));

  // Callout
  s.push(t('Request a quote or free consultation – [email / phone]', 790, 474, 300, 10, { bold: 1, color: OC_NAVY, font: 'Poppins' }));

  // Bottom bar
  s.push(...ocBottomBar());

  return s;
}

// =============================================================================
// TRI-FOLD 14: MIDNIGHT & TEAL (DARK GENOMICS)
// =============================================================================
const MN_DARK = '#1F2D3D';
const MN_ALT = '#263749';
const MN_CARD = '#2C4054';
const MN_TEAL = '#4FD1B5';
const MN_BLUE = '#7FB8FF';
const MN_WHITE = '#FFFFFF';
const MN_TEXT = '#DBE6EF';
const MN_MUTED = '#9FB4C6';
const MN_PILL_TXT = '#BFEEE3';

const mnHeader = (x, y, num, text, w) => {
  const res = [];
  if (num) {
    res.push(t(num, x, y, 32, 17, { bold: 1, italic: 1, color: MN_TEAL, font: 'Poppins' }));
    res.push(t(text, x + 30, y, w - 30, 17, { bold: 1, color: MN_WHITE, font: 'Poppins' }));
  } else {
    res.push(t(text, x, y, w, 17, { bold: 1, color: MN_WHITE, font: 'Poppins' }));
  }
  res.push(r(x, y + 26, w, 2, MN_TEAL));
  return res;
};

const mnCard = (x, y, w, h, title, desc, bg = MN_CARD) => [
  r(x, y, w, h, bg, { r: [0, 4, 4, 0] }),
  r(x, y, 3, h, MN_TEAL),
  t(title, x + 10, y + 6, w - 18, 9.5, { bold: 1, color: MN_WHITE, font: 'Poppins' }),
  t(desc, x + 10, y + 22, w - 18, 8, { color: MN_MUTED, font: 'Poppins', lh: 1.35 }),
];

const mnBullet = (x, y, text, w) => [
  r(x, y + 5, 5, 5, MN_TEAL, { r: 3 }),
  t(text, x + 14, y, w - 14, 9, { color: MN_TEXT, font: 'Poppins' }),
];

const mnPill = (label, x, y, w, h) => [
  r(x, y, w, h, 'transparent', { stroke: MN_TEAL, strokeWidth: 1.5, r: 12 }),
  t(label, x, y + 4, w, 8.5, { bold: 1, align: 'center', color: MN_PILL_TXT, font: 'Poppins' }),
];

const mnStep = (x, y, num, text) => [
  r(x, y, 22, 22, MN_TEAL, { r: 11 }),
  t(String(num), x, y + 4, 22, 10, { bold: 1, align: 'center', color: MN_DARK, font: 'Poppins' }),
  t(text, x + 30, y + 3, 280, 10, { color: MN_WHITE, font: 'Poppins' }),
];

const mnBottomBar = () => [
  r(0, 775, 562, 19, MN_TEAL),
  r(562, 775, 561, 19, MN_BLUE),
];

// Oneomics "Midnight & Teal" Tri-fold Brochure — Page 1 (Outside)
export function trifoldMidnight() {
  const s = [];

  // ==========================================
  // PANEL 1: FLAP (Left, 0..367)
  // ==========================================
  s.push(r(0, 0, 367, 794, MN_ALT));
  s.push(...mnHeader(34, 34, '01', 'Collect & Preserve', 300));

  // 6 Cards (on alt panel, card bg is MN_DARK #1F2D3D)
  s.push(...mnCard(34, 74, 300, 48, 'ONESpit™ Saliva Kit', 'Zero-prep self-collection; DNA stable 1+ year at room temperature. Patent-protected.', MN_DARK));
  s.push(...mnCard(34, 130, 300, 48, 'ONEasy™ Faecal Kit', 'At-home friendly; DNA/RNA stabilised, ambient transport up to 2 years*.', MN_DARK));
  s.push(...mnCard(34, 186, 300, 48, 'NucleoGUARD™ RNA Stabilization Buffer', 'Helps prevent RNA degradation in field and lab collection.', MN_DARK));
  s.push(...mnCard(34, 242, 300, 48, 'RNAguard™ Ambient Shipping of Total RNA', 'Nuclease and oxidation protection; no dry ice needed.', MN_DARK));
  s.push(...mnCard(34, 298, 300, 48, 'ProteinGUARD™ Ambient Shipping of Protein', 'For antibodies, standards and controls where validated.', MN_DARK));
  s.push(...mnCard(34, 354, 300, 48, 'SoilGUARD™ Soil Stabilization Buffer', 'Manages humic inhibitors before purification.', MN_DARK));

  s.push(t('*Per product validation.', 34, 745, 300, 8, { italic: 1, color: MN_MUTED, font: 'Poppins' }));

  // ==========================================
  // PANEL 2: BACK COVER (Middle, 367..745)
  // ==========================================
  s.push(r(367, 0, 378, 794, MN_DARK));
  s.push(...mnHeader(401, 34, '', 'Why ONEOMICS', 310));
  s.push(t('ONEOMICS Private Limited supports your complete omics workflow under one roof.', 401, 74, 310, 9.5, { color: MN_TEXT, font: 'Poppins', lh: 1.4 }));

  // Steps
  s.push(...mnStep(401, 126, 1, 'Collect & preserve'));
  s.push(...mnStep(401, 156, 2, 'Extract & prepare libraries'));
  s.push(...mnStep(401, 186, 3, 'Sequence'));
  s.push(...mnStep(401, 216, 4, 'Validate & analyse'));

  // Mission
  s.push(t('MISSION', 401, 260, 310, 8.5, { bold: 1, color: MN_BLUE, font: 'Poppins', sp: 60 }));
  s.push(t('To make high-quality genomic science accessible, reliable and simple for every researcher.', 401, 280, 310, 9.5, { color: MN_TEXT, font: 'Poppins', lh: 1.35 }));

  // Vision
  s.push(t('VISION', 401, 332, 310, 8.5, { bold: 1, color: MN_BLUE, font: 'Poppins', sp: 60 }));
  s.push(t('To be a trusted partner in omics-driven discovery for health, food and the environment.', 401, 352, 310, 9.5, { color: MN_TEXT, font: 'Poppins', lh: 1.35 }));

  // Get in touch
  s.push(t('GET IN TOUCH', 401, 410, 310, 8.5, { bold: 1, color: MN_BLUE, font: 'Poppins', sp: 60 }));
  s.push(t('[Address]\n[Phone] · [Email]\n[Website]', 401, 430, 310, 9.5, { color: MN_TEXT, font: 'Poppins', lh: 1.4 }));

  // ==========================================
  // PANEL 3: FRONT COVER (Right, 745..1123)
  // ==========================================
  s.push(r(745, 0, 378, 794, '#243447'));

  // White logo badge with ONEOMICS logo
  s.push(r(775, 44, 255, 90, MN_WHITE, { r: 10 }));
  s.push({ k: 'image', src: '/assets/oneomics_logo2.png', x: 790, y: 56, w: 225 });

  // Decorative large DNA curve in background
  s.push(r(950, 480, 180, 240, '#4fd1b510', { r: 90 }));
  s.push(r(920, 520, 140, 180, '#7fb8ff10', { r: 70 }));

  s.push(t('SEQUENCING   ·   KITS   ·   SOFTWARE', 779, 185, 310, 8.5, { bold: 1, color: MN_TEAL, font: 'Poppins', sp: 60 }));
  s.push(t('Your genome,', 779, 212, 320, 36, { bold: 1, color: MN_WHITE, font: 'Poppins' }));
  s.push(t('decoded.', 779, 252, 320, 36, { bold: 1, color: MN_TEAL, font: 'Poppins' }));
  s.push(t('From the first sample to the final analysis – sequencing services, sample-prep products and Lasergene software.', 779, 312, 310, 11, { color: MN_MUTED, font: 'Poppins', lh: 1.45 }));

  // Pills
  s.push(...mnPill('Illumina', 779, 412, 72, 24));
  s.push(...mnPill('PacBio', 857, 412, 68, 24));
  s.push(...mnPill('Nanopore', 931, 412, 80, 24));
  s.push(...mnPill('Lasergene', 1017, 412, 80, 24));

  // Bottom bar
  s.push(...mnBottomBar());

  return s;
}

// Oneomics "Midnight & Teal" Tri-fold Brochure — Page 2 (Inside)
export function trifoldMidnightInside() {
  const s = [];

  // ==========================================
  // PANEL A: EXTRACT & PREPARE (Left: 0..378)
  // ==========================================
  s.push(r(0, 0, 378, 794, MN_DARK));
  s.push(...mnHeader(34, 34, '02', 'Extract & Prepare', 310));

  // 7 Cards
  s.push(...mnCard(34, 74, 310, 48, 'ONEMag™ Universal DNA', 'Blood, tissue, saliva, faecal, swabs, microbes; under 30 min.'));
  s.push(...mnCard(34, 130, 310, 48, 'ONEMag™ Soil DNA', 'Removes humic acids; for 16S, ITS and shotgun work.'));
  s.push(...mnCard(34, 186, 310, 48, 'ONEMag™ Plant DNA', 'Clears polysaccharides and polyphenols.'));
  s.push(...mnCard(34, 242, 310, 48, 'ONEMag™ Soil RNA', 'For RT-qPCR, RNA-Seq and metatranscriptomics.'));
  s.push(...mnCard(34, 298, 310, 48, 'ONENext™ 16S V3-V4 – Illumina', 'Indexed, multiplexed amplicon libraries.'));
  s.push(...mnCard(34, 354, 310, 48, 'ONENext™ 16S V1-V9 – ONT', 'Near full-length ~1.5 kb for finer taxonomy.'));
  s.push(...mnCard(34, 410, 310, 44, '2X Taq Plus PCR Master Mix', 'With RED dye for direct gel loading.'));

  // ==========================================
  // PANEL B: SEQUENCE (Middle: 378..756)
  // ==========================================
  s.push(r(378, 0, 378, 794, MN_ALT));
  s.push(...mnHeader(412, 34, '03', 'Sequence', 310));

  // Whole Genome
  s.push(t('WHOLE GENOME', 412, 78, 310, 8.5, { bold: 1, color: MN_BLUE, font: 'Poppins', sp: 60 }));
  s.push(...mnBullet(412, 96, 'De novo · Reference-Based', 310));
  s.push(...mnBullet(412, 116, 'Hi-C · Chloroplast · Mitochondrial', 310));

  // Exome & Genotyping
  s.push(t('EXOME & GENOTYPING', 412, 146, 310, 8.5, { bold: 1, color: MN_BLUE, font: 'Poppins', sp: 60 }));
  s.push(...mnBullet(412, 164, 'Whole Exome Sequencing', 310));
  s.push(...mnBullet(412, 184, 'Genotyping By Sequencing', 310));

  // Epigenetics
  s.push(t('EPIGENETICS', 412, 214, 310, 8.5, { bold: 1, color: MN_BLUE, font: 'Poppins', sp: 60 }));
  s.push(...mnBullet(412, 232, 'Whole Genome Bisulfite', 310));
  s.push(...mnBullet(412, 252, 'Whole Genome Methylation', 310));

  // Metagenome
  s.push(t('METAGENOME', 412, 282, 310, 8.5, { bold: 1, color: MN_BLUE, font: 'Poppins', sp: 60 }));
  s.push(...mnBullet(412, 300, '16S V3-V4 · 16S V1-V9', 310));
  s.push(...mnBullet(412, 320, 'ITS · 18S', 310));
  s.push(...mnBullet(412, 340, 'Shotgun · Custom Amplicon', 310));
  s.push(...mnBullet(412, 360, 'Meta-Barcoding', 310));

  // Long Read
  s.push(t('LONG READ', 412, 390, 310, 8.5, { bold: 1, color: MN_BLUE, font: 'Poppins', sp: 60 }));
  s.push(...mnBullet(412, 408, 'PacBio · Nanopore', 310));

  // ==========================================
  // PANEL C: TRANSCRIBE & ANALYSE (Right: 756..1123)
  // ==========================================
  s.push(r(756, 0, 367, 794, MN_DARK));
  s.push(...mnHeader(790, 34, '04', 'Transcribe & Analyse', 300));

  // Transcriptome
  s.push(t('TRANSCRIPTOME', 790, 78, 300, 8.5, { bold: 1, color: MN_BLUE, font: 'Poppins', sp: 60 }));
  s.push(...mnBullet(790, 96, 'Whole Transcriptome (mRNA + lncRNA)', 300));
  s.push(...mnBullet(790, 116, 'mRNA · Small RNA', 300));
  s.push(...mnBullet(790, 136, 'Metatranscriptome · Dual RNA', 300));
  s.push(...mnBullet(790, 156, 'Single Cell RNA · Isoform (RNA)', 300));

  // Validation & Assays
  s.push(t('VALIDATION & ASSAYS', 790, 186, 300, 8.5, { bold: 1, color: MN_BLUE, font: 'Poppins', sp: 60 }));
  s.push(...mnBullet(790, 204, 'qRT-PCR Validation', 300));
  s.push(...mnBullet(790, 224, 'SSR Marker Validation', 300));
  s.push(...mnBullet(790, 244, 'Taurine and Telomere Assay', 300));
  s.push(...mnBullet(790, 264, 'ChIP-Sequencing', 300));

  // DNASTAR Lasergene
  s.push(t('DNASTAR LASERGENE', 790, 296, 300, 8.5, { bold: 1, color: MN_BLUE, font: 'Poppins', sp: 60 }));
  s.push(r(790, 314, 300, 28, MN_CARD, { r: [0, 4, 4, 0] }));
  s.push(r(790, 314, 3, 28, MN_TEAL));
  s.push(t('Molecular Biology Module', 802, 321, 280, 9.5, { bold: 1, color: MN_WHITE, font: 'Poppins' }));

  s.push(r(790, 348, 300, 28, MN_CARD, { r: [0, 4, 4, 0] }));
  s.push(r(790, 348, 3, 28, MN_TEAL));
  s.push(t('Genomics Module', 802, 355, 280, 9.5, { bold: 1, color: MN_WHITE, font: 'Poppins' }));

  s.push(r(790, 382, 300, 28, MN_CARD, { r: [0, 4, 4, 0] }));
  s.push(r(790, 382, 3, 28, MN_TEAL));
  s.push(t('Proteomics Module', 802, 389, 280, 9.5, { bold: 1, color: MN_WHITE, font: 'Poppins' }));

  // Callout
  s.push(t('Request a quote – [email / phone]', 790, 432, 300, 10, { bold: 1, color: MN_TEAL, font: 'Poppins' }));

  // Bottom bar
  s.push(...mnBottomBar());

  return s;
}

// =============================================================================
// TRI-FOLD 15: INDIGO & SUNSET CORAL
// =============================================================================
const SS_CREAM = '#fffaf2';
const SS_ALT = '#fff3e3';
const SS_INDIGO = '#2f3a8f';
const SS_CORAL = '#f26b4f';
const SS_AMBER = '#f2a83b';
const SS_TEXT = '#2b2f4a';
const SS_MUTED = '#6a6f8c';
const SS_SUBTITLE = '#c9cdf2';
const SS_CARD_BORDER = '#f0dcc0';
const SS_BLOB_PEACH = '#ffe2c2';
const SS_BLOB_PURPLE = '#e4e6fb';

const ssBanner = (panelX, panelW, contentX, contentW, title, subtitle) => [
  r(panelX, 0, panelW, 68, SS_INDIGO),
  r(panelX, 68, panelW, 3, SS_AMBER),
  t(title, contentX, 16, contentW, 14, { bold: 1, color: '#ffffff', font: 'Poppins' }),
  t(subtitle, contentX, 40, contentW, 8.5, { color: SS_SUBTITLE, font: 'Poppins' }),
];

const ssCard = (x, y, w, h, title, desc) => {
  const res = [
    r(x, y, w, h, '#ffffff', { stroke: SS_CARD_BORDER, strokeWidth: 1, r: 4 }),
    r(x, y, w, 3, SS_INDIGO, { r: [4, 4, 0, 0] }),
  ];
  if (desc) {
    res.push(t(title, x + 10, y + 8, w - 20, 10, { bold: 1, color: SS_INDIGO, font: 'Poppins' }));
    res.push(t(desc, x + 10, y + 24, w - 20, 8.5, { color: SS_MUTED, font: 'Poppins', lh: 1.35 }));
  } else {
    res.push(t(title, x + 10, y + 9, w - 20, 9.5, { bold: 1, color: SS_INDIGO, font: 'Poppins' }));
  }
  return res;
};

const ssBullet = (x, y, text, w) => [
  r(x + 2, y + 5, 5, 5, SS_AMBER, { r: 1 }),
  t(text, x + 14, y, w - 14, 9, { color: SS_TEXT, font: 'Poppins' }),
];

const ssPill = (label, x, y, w, h, isCoral) => [
  r(x, y, w, h, isCoral ? SS_CORAL : SS_INDIGO, { r: 12 }),
  t(label, x, y + 4, w, 8.5, { bold: 1, align: 'center', color: '#ffffff', font: 'Poppins' }),
];

const ssBottomBar = () => [
  r(0, 775, 374, 19, SS_INDIGO),
  r(374, 775, 374, 19, SS_CORAL),
  r(748, 775, 375, 19, SS_AMBER),
];

// Oneomics "Indigo & Sunset Coral" Tri-fold Brochure — Page 1 (Outside)
export function trifoldSunset() {
  const s = [];

  // ==========================================
  // PANEL 1: FLAP (Left, 0..367)
  // ==========================================
  s.push(r(0, 0, 367, 794, SS_ALT));
  s.push(...ssBanner(0, 367, 34, 300, 'Human & Clinical Genomics', 'Solutions for diagnostics and health research'));

  // 3 Cards
  s.push(...ssCard(34, 88, 300, 48, 'ONESpit™ Saliva Kit', 'Zero-prep, non-invasive self-collection. DNA stable 1+ year at room temperature.'));
  s.push(...ssCard(34, 144, 300, 48, 'ONEasy™ Faecal Kit', 'Home collection with DNA/RNA stabilisation.'));
  s.push(...ssCard(34, 200, 300, 48, 'ONEMag™ Universal DNA Kit', 'Blood, serum, tissue, saliva, urine, swabs. Under 30 min.'));

  // Sequencing & Assays
  s.push(t('SEQUENCING & ASSAYS', 34, 268, 300, 8.5, { bold: 1, color: SS_CORAL, font: 'Poppins', sp: 60 }));
  s.push(...ssBullet(34, 288, 'Whole Exome Sequencing', 300));
  s.push(...ssBullet(34, 308, 'Whole Genome Bisulfite & Methylation', 300));
  s.push(...ssBullet(34, 328, 'ChIP-Sequencing', 300));
  s.push(...ssBullet(34, 348, 'Single Cell RNA Sequencing', 300));
  s.push(...ssBullet(34, 368, 'Taurine and Telomere Assay', 300));
  s.push(...ssBullet(34, 388, 'qRT-PCR Validation', 300));

  // ==========================================
  // PANEL 2: BACK COVER (Middle, 367..745)
  // ==========================================
  s.push(r(367, 0, 378, 794, SS_CREAM));
  s.push(...ssBanner(367, 378, 401, 310, "Let's Talk", 'About ONEOMICS Private Limited'));
  s.push(t('We bring sample collection, nucleic-acid extraction, library preparation, sequencing and analysis software together, so your project moves from sample to result with one partner.', 401, 88, 310, 9.5, { color: SS_TEXT, font: 'Poppins', lh: 1.4 }));

  // Mission
  s.push(t('MISSION', 401, 162, 310, 8.5, { bold: 1, color: SS_CORAL, font: 'Poppins', sp: 60 }));
  s.push(t('To make high-quality genomic science accessible, reliable and simple for every researcher.', 401, 180, 310, 9.5, { color: SS_TEXT, font: 'Poppins', lh: 1.35 }));

  // Vision
  s.push(t('VISION', 401, 234, 310, 8.5, { bold: 1, color: SS_CORAL, font: 'Poppins', sp: 60 }));
  s.push(t('To be a trusted partner in omics-driven discovery for health, food and the environment.', 401, 252, 310, 9.5, { color: SS_TEXT, font: 'Poppins', lh: 1.35 }));

  // Contact
  s.push(t('CONTACT', 401, 306, 310, 8.5, { bold: 1, color: SS_CORAL, font: 'Poppins', sp: 60 }));
  s.push(t('[Address]\n[Phone]\n[Email]\n[Website]', 401, 324, 310, 9.5, { color: SS_TEXT, font: 'Poppins', lh: 1.4 }));

  s.push(t('Free consultation on your next project.', 401, 418, 310, 10, { bold: 1, color: SS_INDIGO, font: 'Poppins' }));

  // ==========================================
  // PANEL 3: FRONT COVER (Right, 745..1123)
  // ==========================================
  s.push(r(745, 0, 378, 794, SS_CREAM));

  // Decorative soft background blobs
  s.push(r(860, -50, 320, 320, SS_BLOB_PEACH, { r: 160 }));
  s.push(r(635, 470, 300, 300, SS_BLOB_PURPLE, { r: 150 }));

  // Logo
  s.push({ k: 'image', src: '/assets/oneomics_logo2.png', x: 779, y: 52, w: 245 });

  s.push(t('GENOMICS FOR EVERY FIELD', 779, 275, 310, 8.5, { bold: 1, color: SS_CORAL, font: 'Poppins', sp: 60 }));

  // Headline
  s.push(t('Answers', 779, 306, 126, 32, { bold: 1, color: SS_INDIGO, font: 'Poppins' }));
  s.push(t('written', 910, 306, 116, 32, { bold: 1, color: SS_CORAL, font: 'Poppins' }));
  s.push(t('in', 1030, 306, 45, 32, { bold: 1, color: SS_INDIGO, font: 'Poppins' }));
  s.push(t('DNA & RNA.', 779, 346, 320, 32, { bold: 1, color: SS_INDIGO, font: 'Poppins' }));

  s.push(t('Sequencing, sample-prep kits and Lasergene software for clinical, environmental and agricultural research.', 779, 405, 310, 11, { color: SS_MUTED, font: 'Poppins', lh: 1.45 }));

  // Pills
  s.push(...ssPill('Clinical', 779, 505, 68, 24, false));
  s.push(...ssPill('Microbiome', 853, 505, 86, 24, true));
  s.push(...ssPill('Agriculture', 945, 505, 84, 24, false));
  s.push(...ssPill('Software', 1035, 505, 72, 24, true));

  // Bottom bar
  s.push(...ssBottomBar());

  return s;
}

// Oneomics "Indigo & Sunset Coral" Tri-fold Brochure — Page 2 (Inside)
export function trifoldSunsetInside() {
  const s = [];

  // ==========================================
  // PANEL A: MICROBIOME & ENVIRONMENT (Left: 0..378)
  // ==========================================
  s.push(r(0, 0, 378, 794, SS_CREAM));
  s.push(...ssBanner(0, 378, 34, 310, 'Microbiome & Environment', 'Soil, gut, water and eDNA studies'));

  // Cards
  s.push(...ssCard(34, 88, 310, 34, 'SoilGUARD™', 'Soil Stabilization Buffer'));
  s.push(...ssCard(34, 130, 310, 48, 'ONEMag™ Soil DNA / Soil RNA', 'Humic-acid removal for sensitive downstream work.'));
  s.push(...ssCard(34, 186, 310, 48, 'ONENext™ 16S Library Prep', 'V3-V4 for Illumina; V1-V9 (~1.5 kb) for Nanopore.'));

  // Services
  s.push(t('SERVICES', 34, 254, 310, 8.5, { bold: 1, color: SS_CORAL, font: 'Poppins', sp: 60 }));
  s.push(...ssBullet(34, 274, '16S V3-V4 and V1-V9 Sequencing', 310));
  s.push(...ssBullet(34, 294, 'ITS and 18S Metagenome', 310));
  s.push(...ssBullet(34, 314, 'Shotgun Metagenome', 310));
  s.push(...ssBullet(34, 334, 'Metatranscriptome Sequencing', 310));
  s.push(...ssBullet(34, 354, 'Custom Amplicon · Meta-Barcoding', 310));

  // ==========================================
  // PANEL B: PLANT & AGRICULTURE (Middle: 378..756)
  // ==========================================
  s.push(r(378, 0, 378, 794, SS_ALT));
  s.push(...ssBanner(378, 378, 412, 310, 'Plant & Agriculture', 'Genomics for breeding and crop research'));

  // Cards
  s.push(...ssCard(412, 88, 310, 48, 'ONEMag™ Plant DNA Kit', 'Handles polysaccharide- and polyphenol-rich tissue.'));
  s.push(...ssCard(412, 144, 310, 48, '2X Taq Plus PCR Master Mix', 'RED dye; ready for genotyping and screening.'));

  // Services
  s.push(t('SERVICES', 412, 212, 310, 8.5, { bold: 1, color: SS_CORAL, font: 'Poppins', sp: 60 }));
  s.push(...ssBullet(412, 232, 'Whole Genome: De novo, Reference-Based, Hi-C', 310));
  s.push(...ssBullet(412, 252, 'Chloroplast · Mitochondrial Genome', 310));
  s.push(...ssBullet(412, 272, 'Genotyping By Sequencing', 310));
  s.push(...ssBullet(412, 292, 'SSR Marker Validation', 310));
  s.push(...ssBullet(412, 312, 'mRNA and Whole Transcriptome', 310));
  s.push(...ssBullet(412, 332, 'Small RNA · Isoform Sequencing', 310));
  s.push(...ssBullet(412, 352, 'Dual RNA (host-pathogen)', 310));

  // ==========================================
  // PANEL C: RNA, LONG READ & ANALYSIS (Right: 756..1123)
  // ==========================================
  s.push(r(756, 0, 367, 794, SS_CREAM));
  s.push(...ssBanner(756, 367, 790, 300, 'RNA, Long Read & Analysis', 'Ship it, sequence it, analyse it'));

  // Cards
  s.push(...ssCard(790, 88, 300, 34, 'NucleoGUARD™', 'RNA Stabilization Buffer'));
  s.push(...ssCard(790, 130, 300, 34, 'RNAguard™', 'Ambient shipping of total RNA'));
  s.push(...ssCard(790, 172, 300, 34, 'ProteinGUARD™', 'Ambient shipping of protein'));

  // Long Read Sequencing
  s.push(t('LONG READ SEQUENCING', 790, 224, 300, 8.5, { bold: 1, color: SS_CORAL, font: 'Poppins', sp: 60 }));
  s.push(...ssBullet(790, 244, 'PacBio Sequencing', 300));
  s.push(...ssBullet(790, 264, 'Nanopore Sequencing', 300));

  // DNASTAR Lasergene
  s.push(t('DNASTAR LASERGENE', 790, 298, 300, 8.5, { bold: 1, color: SS_CORAL, font: 'Poppins', sp: 60 }));
  s.push(...ssBullet(790, 318, 'Molecular Biology Module', 300));
  s.push(...ssBullet(790, 338, 'Genomics Module', 300));
  s.push(...ssBullet(790, 358, 'Proteomics Module', 300));

  // Callout
  s.push(t('Request a quote: [email / phone]', 790, 400, 300, 10, { bold: 1, color: SS_CORAL, font: 'Poppins' }));

  // Bottom bar
  s.push(...ssBottomBar());

  return s;
}

// =============================================================================
// TRI-FOLD 16: VIOLET & CYAN WORKFLOW
// =============================================================================
const VT_VIOLET = '#5a3fc0';
const VT_CYAN   = '#00a6c8';
const VT_ALT    = '#f1f7fd';
const VT_WHITE  = '#ffffff';
const VT_TEXT   = '#26304a';
const VT_MUTED  = '#7a86a3';
const VT_LABEL  = '#4a5575';
const VT_LINE   = '#c9d6ea';
const VT_BORDER = '#d5def0';
const VT_RING1  = '#e1d9fa';
const VT_RING2  = '#d4f1f8';

const vtTopBar = () => [
  r(0, 0, 562, 11, VT_VIOLET),
  r(562, 0, 561, 11, VT_CYAN),
];

const vtHeader = (x, y, title, subtitle, w) => [
  t(title, x, y, w, 17, { bold: 1, color: VT_VIOLET, font: 'Poppins' }),
  t(subtitle, x, y + 26, w, 8.5, { color: VT_MUTED, font: 'Poppins' }),
  r(x, y + 46, w, 1, VT_LINE),
];

const vtStat = (x, y, num, unit, label, w) => {
  const res = [];
  res.push(t(num, x, y, 65, 22, { bold: 1, color: VT_VIOLET, font: 'Poppins' }));
  if (unit) {
    res.push(t(unit, x + 58, y + 7, 50, 10, { bold: 1, color: VT_CYAN, font: 'Poppins' }));
  }
  res.push(t(label, x + 115, y + 2, w - 115, 8.5, { color: VT_LABEL, font: 'Poppins', lh: 1.35 }));
  return res;
};

const vtFlow = (x, y, tag1, text1, tag2, text2) => [
  r(x, y, 138, 44, VT_WHITE, { stroke: VT_BORDER, strokeWidth: 1, r: 4 }),
  t(tag1.toUpperCase(), x + 8, y + 5, 122, 7.5, { bold: 1, color: VT_VIOLET, font: 'Poppins', sp: 40 }),
  t(text1, x + 8, y + 20, 122, 8.5, { color: VT_TEXT, font: 'Poppins' }),
  t('→', x + 142, y + 12, 22, 14, { bold: 1, align: 'center', color: VT_CYAN, font: 'Poppins' }),
  r(x + 168, y, 138, 44, VT_WHITE, { stroke: VT_BORDER, strokeWidth: 1, r: 4 }),
  t(tag2.toUpperCase(), x + 176, y + 5, 122, 7.5, { bold: 1, color: VT_VIOLET, font: 'Poppins', sp: 40 }),
  t(text2, x + 176, y + 20, 122, 8.5, { color: VT_TEXT, font: 'Poppins' }),
];

const vtBullet = (x, y, text, w) => [
  t('›', x, y - 2, 12, 13, { bold: 1, color: VT_VIOLET, font: 'Poppins' }),
  t(text, x + 12, y, w - 12, 9, { color: VT_TEXT, font: 'Poppins' }),
];

const vtPill = (label, x, y, w, h) => [
  r(x, y, w, h, VT_WHITE, { stroke: VT_VIOLET, strokeWidth: 1.5, r: 12 }),
  t(label, x, y + 4, w, 8.5, { bold: 1, align: 'center', color: VT_VIOLET, font: 'Poppins' }),
];

// Oneomics "Violet & Cyan Workflow" Tri-fold Brochure — Page 1 (Outside)
export function trifoldViolet() {
  const s = [];

  // ==========================================
  // PANEL 1: FLAP (Left, 0..367)
  // ==========================================
  s.push(r(0, 0, 367, 794, VT_ALT));
  s.push(...vtHeader(34, 42, 'At a Glance', 'What our products deliver', 300));

  // 5 Stats
  s.push(...vtStat(34, 108, '<30', 'min', 'ONEMag™ DNA extraction from blood, tissue, saliva, swabs and more', 300));
  s.push(...vtStat(34, 168, '1+', 'year', 'ONESpit™ saliva DNA stability at room temperature', 300));
  s.push(...vtStat(34, 228, '2', 'years', 'ONEasy™ faecal sample transport and storage at room temperature*', 300));
  s.push(...vtStat(34, 288, '~1.5', 'kb', 'Near full-length 16S (V1-V9) on Nanopore', 300));
  s.push(...vtStat(34, 348, '0', '', 'Hazardous organic solvents in ONEMag™ purification', 300));

  // Platforms
  s.push(t('PLATFORMS', 34, 404, 300, 8.5, { bold: 1, color: VT_CYAN, font: 'Poppins', sp: 60 }));
  s.push(...vtPill('Illumina', 34, 424, 66, 24));
  s.push(...vtPill('PacBio', 106, 424, 62, 24));
  s.push(...vtPill('Nanopore', 174, 424, 76, 24));

  s.push(t('*Per product validation.', 34, 745, 300, 8, { italic: 1, color: VT_MUTED, font: 'Poppins' }));

  // ==========================================
  // PANEL 2: BACK COVER (Middle, 367..745)
  // ==========================================
  s.push(r(367, 0, 378, 794, VT_WHITE));
  s.push(...vtHeader(401, 42, 'About ONEOMICS', 'ONEOMICS Private Limited', 310));
  s.push(t('From the first swab to the final figure, we cover sequencing services, sample-prep products and analysis software for researchers and clinicians.', 401, 108, 310, 9.5, { color: VT_TEXT, font: 'Poppins', lh: 1.4 }));

  // Mission
  s.push(t('MISSION', 401, 180, 310, 8.5, { bold: 1, color: VT_CYAN, font: 'Poppins', sp: 60 }));
  s.push(t('To make high-quality genomic science accessible, reliable and simple for every researcher.', 401, 198, 310, 9.5, { color: VT_TEXT, font: 'Poppins', lh: 1.35 }));

  // Vision
  s.push(t('VISION', 401, 252, 310, 8.5, { bold: 1, color: VT_CYAN, font: 'Poppins', sp: 60 }));
  s.push(t('To be a trusted partner in omics-driven discovery for health, food and the environment.', 401, 270, 310, 9.5, { color: VT_TEXT, font: 'Poppins', lh: 1.35 }));

  // Contact
  s.push(t('CONTACT US', 401, 324, 310, 8.5, { bold: 1, color: VT_CYAN, font: 'Poppins', sp: 60 }));
  s.push(t('[Address]\n[Phone]\n[Email]\n[Website]', 401, 342, 310, 9.5, { color: VT_TEXT, font: 'Poppins', lh: 1.4 }));

  s.push(t("Tell us your sample. We'll map your workflow.", 401, 436, 310, 10, { bold: 1, color: VT_VIOLET, font: 'Poppins' }));

  // ==========================================
  // PANEL 3: FRONT COVER (Right, 745..1123)
  // ==========================================
  s.push(r(745, 0, 378, 794, VT_WHITE));

  // Big decorative rings in background
  s.push(r(910, 520, 260, 260, 'transparent', { stroke: VT_RING1, strokeWidth: 18, r: 130 }));
  s.push(r(655, 435, 205, 205, 'transparent', { stroke: VT_RING2, strokeWidth: 18, r: 103 }));

  // Logo
  s.push({ k: 'image', src: '/assets/oneomics_logo2.png', x: 779, y: 52, w: 245 });

  s.push(t("WHAT'S YOUR SAMPLE?", 779, 270, 310, 8.5, { bold: 1, color: VT_CYAN, font: 'Poppins', sp: 60 }));

  // Headline
  s.push(t('Start with the', 779, 302, 320, 32, { bold: 1, color: VT_VIOLET, font: 'Poppins' }));
  s.push(t('sample.', 779, 338, 120, 32, { bold: 1, color: VT_VIOLET, font: 'Poppins' }));
  s.push(t("We'll do", 905, 338, 160, 32, { bold: 1, color: VT_CYAN, font: 'Poppins' }));
  s.push(t('the rest.', 779, 374, 320, 32, { bold: 1, color: VT_CYAN, font: 'Poppins' }));

  s.push(t('Find the right collection kit, extraction, sequencing and software for human, microbial, soil and plant work.', 779, 436, 310, 11, { color: VT_MUTED, font: 'Poppins', lh: 1.45 }));

  // Pills
  s.push(...vtPill('Human', 779, 536, 56, 24));
  s.push(...vtPill('Microbial', 841, 536, 68, 24));
  s.push(...vtPill('Soil', 915, 536, 44, 24));
  s.push(...vtPill('Plant', 965, 536, 48, 24));

  // Top bar
  s.push(...vtTopBar());

  return s;
}

// Oneomics "Violet & Cyan Workflow" Tri-fold Brochure — Page 2 (Inside)
export function trifoldVioletInside() {
  const s = [];

  // ==========================================
  // PANEL A: I HAVE HUMAN SAMPLES (Left: 0..378)
  // ==========================================
  s.push(r(0, 0, 378, 794, VT_WHITE));
  s.push(...vtHeader(34, 42, 'I have human samples', 'Saliva, faecal, blood, tissue, swabs', 310));

  // 2 Workflow Flows
  s.push(...vtFlow(34, 108, 'Collect', 'ONESpit™ Saliva Kit', 'Extract', 'ONEMag™ Universal DNA'));
  s.push(...vtFlow(34, 166, 'Collect', 'ONEasy™ Faecal Kit', 'Prepare', '2X Taq Plus Master Mix'));

  // Then sequence
  s.push(t('THEN SEQUENCE', 34, 236, 310, 8.5, { bold: 1, color: VT_CYAN, font: 'Poppins', sp: 60 }));
  s.push(...vtBullet(34, 256, 'Whole Exome Sequencing', 310));
  s.push(...vtBullet(34, 276, 'Whole Genome Bisulfite and Methylation', 310));
  s.push(...vtBullet(34, 296, 'ChIP-Sequencing', 310));
  s.push(...vtBullet(34, 316, 'Single Cell RNA Sequencing', 310));

  // And validate
  s.push(t('AND VALIDATE', 34, 348, 310, 8.5, { bold: 1, color: VT_CYAN, font: 'Poppins', sp: 60 }));
  s.push(...vtBullet(34, 368, 'qRT-PCR Validation', 310));
  s.push(...vtBullet(34, 388, 'Taurine and Telomere Assay', 310));

  // ==========================================
  // PANEL B: I HAVE SOIL OR MICROBES (Middle: 378..756)
  // ==========================================
  s.push(r(378, 0, 378, 794, VT_ALT));
  s.push(...vtHeader(412, 42, 'I have soil or microbes', 'Soil, rhizosphere, gut, environmental', 310));

  // 2 Workflow Flows
  s.push(...vtFlow(412, 108, 'Stabilise', 'SoilGUARD™ Buffer', 'Extract', 'ONEMag™ Soil DNA / RNA'));
  s.push(...vtFlow(412, 166, 'Library', 'ONENext™ 16S V3-V4 (Illumina)', 'Library', 'ONENext™ 16S V1-V9 (ONT)'));

  // Then sequence
  s.push(t('THEN SEQUENCE', 412, 236, 310, 8.5, { bold: 1, color: VT_CYAN, font: 'Poppins', sp: 60 }));
  s.push(...vtBullet(412, 256, '16S V3-V4 and V1-V9', 310));
  s.push(...vtBullet(412, 276, 'ITS and 18S Metagenome', 310));
  s.push(...vtBullet(412, 296, 'Shotgun Metagenome', 310));
  s.push(...vtBullet(412, 316, 'Metatranscriptome', 310));
  s.push(...vtBullet(412, 336, 'Custom Amplicon · Meta-Barcoding', 310));

  // ==========================================
  // PANEL C: PLANTS, RNA & ANALYSIS (Right: 756..1123)
  // ==========================================
  s.push(r(756, 0, 367, 794, VT_WHITE));
  s.push(...vtHeader(790, 42, 'Plants, RNA & analysis', 'Crops, transcripts, proteins and software', 300));

  // 1 Workflow Flow
  s.push(...vtFlow(790, 108, 'Extract', 'ONEMag™ Plant DNA Kit', 'Sequence', 'Genome, GBS, SSR'));

  // Plant genomics
  s.push(t('PLANT GENOMICS', 790, 172, 300, 8.5, { bold: 1, color: VT_CYAN, font: 'Poppins', sp: 60 }));
  s.push(...vtBullet(790, 190, 'De novo · Reference-Based · Hi-C', 300));
  s.push(...vtBullet(790, 208, 'Chloroplast · Mitochondrial', 300));
  s.push(...vtBullet(790, 226, 'Genotyping By Sequencing', 300));
  s.push(...vtBullet(790, 244, 'SSR Marker Validation', 300));

  // RNA & protein shipping
  s.push(t('RNA & PROTEIN SHIPPING', 790, 272, 300, 8.5, { bold: 1, color: VT_CYAN, font: 'Poppins', sp: 60 }));
  s.push(...vtBullet(790, 290, 'NucleoGUARD™ RNA Stabilization', 300));
  s.push(...vtBullet(790, 308, 'RNAguard™ ambient total RNA', 300));
  s.push(...vtBullet(790, 326, 'ProteinGUARD™ ambient protein', 300));

  // RNA & long read
  s.push(t('RNA & LONG READ', 790, 354, 300, 8.5, { bold: 1, color: VT_CYAN, font: 'Poppins', sp: 60 }));
  s.push(...vtBullet(790, 372, 'mRNA · Whole Transcriptome · Small RNA', 300));
  s.push(...vtBullet(790, 390, 'Dual RNA · Isoform Sequencing', 300));
  s.push(...vtBullet(790, 408, 'PacBio · Nanopore', 300));

  // Analyse with DNASTAR Lasergene
  s.push(t('ANALYSE WITH DNASTAR LASERGENE', 790, 436, 300, 8.5, { bold: 1, color: VT_CYAN, font: 'Poppins', sp: 60 }));
  s.push(...vtBullet(790, 454, 'Molecular Biology · Genomics · Proteomics', 300));

  // Top bar
  s.push(...vtTopBar());

  return s;
}

export const TEMPLATES = [
  {
    id: 'trifold',
    name: 'Tri-fold: Decoding Life',
    subtitle: 'Precision Genomics & Products',
    category: 'trifold',
    w: 1123,
    h: 794,
    folds: 3,
    bg: '#ffffff',
    preview: '/assets/previews/trifold_original.png',
    specs: trifold,
    pages: [trifold, trifoldBack],
    swatch: [TEAL, '#ffffff', ACC],
  },
  {
    id: 'trifold-insight',
    name: 'Tri-fold: Sample to Insight',
    subtitle: 'Genomics · Products · Software',
    category: 'trifold',
    w: 1123,
    h: 794,
    folds: 3,
    bg: '#ffffff',
    preview: '/assets/previews/trifold_insight.png',
    previewInside: '/assets/previews/trifold_insight_inside.png',
    specs: trifoldInsight,
    pages: [trifoldInsight, trifoldInsightInside],
    swatch: ['#10243E', '#0793EB', '#33A015'],
  },
  {
    id: 'trifold-story',
    name: 'Tri-fold: Tells a Story',
    subtitle: 'Editorial · Warm Cream · Products',
    category: 'trifold',
    w: 1123,
    h: 794,
    folds: 3,
    bg: '#FBF7EF',
    preview: '/assets/previews/trifold_story.png',
    previewInside: '/assets/previews/trifold_story_inside.png',
    specs: trifoldStory,
    pages: [trifoldStory, trifoldStoryInside],
    swatch: ['#FBF7EF', '#E2574C', '#0B3C49'],
  },
  {
    id: 'trifold-hex',
    name: 'Tri-fold: Hexagon Modern',
    subtitle: 'Modern Sage · Hexagons · Solutions',
    category: 'trifold',
    w: 1123,
    h: 794,
    folds: 3,
    bg: '#ffffff',
    preview: '/assets/previews/trifold_hex.png',
    previewInside: '/assets/previews/trifold_hex_inside.png',
    specs: trifoldHex,
    pages: [trifoldHex, trifoldHexInside],
    swatch: ['#17694A', '#EAF5EE', '#E23B32'],
  },
  {
    id: 'trifold-chroma',
    name: 'Tri-fold: Reading Life',
    subtitle: 'Lavender Tint · Chromatogram Peaks · Indigo',
    category: 'trifold',
    w: 1123,
    h: 794,
    folds: 3,
    bg: '#F6F5FC',
    preview: '/assets/previews/trifold_chroma.png',
    previewInside: '/assets/previews/trifold_chroma_inside.png',
    specs: trifoldChroma,
    pages: [trifoldChroma, trifoldChromaInside],
    swatch: ['#F6F5FC', '#4448B8', '#0793EB'],
  },
  {
    id: 'trifold-apricot',
    name: 'Tri-fold: End to End',
    subtitle: 'Warm Apricot · Constellation · Swiss Modern',
    category: 'trifold',
    w: 1123,
    h: 794,
    folds: 3,
    bg: '#FFFFFF',
    preview: '/assets/previews/trifold_apricot.png',
    previewInside: '/assets/previews/trifold_apricot_inside.png',
    specs: trifoldApricot,
    pages: [trifoldApricot, trifoldApricotInside],
    swatch: ['#FFF0E5', '#FF7A45', '#14202B'],
  },
  {
    id: 'trifold-teal',
    name: 'Tri-fold: Teal Modern',
    subtitle: 'Pine Navy · Emerald Teal · Soft Mint',
    category: 'trifold',
    w: 1123,
    h: 794,
    folds: 3,
    bg: '#FFFFFF',
    preview: '/assets/previews/trifold_teal.png',
    previewInside: '/assets/previews/trifold_teal_inside.png',
    specs: trifoldTeal,
    pages: [trifoldTeal, trifoldTealInside],
    swatch: ['#123A44', '#0E9F8E', '#E6F5F2'],
  },
  {
    id: 'trifold-rose',
    name: 'Tri-fold: Rose & Mulberry',
    subtitle: 'Deep Mulberry · Rose Magenta · Soft Blush',
    category: 'trifold',
    w: 1123,
    h: 794,
    folds: 3,
    bg: '#FFFFFF',
    preview: '/assets/previews/trifold_rose.png',
    previewInside: '/assets/previews/trifold_rose_inside.png',
    specs: trifoldRose,
    pages: [trifoldRose, trifoldRoseInside],
    swatch: ['#3B1F33', '#D6457A', '#FCECF2'],
  },
  {
    id: 'trifold-olive',
    name: 'Tri-fold: Forest & Olive',
    subtitle: 'Deep Forest · Olive Accent · Pale Sage',
    category: 'trifold',
    w: 1123,
    h: 794,
    folds: 3,
    bg: '#FFFFFF',
    preview: '/assets/previews/trifold_olive.png',
    previewInside: '/assets/previews/trifold_olive_inside.png',
    specs: trifoldOlive,
    pages: [trifoldOlive, trifoldOliveInside],
    swatch: ['#23352A', '#5F9A4A', '#EDF5E8'],
  },
  {
    id: 'trifold-lavender',
    name: 'Tri-fold: Lavender & Violet',
    subtitle: 'Deep Indigo · Royal Violet · Soft Lavender',
    category: 'trifold',
    w: 1123,
    h: 794,
    folds: 3,
    bg: '#FFFFFF',
    preview: '/assets/previews/trifold_lavender.png',
    previewInside: '/assets/previews/trifold_lavender_inside.png',
    specs: trifoldLavender,
    pages: [trifoldLavender, trifoldLavenderInside],
    swatch: ['#2E2352', '#7B5CD6', '#F0ECFB'],
  },
  {
    id: 'trifold-amber',
    name: 'Tri-fold: Amber & Gold',
    subtitle: 'Oxford Navy · Warm Amber · Warm Cream',
    category: 'trifold',
    w: 1123,
    h: 794,
    folds: 3,
    bg: '#FFFFFF',
    preview: '/assets/previews/trifold_amber.png',
    previewInside: '/assets/previews/trifold_amber_inside.png',
    specs: trifoldAmber,
    pages: [trifoldAmber, trifoldAmberInside],
    swatch: ['#14213D', '#D68A00', '#FFF5DC'],
  },
  {
    id: 'trifold-sky',
    name: 'Tri-fold: Cerulean & Sky',
    subtitle: 'Oceanic Navy · Sky Blue · Soft Ice',
    category: 'trifold',
    w: 1123,
    h: 794,
    folds: 3,
    bg: '#FFFFFF',
    preview: '/assets/previews/trifold_sky.png',
    previewInside: '/assets/previews/trifold_sky_inside.png',
    specs: trifoldSky,
    pages: [trifoldSky, trifoldSkyInside],
    swatch: ['#0B3C5D', '#1E9BD7', '#E8F4FB'],
  },
  {
    id: 'trifold-ocean',
    name: 'Tri-fold: Ocean & Mint',
    subtitle: 'Deep Teal · Emerald Mint · Clean Editorial',
    category: 'trifold',
    w: 1123,
    h: 794,
    folds: 3,
    bg: '#FFFFFF',
    preview: '/assets/previews/trifold_ocean.png',
    previewInside: '/assets/previews/trifold_ocean_inside.png',
    specs: trifoldOcean,
    pages: [trifoldOcean, trifoldOceanInside],
    swatch: ['#0B4F6C', '#1FA88A', '#F2FAF8'],
  },
  {
    id: 'trifold-midnight',
    name: 'Tri-fold: Midnight & Teal',
    subtitle: 'Dark Slate · Cyber Teal · Sky Blue Accent',
    category: 'trifold',
    w: 1123,
    h: 794,
    folds: 3,
    bg: '#1F2D3D',
    preview: '/assets/previews/trifold_midnight.png',
    previewInside: '/assets/previews/trifold_midnight_inside.png',
    specs: trifoldMidnight,
    pages: [trifoldMidnight, trifoldMidnightInside],
    swatch: ['#1F2D3D', '#4FD1B5', '#7FB8FF'],
  },
  {
    id: 'trifold-sunset',
    name: 'Tri-fold: Indigo & Sunset Coral',
    subtitle: 'Royal Indigo · Sunset Coral · Warm Amber',
    category: 'trifold',
    w: 1123,
    h: 794,
    folds: 3,
    bg: '#fffaf2',
    preview: '/assets/previews/trifold_sunset.png',
    previewInside: '/assets/previews/trifold_sunset_inside.png',
    specs: trifoldSunset,
    pages: [trifoldSunset, trifoldSunsetInside],
    swatch: ['#2F3A8F', '#F26B4F', '#F2A83B'],
  },
  {
    id: 'trifold-violet',
    name: 'Tri-fold: Violet & Cyan Workflow',
    subtitle: 'Electric Violet · Bright Cyan · Modern Workflow',
    category: 'trifold',
    w: 1123,
    h: 794,
    folds: 3,
    bg: '#ffffff',
    preview: '/assets/previews/trifold_violet.png',
    previewInside: '/assets/previews/trifold_violet_inside.png',
    specs: trifoldViolet,
    pages: [trifoldViolet, trifoldVioletInside],
    swatch: ['#5A3FC0', '#00A6C8', '#F1F7FD'],
  },
  {
    id: 'onespit-flyer',
    name: 'ONESpit™ Product Flyer',
    subtitle: 'Zero-Prep Saliva Collection & Preservation Kit',
    category: 'a4-flyer',
    w: 794,
    h: 1123,
    folds: 0,
    bg: '#ffffff',
    preview: '/assets/previews/onespit_flyer.png',
    specs: onespitFlyer,
    pages: [onespitFlyer],
    swatch: [CLR_RED, CLR_BLUE, CLR_GREEN],
  },
  {
    id: 'onespit-teal-flyer',
    name: 'ONESpit™ Modern Teal Flyer',
    subtitle: 'Zero-Prep Saliva Collection & Preservation',
    category: 'a4-flyer',
    w: 794,
    h: 1123,
    folds: 0,
    bg: '#ffffff',
    preview: '/assets/previews/onespit_teal_flyer.png',
    specs: onespitTealFlyer,
    pages: [onespitTealFlyer],
    swatch: ['#0b4f55', '#12857f', '#ffc857'],
  },
  {
    id: 'onam',
    name: 'Onam Festival Poster',
    subtitle: 'Festive Greeting & Branding',
    category: 'poster',
    w: 800,
    h: 1050,
    folds: 0,
    bg: '#f6f1e7',
    preview: '/assets/previews/onam.png',
    specs: onam,
    swatch: ['#8b0a32', '#0b5d4b', '#c8a84b'],
  },
  {
    id: 'poster',
    name: 'Event Poster',
    subtitle: 'Science Showcase',
    category: 'poster',
    w: 794,
    h: 1123,
    folds: 0,
    bg: TEAL,
    preview: '/assets/previews/poster.png',
    specs: poster,
    swatch: [TEAL, ACC, '#ffffff'],
  },
  {
    id: 'quote',
    name: 'Quote Post',
    subtitle: 'Social / Minimal Quote',
    category: 'social',
    w: 1080,
    h: 1080,
    folds: 0,
    bg: '#e3f4ee',
    preview: '/assets/previews/quote.png',
    specs: quote,
    swatch: ['#e3f4ee', '#ffffff', TEAL],
  },
];
