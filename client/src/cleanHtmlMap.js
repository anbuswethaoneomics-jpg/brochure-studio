/**
 * Maps any brochure or flyer template/design to its pixel-perfect clean HTML print view
 */
export function getCleanHtmlUrl(design) {
  if (!design) return '/brochure-insight.html';
  const tid = String(design.templateId || design.id || '').toLowerCase();
  const name = String(design.name || '').toLowerCase();

  // 1. Bi-Fold Brochures (7 templates)
  if (tid.includes('epigenomics') || name.includes('epigenomics')) {
    return '/bifold-epigenomics-brochure.html';
  }
  if (tid.includes('microbiome') || name.includes('microbiome')) {
    return '/bifold-microbiome-brochure.html';
  }
  if (tid.includes('rnaseq') || tid.includes('rna-seq') || (tid.includes('bifold') && name.includes('rna'))) {
    return '/bifold-rnaseq-brochure.html';
  }
  if (tid.includes('metagenome') || (tid.includes('bifold') && name.includes('metagenome'))) {
    return '/bifold-metagenome-brochure.html';
  }
  if (tid.includes('longread') || tid.includes('long-read') || (tid.includes('bifold') && name.includes('long-read'))) {
    return '/bifold-longread-brochure.html';
  }
  if (tid.includes('genotyping') || (tid.includes('bifold') && name.includes('genotyping'))) {
    return '/bifold-genotyping-brochure.html';
  }
  if (tid.includes('bifold') || name.includes('bi-fold')) {
    return '/bifold-brochure.html';
  }

  // 2. ONESpit Product Flyers
  if (tid === 'onespit-teal-flyer' || name.includes('teal')) {
    return '/onespit-flyer.html?color=%23005b76&title=ONESpit%E2%84%A2+Modern+Teal+Flyer';
  }
  if (tid === 'onespit-sunset-flyer' || name.includes('sunset')) {
    return '/onespit-flyer.html?color=%23ff6a35&title=ONESpit%E2%84%A2+Sunset+Edition+Flyer';
  }
  if (tid.includes('onespit') || name.includes('onespit')) {
    return '/onespit-flyer.html';
  }

  // 3. Other Product One-Pagers (filter by product slug)
  if (tid.includes('oneasy') || name.includes('oneasy')) {
    return '/product-one-pagers.html?product=oneasy';
  }
  if (tid.includes('soilguard') || name.includes('soilguard')) {
    return '/product-one-pagers.html?product=soilguard';
  }
  if (tid.includes('proteinguard') || name.includes('proteinguard')) {
    return '/product-one-pagers.html?product=proteinguard';
  }
  if (tid.includes('onemag-plant') || name.includes('plant dna')) {
    return '/product-one-pagers.html?product=onemag_plant_dna';
  }
  if (tid.includes('onemag') || name.includes('onemag')) {
    return '/product-one-pagers.html?product=onemag_universal_dna';
  }
  if (tid.includes('nucleoguard') || name.includes('nucleoguard') || name.includes('rnaguard')) {
    return '/product-one-pagers.html?product=nucleoguard';
  }
  if (tid.includes('onenext') || name.includes('onenext')) {
    return '/product-one-pagers.html?product=onenext_16s_v3-v4';
  }
  if (tid.includes('taq-plus') || name.includes('taq plus') || name.includes('2x taq')) {
    return '/product-one-pagers.html?product=taqplus_pcr';
  }
  if (tid.includes('room-temp') || name.includes('room-temperature')) {
    return '/product-one-pagers.html';
  }

  // 4. NGS A4 Flyers (6 templates)
  if (tid.includes('ngs-genome-exome') || (name.includes('genome') && name.includes('exome'))) {
    return '/ngs-genome-exome-flyer.html';
  }
  if (tid.includes('ngs-rna') || (name.includes('ngs') && name.includes('rna'))) {
    return '/ngs-rna-sequencing-flyer.html';
  }
  if (tid.includes('ngs-metagenomics') || (name.includes('ngs') && name.includes('metagenomics'))) {
    return '/ngs-metagenomics-flyer.html';
  }
  if (tid.includes('ngs-long-read') || (name.includes('ngs') && name.includes('long-read'))) {
    return '/ngs-long-read-flyer.html';
  }
  if (tid.includes('ngs-spacious') || name.includes('spacious') || tid.includes('sample-to-insight-flyer') || name.includes('genomics services flyer')) {
    return '/ngs-spacious-flyer.html';
  }
  if (tid.includes('ngs-sequencing') || tid.includes('ngs-brochure') || name.includes('sequencing services flyer') || name.includes('ngs sequencing flyer')) {
    return '/ngs-sequencing-brochure.html';
  }

  // 5. Tri-Fold Brochures
  if (tid.includes('story') || name.includes('story')) {
    return '/tells-a-story.html';
  }
  if (tid.includes('insight') || name.includes('insight') || name.includes('sample to insight')) {
    return '/sample-to-insight.html';
  }
  if (tid.includes('trifold') || name.includes('tri-fold') || name.includes('decoding life')) {
    return '/from-sample-to-insight.html';
  }

  return '/brochure-insight.html';
}

