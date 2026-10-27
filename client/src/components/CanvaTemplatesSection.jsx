import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TemplatesSection, ImagesGrid } from 'polotno/side-panel';

export const CANVA_TEMPLATES = [
  {
    id: 'healthcare-center',
    name: 'About Our Healthcare Center',
    subtitle: 'Medical & Clinical Care Tri-Fold',
    category: 'biology',
    preview: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&auto=format&fit=crop&q=80',
    w: 1123,
    h: 794,
    elements: [
      { type: 'figure', subType: 'rect', x: 0, y: 0, width: 1123, height: 794, fill: '#f8fafc', selectable: false },
      // Left Panel
      { type: 'figure', subType: 'rect', x: 20, y: 20, width: 340, height: 754, fill: '#ffffff', cornerRadius: 12 },
      { type: 'image', src: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80', x: 40, y: 40, width: 300, height: 200, cornerRadius: 8 },
      { type: 'text', text: 'CONNECT WITH US', x: 40, y: 260, width: 300, fontSize: 18, fontWeight: 'bold', fill: '#0f766e', fontFamily: 'Poppins' },
      { type: 'text', text: 'Dedicated 24/7 emergency response and comprehensive outpatient care for all patients.', x: 40, y: 295, width: 300, fontSize: 12, fill: '#64748b', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 40, y: 360, width: 300, height: 60, fill: '#f0fdfa', cornerRadius: 8 },
      { type: 'text', text: '📞 Emergency Hotline: (555) 019-2834\n✉️ clinic@healthcare.org', x: 55, y: 375, width: 270, fontSize: 12, fontWeight: '600', fill: '#0f766e', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 40, y: 700, width: 300, height: 44, fill: '#0f766e', cornerRadius: 8 },
      { type: 'text', text: 'www.healthcare-center.com', x: 40, y: 712, width: 300, fontSize: 13, fontWeight: 'bold', fill: '#ffffff', align: 'center', fontFamily: 'Poppins' },

      // Center Panel
      { type: 'figure', subType: 'rect', x: 380, y: 20, width: 360, height: 754, fill: '#042f2e', cornerRadius: 12 },
      { type: 'text', text: 'YOUR HEALTH,\nOUR PROMISE.', x: 410, y: 60, width: 300, fontSize: 32, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Montserrat' },
      { type: 'text', text: 'State-of-the-art diagnostic technology combined with compassionate medical experts.', x: 410, y: 150, width: 300, fontSize: 13, fill: '#99f6e4', fontFamily: 'Poppins' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80', x: 410, y: 220, width: 300, height: 320, cornerRadius: 8 },
      { type: 'figure', subType: 'rect', x: 410, y: 565, width: 300, height: 180, fill: 'rgba(255,255,255,0.08)', cornerRadius: 8 },
      { type: 'text', text: 'WHY CHOOSE OUR CLINIC?', x: 430, y: 585, width: 260, fontSize: 14, fontWeight: 'bold', fill: '#2dd4bf', fontFamily: 'Poppins' },
      { type: 'text', text: '• Board-certified medical specialists\n• Modern accredited surgical theaters\n• Affordable individualized care plans\n• Rapid in-house digital lab testing', x: 430, y: 615, width: 260, fontSize: 12, fill: '#e2e8f0', fontFamily: 'Poppins' },

      // Right Panel
      { type: 'figure', subType: 'rect', x: 760, y: 20, width: 340, height: 754, fill: '#ffffff', cornerRadius: 12 },
      { type: 'text', text: 'OUR SERVICES', x: 785, y: 50, width: 290, fontSize: 24, fontWeight: 'bold', fill: '#0f766e', fontFamily: 'Montserrat' },
      { type: 'figure', subType: 'rect', x: 785, y: 85, width: 60, height: 4, fill: '#0d9488', cornerRadius: 2 },
      { type: 'figure', subType: 'rect', x: 785, y: 110, width: 290, height: 90, fill: '#f8fafc', cornerRadius: 8 },
      { type: 'text', text: 'Cardiology & Vascular\nAdvanced heart health screenings, ECG, and preventative cardiovascular therapy.', x: 800, y: 125, width: 260, fontSize: 12, fill: '#1e293b', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 785, y: 215, width: 290, height: 90, fill: '#f8fafc', cornerRadius: 8 },
      { type: 'text', text: 'Neurology & Brain Health\nSpecialized diagnostic imaging and neurological recovery programs.', x: 800, y: 230, width: 260, fontSize: 12, fill: '#1e293b', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 785, y: 320, width: 290, height: 90, fill: '#f8fafc', cornerRadius: 8 },
      { type: 'text', text: 'Pediatrics & Family Care\nRoutine immunizations, wellness checkups, and pediatric emergency support.', x: 800, y: 335, width: 260, fontSize: 12, fill: '#1e293b', fontFamily: 'Poppins' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80', x: 785, y: 430, width: 290, height: 240, cornerRadius: 8 },
      { type: 'figure', subType: 'rect', x: 785, y: 690, width: 290, height: 50, fill: '#0f766e', cornerRadius: 8 },
      { type: 'text', text: 'BOOK AN APPOINTMENT', x: 785, y: 705, width: 290, fontSize: 13, fontWeight: 'bold', fill: '#ffffff', align: 'center', fontFamily: 'Poppins' },
    ],
  },
  {
    id: 'health-medicine',
    name: 'Health & Medicine - Fauget Clinic',
    subtitle: 'Modern Healthcare & Pharmacy Tri-Fold',
    category: 'biology',
    preview: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400&auto=format&fit=crop&q=80',
    w: 1123,
    h: 794,
    elements: [
      { type: 'figure', subType: 'rect', x: 0, y: 0, width: 1123, height: 794, fill: '#f0f9ff', selectable: false },
      // Left Panel
      { type: 'figure', subType: 'rect', x: 20, y: 20, width: 340, height: 754, fill: '#0284c7', cornerRadius: 10 },
      { type: 'text', text: 'FAUGET CLINIC', x: 45, y: 60, width: 290, fontSize: 26, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Montserrat' },
      { type: 'text', text: 'HEALTHCARE\nSOLUTIONS 2026', x: 45, y: 100, width: 290, fontSize: 14, fill: '#bae6fd', fontFamily: 'Poppins' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80', x: 45, y: 160, width: 290, height: 260, cornerRadius: 8 },
      { type: 'text', text: '24/7 Patient Services', x: 45, y: 445, width: 290, fontSize: 18, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Poppins' },
      { type: 'text', text: 'Providing accurate diagnosis and world-class inpatient treatment with maximum comfort.', x: 45, y: 480, width: 290, fontSize: 12, fill: '#e0f2fe', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 45, y: 680, width: 290, height: 50, fill: '#ffffff', cornerRadius: 8 },
      { type: 'text', text: 'CALL: +1 (800) 555-0199', x: 45, y: 696, width: 290, fontSize: 13, fontWeight: 'bold', fill: '#0284c7', align: 'center', fontFamily: 'Poppins' },

      // Center Panel
      { type: 'figure', subType: 'rect', x: 380, y: 20, width: 360, height: 754, fill: '#ffffff', cornerRadius: 10 },
      { type: 'text', text: 'WHY CHOOSE US?', x: 410, y: 50, width: 300, fontSize: 22, fontWeight: 'bold', fill: '#0369a1', fontFamily: 'Montserrat' },
      { type: 'text', text: 'We offer an integrated patient-centered model that reduces wait times and improves medical recovery outcomes.', x: 410, y: 85, width: 300, fontSize: 12, fill: '#64748b', fontFamily: 'Poppins' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80', x: 410, y: 150, width: 300, height: 200, cornerRadius: 8 },
      { type: 'text', text: 'MEDICAL PACKAGES', x: 410, y: 375, width: 300, fontSize: 16, fontWeight: 'bold', fill: '#0f172a', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 410, y: 410, width: 300, height: 65, fill: '#f8fafc', cornerRadius: 6 },
      { type: 'text', text: 'Comprehensive Health Checkup\nBlood profiling, full radiology, and vitals assessment.', x: 425, y: 422, width: 270, fontSize: 11, fill: '#334155', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 410, y: 490, width: 300, height: 65, fill: '#f8fafc', cornerRadius: 6 },
      { type: 'text', text: 'Executive Wellness Scan\nAdvanced MRI, metabolic test, and dietary consultation.', x: 425, y: 502, width: 270, fontSize: 11, fill: '#334155', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 410, y: 570, width: 300, height: 65, fill: '#f8fafc', cornerRadius: 6 },
      { type: 'text', text: 'Pediatric Immunization Plan\nComplete vaccine tracking and childhood developmental scans.', x: 425, y: 582, width: 270, fontSize: 11, fill: '#334155', fontFamily: 'Poppins' },

      // Right Panel
      { type: 'figure', subType: 'rect', x: 760, y: 20, width: 340, height: 754, fill: '#ffffff', cornerRadius: 10 },
      { type: 'text', text: 'OUR SPECIALISTS', x: 785, y: 50, width: 290, fontSize: 22, fontWeight: 'bold', fill: '#0369a1', fontFamily: 'Montserrat' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=800&auto=format&fit=crop&q=80', x: 785, y: 90, width: 290, height: 180, cornerRadius: 8 },
      { type: 'text', text: 'Dr. Sarah Mitchell, MD\nChief of Clinical Surgery & Internal Medicine', x: 785, y: 285, width: 290, fontSize: 12, fontWeight: '600', fill: '#0f172a', fontFamily: 'Poppins' },
      { type: 'text', text: 'CLINIC TIMINGS', x: 785, y: 350, width: 290, fontSize: 16, fontWeight: 'bold', fill: '#0369a1', fontFamily: 'Poppins' },
      { type: 'text', text: 'Monday – Friday: 08:00 AM – 09:00 PM\nSaturday: 09:00 AM – 06:00 PM\nSunday & Holidays: Emergency Only', x: 785, y: 380, width: 290, fontSize: 12, fill: '#64748b', fontFamily: 'Poppins' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80', x: 785, y: 460, width: 290, height: 190, cornerRadius: 8 },
      { type: 'figure', subType: 'rect', x: 785, y: 680, width: 290, height: 50, fill: '#0284c7', cornerRadius: 8 },
      { type: 'text', text: 'GET IN TOUCH TODAY', x: 785, y: 696, width: 290, fontSize: 13, fontWeight: 'bold', fill: '#ffffff', align: 'center', fontFamily: 'Poppins' },
    ],
  },
  {
    id: 'biotech-genomics',
    name: 'Genomics & BioTech Innovation',
    subtitle: 'Next-Generation Science Tri-Fold',
    category: 'biology',
    preview: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=400&auto=format&fit=crop&q=80',
    w: 1123,
    h: 794,
    elements: [
      { type: 'figure', subType: 'rect', x: 0, y: 0, width: 1123, height: 794, fill: '#0a0f1d', selectable: false },
      // Left Panel
      { type: 'figure', subType: 'rect', x: 20, y: 20, width: 340, height: 754, fill: '#111827', cornerRadius: 12 },
      { type: 'text', text: 'BIO-DISCOVERY 2026', x: 45, y: 50, width: 290, fontSize: 13, fontWeight: 'bold', fill: '#38bdf8', fontFamily: 'Montserrat' },
      { type: 'text', text: 'DECODING\nLIFE WITH\nGENOMICS', x: 45, y: 80, width: 290, fontSize: 28, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Montserrat' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80', x: 45, y: 220, width: 290, height: 240, cornerRadius: 8 },
      { type: 'text', text: 'Precision Genomic Workflows', x: 45, y: 485, width: 290, fontSize: 16, fontWeight: 'bold', fill: '#38bdf8', fontFamily: 'Poppins' },
      { type: 'text', text: 'High-throughput sequencing architectures delivering single-cell precision and multi-omics integration.', x: 45, y: 515, width: 290, fontSize: 12, fill: '#94a3b8', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 45, y: 690, width: 290, height: 46, fill: '#0284c7', cornerRadius: 8 },
      { type: 'text', text: 'EXPLORE PIPELINES', x: 45, y: 704, width: 290, fontSize: 13, fontWeight: 'bold', fill: '#ffffff', align: 'center', fontFamily: 'Poppins' },

      // Center Panel
      { type: 'figure', subType: 'rect', x: 380, y: 20, width: 360, height: 754, fill: '#0f172a', cornerRadius: 12 },
      { type: 'text', text: 'KEY CAPABILITIES', x: 410, y: 50, width: 300, fontSize: 22, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Montserrat' },
      { type: 'figure', subType: 'rect', x: 410, y: 95, width: 300, height: 110, fill: '#1e293b', cornerRadius: 8 },
      { type: 'text', text: 'Whole Genome Sequencing (WGS)\nUltra-deep coverage across complex genomes, identifying rare SNVs and structural variants.', x: 425, y: 115, width: 270, fontSize: 12, fill: '#e2e8f0', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 410, y: 225, width: 300, height: 110, fill: '#1e293b', cornerRadius: 8 },
      { type: 'text', text: 'Metagenomic Profiling\nCharacterize bacterial and viral microbiomes with high-resolution 16S and shotgun sequencing.', x: 425, y: 245, width: 270, fontSize: 12, fill: '#e2e8f0', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 410, y: 355, width: 300, height: 110, fill: '#1e293b', cornerRadius: 8 },
      { type: 'text', text: 'Bioinformatics & Cloud AI\nAutomated variant annotation, phylogenetics, and automated clinical reporting.', x: 425, y: 375, width: 270, fontSize: 12, fill: '#e2e8f0', fontFamily: 'Poppins' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80', x: 410, y: 490, width: 300, height: 245, cornerRadius: 8 },

      // Right Panel
      { type: 'figure', subType: 'rect', x: 760, y: 20, width: 340, height: 754, fill: '#111827', cornerRadius: 12 },
      { type: 'text', text: 'IMPACT METRICS', x: 785, y: 50, width: 290, fontSize: 22, fontWeight: 'bold', fill: '#38bdf8', fontFamily: 'Montserrat' },
      { type: 'figure', subType: 'rect', x: 785, y: 95, width: 290, height: 80, fill: '#1e293b', cornerRadius: 8 },
      { type: 'text', text: '99.98%\nSequencing Quality Score (Q30+)', x: 805, y: 110, width: 250, fontSize: 16, fontWeight: 'bold', fill: '#38bdf8', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 785, y: 195, width: 290, height: 80, fill: '#1e293b', cornerRadius: 8 },
      { type: 'text', text: '100,000+\nClinical & Research Samples Analyzed', x: 805, y: 210, width: 250, fontSize: 16, fontWeight: 'bold', fill: '#38bdf8', fontFamily: 'Poppins' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&auto=format&fit=crop&q=80', x: 785, y: 300, width: 290, height: 260, cornerRadius: 8 },
      { type: 'text', text: 'Partner with our genomics institute for publication-grade datasets and clinical discoveries.', x: 785, y: 585, width: 290, fontSize: 12, fill: '#94a3b8', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 785, y: 690, width: 290, height: 46, fill: '#0284c7', cornerRadius: 8 },
      { type: 'text', text: 'REQUEST PROPOSAL', x: 785, y: 704, width: 290, fontSize: 13, fontWeight: 'bold', fill: '#ffffff', align: 'center', fontFamily: 'Poppins' },
    ],
  },
  {
    id: 'corporate-business',
    name: 'Build Your Business - Corporate',
    subtitle: 'Modern Consulting & Finance Tri-Fold',
    category: 'corporate',
    preview: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80',
    w: 1123,
    h: 794,
    elements: [
      { type: 'figure', subType: 'rect', x: 0, y: 0, width: 1123, height: 794, fill: '#ffffff', selectable: false },
      // Left Panel
      { type: 'figure', subType: 'rect', x: 20, y: 20, width: 340, height: 754, fill: '#0f172a', cornerRadius: 8 },
      { type: 'text', text: 'GROWTH ADVISORY', x: 45, y: 50, width: 290, fontSize: 12, fontWeight: 'bold', fill: '#38bdf8', fontFamily: 'Montserrat' },
      { type: 'text', text: 'BUILD YOUR\nBUSINESS\nSTRONGER.', x: 45, y: 80, width: 290, fontSize: 30, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Montserrat' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80', x: 45, y: 220, width: 290, height: 280, cornerRadius: 6 },
      { type: 'text', text: 'Helping enterprises accelerate revenue and achieve operational excellence.', x: 45, y: 530, width: 290, fontSize: 13, fill: '#cbd5e1', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 45, y: 690, width: 290, height: 48, fill: '#38bdf8', cornerRadius: 6 },
      { type: 'text', text: 'SCHEDULE A CONSULT', x: 45, y: 705, width: 290, fontSize: 13, fontWeight: 'bold', fill: '#0f172a', align: 'center', fontFamily: 'Poppins' },

      // Center Panel
      { type: 'figure', subType: 'rect', x: 380, y: 20, width: 360, height: 754, fill: '#f8fafc', cornerRadius: 8 },
      { type: 'text', text: 'OUR METHODOLOGY', x: 410, y: 50, width: 300, fontSize: 22, fontWeight: 'bold', fill: '#0f172a', fontFamily: 'Montserrat' },
      { type: 'figure', subType: 'rect', x: 410, y: 95, width: 300, height: 85, fill: '#ffffff', cornerRadius: 6 },
      { type: 'text', text: '1. Discovery & Audit\nComprehensive evaluation of company metrics and bottlenecks.', x: 425, y: 110, width: 270, fontSize: 12, fill: '#334155', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 410, y: 200, width: 300, height: 85, fill: '#ffffff', cornerRadius: 6 },
      { type: 'text', text: '2. Strategy Implementation\nDeploying high-impact digital workflows and growth tactics.', x: 425, y: 215, width: 270, fontSize: 12, fill: '#334155', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 410, y: 305, width: 300, height: 85, fill: '#ffffff', cornerRadius: 6 },
      { type: 'text', text: '3. Scaling & Optimization\nContinuous KPIs tracking and revenue expansion.', x: 425, y: 320, width: 270, fontSize: 12, fill: '#334155', fontFamily: 'Poppins' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80', x: 410, y: 415, width: 300, height: 320, cornerRadius: 6 },

      // Right Panel
      { type: 'figure', subType: 'rect', x: 760, y: 20, width: 340, height: 754, fill: '#ffffff', cornerRadius: 8 },
      { type: 'text', text: 'CASE STUDIES', x: 785, y: 50, width: 290, fontSize: 22, fontWeight: 'bold', fill: '#0f172a', fontFamily: 'Montserrat' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80', x: 785, y: 90, width: 290, height: 200, cornerRadius: 6 },
      { type: 'text', text: '+340% Revenue Growth\nHow our client reached $25M valuation in 18 months.', x: 785, y: 310, width: 290, fontSize: 13, fontWeight: '600', fill: '#0f172a', fontFamily: 'Poppins' },
      { type: 'text', text: '“Partnering with this team transformed our operations and made us the market leader in our domain.”', x: 785, y: 390, width: 290, fontSize: 13, fontStyle: 'italic', fill: '#64748b', fontFamily: 'Poppins' },
      { type: 'text', text: '— Marcus Vance, CEO at Apex Corp', x: 785, y: 470, width: 290, fontSize: 12, fontWeight: 'bold', fill: '#0f172a', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 785, y: 690, width: 290, height: 48, fill: '#0f172a', cornerRadius: 6 },
      { type: 'text', text: 'GET THE FULL REPORT', x: 785, y: 705, width: 290, fontSize: 13, fontWeight: 'bold', fill: '#ffffff', align: 'center', fontFamily: 'Poppins' },
    ],
  },
  {
    id: 'ai-biocomputing',
    name: 'AI in Life Sciences & Bio-IT',
    subtitle: 'Neural Intelligence & Molecular Analytics',
    category: 'tech',
    preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    w: 1123,
    h: 794,
    elements: [
      { type: 'figure', subType: 'rect', x: 0, y: 0, width: 1123, height: 794, fill: '#050510', selectable: false },
      // Left Panel
      { type: 'figure', subType: 'rect', x: 20, y: 20, width: 340, height: 754, fill: '#0d0d22', cornerRadius: 10 },
      { type: 'text', text: 'ARTIFICIAL INTELLIGENCE', x: 45, y: 50, width: 290, fontSize: 12, fontWeight: 'bold', fill: '#a855f7', fontFamily: 'Montserrat' },
      { type: 'text', text: 'AI-POWERED\nPRECISION\nBIOMEDICINE', x: 45, y: 80, width: 290, fontSize: 28, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Montserrat' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', x: 45, y: 215, width: 290, height: 260, cornerRadius: 8 },
      { type: 'text', text: 'Accelerating Target Discovery', x: 45, y: 500, width: 290, fontSize: 16, fontWeight: 'bold', fill: '#c084fc', fontFamily: 'Poppins' },
      { type: 'text', text: 'Deep learning models trained on 500M+ genomic variants to predict drug interactions and biomarker efficacy.', x: 45, y: 535, width: 290, fontSize: 12, fill: '#94a3b8', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 45, y: 690, width: 290, height: 48, fill: '#7c3aed', cornerRadius: 8 },
      { type: 'text', text: 'EXPLORE AI PLATFORM', x: 45, y: 705, width: 290, fontSize: 13, fontWeight: 'bold', fill: '#ffffff', align: 'center', fontFamily: 'Poppins' },

      // Center Panel
      { type: 'figure', subType: 'rect', x: 380, y: 20, width: 360, height: 754, fill: '#13112c', cornerRadius: 10 },
      { type: 'text', text: 'CORE CAPABILITIES', x: 410, y: 50, width: 300, fontSize: 22, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Montserrat' },
      { type: 'figure', subType: 'rect', x: 410, y: 95, width: 300, height: 100, fill: '#1e1b4b', cornerRadius: 8 },
      { type: 'text', text: 'Structural Protein Folding\nPredict 3D conformational folds and binding affinity within minutes.', x: 425, y: 115, width: 270, fontSize: 12, fill: '#e9d5ff', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 410, y: 215, width: 300, height: 100, fill: '#1e1b4b', cornerRadius: 8 },
      { type: 'text', text: 'Clinical Variant Annotation\nZero-shot classification of pathogenic mutations using large language bio-models.', x: 425, y: 235, width: 270, fontSize: 12, fill: '#e9d5ff', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 410, y: 335, width: 300, height: 100, fill: '#1e1b4b', cornerRadius: 8 },
      { type: 'text', text: 'Next-Gen Biomarker Discovery\nMulti-modal integration combining RNA sequencing, proteomics, and patient histories.', x: 425, y: 355, width: 270, fontSize: 12, fill: '#e9d5ff', fontFamily: 'Poppins' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80', x: 410, y: 460, width: 300, height: 280, cornerRadius: 8 },

      // Right Panel
      { type: 'figure', subType: 'rect', x: 760, y: 20, width: 340, height: 754, fill: '#0d0d22', cornerRadius: 10 },
      { type: 'text', text: 'ENTERPRISE TECH', x: 785, y: 50, width: 290, fontSize: 22, fontWeight: 'bold', fill: '#a855f7', fontFamily: 'Montserrat' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80', x: 785, y: 95, width: 290, height: 220, cornerRadius: 8 },
      { type: 'text', text: 'Enterprise Cloud Infrastructure\nHIPAA-compliant, SOC-2 certified cloud deployments designed for terabyte-scale FASTQ & BAM data processing.', x: 785, y: 340, width: 290, fontSize: 12, fill: '#cbd5e1', fontFamily: 'Poppins' },
      { type: 'text', text: '• REST & GraphQL API Endpoints\n• Multi-cloud AWS / GCP / Azure\n• Custom Fine-Tuned Models', x: 785, y: 440, width: 290, fontSize: 12, fill: '#a855f7', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 785, y: 690, width: 290, height: 48, fill: '#7c3aed', cornerRadius: 8 },
      { type: 'text', text: 'REQUEST DEMO ACCESS', x: 785, y: 705, width: 290, fontSize: 13, fontWeight: 'bold', fill: '#ffffff', align: 'center', fontFamily: 'Poppins' },
    ],
  },
  {
    id: 'eco-agribio',
    name: 'Eco & Plant Biology Solutions',
    subtitle: 'Sustainable Agriculture & Botanical Science',
    category: 'biology',
    preview: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&auto=format&fit=crop&q=80',
    w: 1123,
    h: 794,
    elements: [
      { type: 'figure', subType: 'rect', x: 0, y: 0, width: 1123, height: 794, fill: '#f7fee7', selectable: false },
      // Left Panel
      { type: 'figure', subType: 'rect', x: 20, y: 20, width: 340, height: 754, fill: '#14532d', cornerRadius: 10 },
      { type: 'text', text: 'AGRICULTURAL GENOMICS', x: 45, y: 50, width: 290, fontSize: 12, fontWeight: 'bold', fill: '#86efac', fontFamily: 'Montserrat' },
      { type: 'text', text: 'SUSTAINABLE\nPLANT BIO\nSOLUTIONS', x: 45, y: 80, width: 290, fontSize: 28, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Montserrat' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&auto=format&fit=crop&q=80', x: 45, y: 215, width: 290, height: 260, cornerRadius: 8 },
      { type: 'text', text: 'Crop Resilience & Yield', x: 45, y: 500, width: 290, fontSize: 16, fontWeight: 'bold', fill: '#86efac', fontFamily: 'Poppins' },
      { type: 'text', text: 'Breeding climate-resilient strains and optimizing crop microbiomes for pesticide-free food security.', x: 45, y: 535, width: 290, fontSize: 12, fill: '#dcfce7', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 45, y: 690, width: 290, height: 48, fill: '#16a34a', cornerRadius: 8 },
      { type: 'text', text: 'DOWNLOAD CASE STUDY', x: 45, y: 705, width: 290, fontSize: 13, fontWeight: 'bold', fill: '#ffffff', align: 'center', fontFamily: 'Poppins' },

      // Center Panel
      { type: 'figure', subType: 'rect', x: 380, y: 20, width: 360, height: 754, fill: '#ffffff', cornerRadius: 10 },
      { type: 'text', text: 'RESEARCH SERVICES', x: 410, y: 50, width: 300, fontSize: 22, fontWeight: 'bold', fill: '#14532d', fontFamily: 'Montserrat' },
      { type: 'figure', subType: 'rect', x: 410, y: 95, width: 300, height: 100, fill: '#f0fdf4', cornerRadius: 8 },
      { type: 'text', text: 'Soil Microbiome Characterization\nIdentify beneficial mycorrhizal fungi and nitrogen-fixing bacteria strains.', x: 425, y: 115, width: 270, fontSize: 12, fill: '#166534', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 410, y: 215, width: 300, height: 100, fill: '#f0fdf4', cornerRadius: 8 },
      { type: 'text', text: 'Marker-Assisted Selection (MAS)\nFast-track trait selection for drought tolerance, disease resistance, and sweetness.', x: 425, y: 235, width: 270, fontSize: 12, fill: '#166534', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 410, y: 335, width: 300, height: 100, fill: '#f0fdf4', cornerRadius: 8 },
      { type: 'text', text: 'Botanical Metabolomics\nQuantify phyto-compounds, active medicinal alkaloids, and terpene profiles.', x: 425, y: 355, width: 270, fontSize: 12, fill: '#166534', fontFamily: 'Poppins' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800&auto=format&fit=crop&q=80', x: 410, y: 460, width: 300, height: 280, cornerRadius: 8 },

      // Right Panel
      { type: 'figure', subType: 'rect', x: 760, y: 20, width: 340, height: 754, fill: '#ffffff', cornerRadius: 10 },
      { type: 'text', text: 'GLOBAL IMPACT', x: 785, y: 50, width: 290, fontSize: 22, fontWeight: 'bold', fill: '#14532d', fontFamily: 'Montserrat' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop&q=80', x: 785, y: 95, width: 290, height: 220, cornerRadius: 8 },
      { type: 'text', text: 'Over 2.5 million hectares surveyed across 18 countries, assisting regenerative farming groups in restoring biological soil health.', x: 785, y: 340, width: 290, fontSize: 12, fill: '#334155', fontFamily: 'Poppins' },
      { type: 'text', text: 'Headquarters: Cambridge Agritech Park\nEmail: contact@agribiosolutions.com\nPhone: +44 20 7946 0921', x: 785, y: 460, width: 290, fontSize: 12, fill: '#15803d', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 785, y: 690, width: 290, height: 48, fill: '#16a34a', cornerRadius: 8 },
      { type: 'text', text: 'CONTACT SCIENTIFIC TEAM', x: 785, y: 705, width: 290, fontSize: 13, fontWeight: 'bold', fill: '#ffffff', align: 'center', fontFamily: 'Poppins' },
    ],
  },
  {
    id: 'larana-medical',
    name: 'Larana Medical Center',
    subtitle: 'Clinical Excellence & Patient Care Tri-Fold',
    category: 'biology',
    preview: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&auto=format&fit=crop&q=80',
    w: 1123,
    h: 794,
    elements: [
      { type: 'figure', subType: 'rect', x: 0, y: 0, width: 1123, height: 794, fill: '#f8fafc', selectable: false },
      // Left Panel
      { type: 'figure', subType: 'rect', x: 20, y: 20, width: 340, height: 754, fill: '#0891b2', cornerRadius: 10 },
      { type: 'text', text: 'LARANA CLINIC', x: 45, y: 55, width: 290, fontSize: 24, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Montserrat' },
      { type: 'text', text: 'CARING FOR YOUR HEALTH', x: 45, y: 90, width: 290, fontSize: 13, fontWeight: '600', fill: '#cffafe', fontFamily: 'Poppins' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80', x: 45, y: 140, width: 290, height: 260, cornerRadius: 8 },
      { type: 'text', text: 'About Our Mission', x: 45, y: 430, width: 290, fontSize: 18, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Poppins' },
      { type: 'text', text: 'Our multidisciplinary medical team provides round-the-clock clinical consultations, diagnostic precision, and therapeutic rehabilitation.', x: 45, y: 465, width: 290, fontSize: 12, fill: '#ecfeff', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 45, y: 685, width: 290, height: 50, fill: '#ffffff', cornerRadius: 8 },
      { type: 'text', text: 'BOOK AN APPOINTMENT', x: 45, y: 700, width: 290, fontSize: 13, fontWeight: 'bold', fill: '#0891b2', align: 'center', fontFamily: 'Poppins' },

      // Center Panel
      { type: 'figure', subType: 'rect', x: 380, y: 20, width: 360, height: 754, fill: '#ffffff', cornerRadius: 10 },
      { type: 'text', text: 'CLINICAL DEPARTMENTS', x: 410, y: 50, width: 300, fontSize: 20, fontWeight: 'bold', fill: '#0e7490', fontFamily: 'Montserrat' },
      { type: 'figure', subType: 'rect', x: 410, y: 90, width: 300, height: 85, fill: '#f0fdfa', cornerRadius: 6 },
      { type: 'text', text: 'General & Family Medicine\nComprehensive health assessments, regular screenings, and preventive management.', x: 425, y: 105, width: 270, fontSize: 12, fill: '#155e75', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 410, y: 190, width: 300, height: 85, fill: '#f0fdfa', cornerRadius: 6 },
      { type: 'text', text: 'Obstetrics & Gynecology\nExpectant mother guidance, prenatal ultrasound, and newborn care support.', x: 425, y: 205, width: 270, fontSize: 12, fill: '#155e75', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 410, y: 290, width: 300, height: 85, fill: '#f0fdfa', cornerRadius: 6 },
      { type: 'text', text: 'Orthopedics & Joint Clinic\nSports medicine, fracture care, and advanced robotic physical therapy.', x: 425, y: 305, width: 270, fontSize: 12, fill: '#155e75', fontFamily: 'Poppins' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80', x: 410, y: 400, width: 300, height: 335, cornerRadius: 6 },

      // Right Panel
      { type: 'figure', subType: 'rect', x: 760, y: 20, width: 340, height: 754, fill: '#ffffff', cornerRadius: 10 },
      { type: 'text', text: 'DOCTORS ON DUTY', x: 785, y: 50, width: 290, fontSize: 20, fontWeight: 'bold', fill: '#0e7490', fontFamily: 'Montserrat' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80', x: 785, y: 90, width: 290, height: 210, cornerRadius: 8 },
      { type: 'text', text: 'Dr. Michael Chen, Chief Physician\nSpecialist in Internal Medicine & Intensive Care', x: 785, y: 315, width: 290, fontSize: 12, fontWeight: '600', fill: '#0f172a', fontFamily: 'Poppins' },
      { type: 'text', text: 'CONTACT INFO', x: 785, y: 390, width: 290, fontSize: 16, fontWeight: 'bold', fill: '#0e7490', fontFamily: 'Montserrat' },
      { type: 'text', text: '🏥 123 Health Boulevard, Suite 400\n📞 Phone: (555) 789-0123\n✉️ info@laranaclinic.org\n🌐 www.laranaclinic.org', x: 785, y: 425, width: 290, fontSize: 13, fill: '#475569', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 785, y: 685, width: 290, height: 50, fill: '#0891b2', cornerRadius: 8 },
      { type: 'text', text: 'EMERGENCY 24/7', x: 785, y: 700, width: 290, fontSize: 13, fontWeight: 'bold', fill: '#ffffff', align: 'center', fontFamily: 'Poppins' },
    ],
  },
  {
    id: 'expert-medical',
    name: 'Expert Medical Care',
    subtitle: 'Hospital Services & Clinical Diagnostics Tri-Fold',
    category: 'biology',
    preview: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&auto=format&fit=crop&q=80',
    w: 1123,
    h: 794,
    elements: [
      { type: 'figure', subType: 'rect', x: 0, y: 0, width: 1123, height: 794, fill: '#f1f5f9', selectable: false },
      // Left Panel
      { type: 'figure', subType: 'rect', x: 20, y: 20, width: 340, height: 754, fill: '#1e3a8a', cornerRadius: 10 },
      { type: 'text', text: 'HOSPITAL OVERVIEW', x: 45, y: 55, width: 290, fontSize: 12, fontWeight: 'bold', fill: '#93c5fd', fontFamily: 'Montserrat' },
      { type: 'text', text: 'EXPERT\nMEDICAL CARE\nFOR YOU', x: 45, y: 80, width: 290, fontSize: 26, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Montserrat' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80', x: 45, y: 210, width: 290, height: 260, cornerRadius: 8 },
      { type: 'text', text: 'Accredited Excellence', x: 45, y: 495, width: 290, fontSize: 16, fontWeight: 'bold', fill: '#93c5fd', fontFamily: 'Poppins' },
      { type: 'text', text: 'Recognized nationally for superior surgical outcomes, infection control standards, and compassionate care.', x: 45, y: 530, width: 290, fontSize: 12, fill: '#dbeafe', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 45, y: 685, width: 290, height: 50, fill: '#2563eb', cornerRadius: 8 },
      { type: 'text', text: 'DISCOVER OUR WARDS', x: 45, y: 700, width: 290, fontSize: 13, fontWeight: 'bold', fill: '#ffffff', align: 'center', fontFamily: 'Poppins' },

      // Center Panel
      { type: 'figure', subType: 'rect', x: 380, y: 20, width: 360, height: 754, fill: '#ffffff', cornerRadius: 10 },
      { type: 'text', text: 'OUR CLINICAL EXPERTISE', x: 410, y: 50, width: 300, fontSize: 20, fontWeight: 'bold', fill: '#1e3a8a', fontFamily: 'Montserrat' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80', x: 410, y: 90, width: 300, height: 200, cornerRadius: 6 },
      { type: 'text', text: 'Key Specialties Offered:', x: 410, y: 310, width: 300, fontSize: 14, fontWeight: 'bold', fill: '#1e293b', fontFamily: 'Poppins' },
      { type: 'text', text: '✔ Advanced Laparoscopic & Bariatric Surgery\n✔ Non-Invasive Cardiovascular Angiography\n✔ Comprehensive Pediatric Intensive Unit\n✔ Oncological Chemo & Immunotherapy\n✔ 24/7 Digital Radiology & 3T MRI Scans', x: 410, y: 345, width: 300, fontSize: 12, fill: '#334155', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 410, y: 520, width: 300, height: 140, fill: '#eff6ff', cornerRadius: 8 },
      { type: 'text', text: 'PATIENT COMMITMENT\nWe adhere to the highest international protocols for patient safety, dignity, and recovery comfort.', x: 425, y: 540, width: 270, fontSize: 12, fill: '#1e40af', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 410, y: 685, width: 300, height: 50, fill: '#1e3a8a', cornerRadius: 8 },
      { type: 'text', text: 'CALL SPECIALIST DESK', x: 410, y: 700, width: 300, fontSize: 13, fontWeight: 'bold', fill: '#ffffff', align: 'center', fontFamily: 'Poppins' },

      // Right Panel
      { type: 'figure', subType: 'rect', x: 760, y: 20, width: 340, height: 754, fill: '#ffffff', cornerRadius: 10 },
      { type: 'text', text: 'VISITING HOURS & LOCATION', x: 785, y: 50, width: 290, fontSize: 18, fontWeight: 'bold', fill: '#1e3a8a', fontFamily: 'Montserrat' },
      { type: 'figure', subType: 'rect', x: 785, y: 90, width: 290, height: 100, fill: '#f8fafc', cornerRadius: 8 },
      { type: 'text', text: 'Inpatient Visiting Hours:\nMon - Fri: 10:00 AM - 12:00 PM & 05:00 PM - 08:00 PM\nWeekends: 10:00 AM - 08:00 PM', x: 800, y: 105, width: 260, fontSize: 11, fill: '#475569', fontFamily: 'Poppins' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80', x: 785, y: 210, width: 290, height: 260, cornerRadius: 8 },
      { type: 'text', text: 'Insurance & Coverage', x: 785, y: 495, width: 290, fontSize: 15, fontWeight: 'bold', fill: '#1e3a8a', fontFamily: 'Poppins' },
      { type: 'text', text: 'We accept all major health insurance providers with seamless cashless claims processing.', x: 785, y: 525, width: 290, fontSize: 12, fill: '#64748b', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 785, y: 685, width: 290, height: 50, fill: '#2563eb', cornerRadius: 8 },
      { type: 'text', text: 'INSURANCE INQUIRY', x: 785, y: 700, width: 290, fontSize: 13, fontWeight: 'bold', fill: '#ffffff', align: 'center', fontFamily: 'Poppins' },
    ],
  },
  {
    id: 'modern-realestate',
    name: 'Modern Real Estate & Architecture',
    subtitle: 'Property Showcase & Architectural Tri-Fold',
    category: 'corporate',
    preview: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80',
    w: 1123,
    h: 794,
    elements: [
      { type: 'figure', subType: 'rect', x: 0, y: 0, width: 1123, height: 794, fill: '#0f172a', selectable: false },
      // Left Panel
      { type: 'figure', subType: 'rect', x: 20, y: 20, width: 340, height: 754, fill: '#1e293b', cornerRadius: 8 },
      { type: 'text', text: 'MODERN RESIDENCES', x: 45, y: 55, width: 290, fontSize: 12, fontWeight: 'bold', fill: '#fbbf24', fontFamily: 'Montserrat' },
      { type: 'text', text: 'ARCHITECTURE\nTHAT DEFINES\nLUXURY', x: 45, y: 80, width: 290, fontSize: 26, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Montserrat' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80', x: 45, y: 210, width: 290, height: 260, cornerRadius: 6 },
      { type: 'text', text: 'Contemporary Living', x: 45, y: 495, width: 290, fontSize: 16, fontWeight: 'bold', fill: '#fbbf24', fontFamily: 'Poppins' },
      { type: 'text', text: 'Curated architectural marvels featuring sustainable solar integration, floor-to-ceiling glass, and smart automation.', x: 45, y: 530, width: 290, fontSize: 12, fill: '#94a3b8', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 45, y: 685, width: 290, height: 48, fill: '#fbbf24', cornerRadius: 6 },
      { type: 'text', text: 'VIEW PROPERTIES', x: 45, y: 700, width: 290, fontSize: 13, fontWeight: 'bold', fill: '#0f172a', align: 'center', fontFamily: 'Poppins' },

      // Center Panel
      { type: 'figure', subType: 'rect', x: 380, y: 20, width: 360, height: 754, fill: '#ffffff', cornerRadius: 8 },
      { type: 'text', text: 'FEATURED SPECIFICATIONS', x: 410, y: 50, width: 300, fontSize: 20, fontWeight: 'bold', fill: '#0f172a', fontFamily: 'Montserrat' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80', x: 410, y: 90, width: 300, height: 220, cornerRadius: 6 },
      { type: 'text', text: 'Premium Amenities Included:', x: 410, y: 330, width: 300, fontSize: 14, fontWeight: 'bold', fill: '#0f172a', fontFamily: 'Poppins' },
      { type: 'text', text: '• Heated Infinity Swimming Pool\n• Private Rooftop Garden & Lounge\n• EV Fast Charging Stations\n• Concierge & 24/7 Monitored Security\n• Custom Italian Marble Countertops', x: 410, y: 365, width: 300, fontSize: 12, fill: '#475569', fontFamily: 'Poppins' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80', x: 410, y: 510, width: 300, height: 160, cornerRadius: 6 },
      { type: 'figure', subType: 'rect', x: 410, y: 685, width: 300, height: 48, fill: '#0f172a', cornerRadius: 6 },
      { type: 'text', text: 'DOWNLOAD FLOOR PLANS', x: 410, y: 700, width: 300, fontSize: 13, fontWeight: 'bold', fill: '#ffffff', align: 'center', fontFamily: 'Poppins' },

      // Right Panel
      { type: 'figure', subType: 'rect', x: 760, y: 20, width: 340, height: 754, fill: '#1e293b', cornerRadius: 8 },
      { type: 'text', text: 'DEVELOPER DETAILS', x: 785, y: 50, width: 290, fontSize: 20, fontWeight: 'bold', fill: '#fbbf24', fontFamily: 'Montserrat' },
      { type: 'text', text: 'Developed by Apex Urban Living, with over 25 award-winning luxury developments across global metropolitan hubs.', x: 785, y: 90, width: 290, fontSize: 12, fill: '#cbd5e1', fontFamily: 'Poppins' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80', x: 785, y: 160, width: 290, height: 260, cornerRadius: 6 },
      { type: 'text', text: 'Private Tour Bookings', x: 785, y: 445, width: 290, fontSize: 15, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Poppins' },
      { type: 'text', text: 'Contact our sales gallery to arrange a private walkthrough with our architectural directors.', x: 785, y: 475, width: 290, fontSize: 12, fill: '#94a3b8', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 785, y: 685, width: 290, height: 48, fill: '#fbbf24', cornerRadius: 6 },
      { type: 'text', text: 'RESERVE A SHOWING', x: 785, y: 700, width: 290, fontSize: 13, fontWeight: 'bold', fill: '#0f172a', align: 'center', fontFamily: 'Poppins' },
    ],
  },
  {
    id: 'creative-design',
    name: 'Design Reflects Your Style',
    subtitle: 'Warm Minimalist Interior & Studio Tri-Fold',
    category: 'creative',
    preview: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&auto=format&fit=crop&q=80',
    w: 1123,
    h: 794,
    elements: [
      { type: 'figure', subType: 'rect', x: 0, y: 0, width: 1123, height: 794, fill: '#faf8f5', selectable: false },
      // Left Panel
      { type: 'figure', subType: 'rect', x: 20, y: 20, width: 340, height: 754, fill: '#ffffff', cornerRadius: 10 },
      { type: 'text', text: 'STUDIO AESTHETICS', x: 45, y: 55, width: 290, fontSize: 12, fontWeight: 'bold', fill: '#9a7b56', fontFamily: 'Montserrat' },
      { type: 'text', text: 'DESIGN THAT\nREFLECTS\nYOUR STYLE', x: 45, y: 80, width: 290, fontSize: 26, fontWeight: 'bold', fill: '#292524', fontFamily: 'Montserrat' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80', x: 45, y: 210, width: 290, height: 260, cornerRadius: 8 },
      { type: 'text', text: 'Organic Minimalism', x: 45, y: 495, width: 290, fontSize: 16, fontWeight: 'bold', fill: '#9a7b56', fontFamily: 'Poppins' },
      { type: 'text', text: 'Crafting tranquil, harmonious spaces through tactile textures, natural daylight, and artisan woodwork.', x: 45, y: 530, width: 290, fontSize: 12, fill: '#78716c', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 45, y: 685, width: 290, height: 48, fill: '#9a7b56', cornerRadius: 8 },
      { type: 'text', text: 'EXPLORE PORTFOLIO', x: 45, y: 700, width: 290, fontSize: 13, fontWeight: 'bold', fill: '#ffffff', align: 'center', fontFamily: 'Poppins' },

      // Center Panel
      { type: 'figure', subType: 'rect', x: 380, y: 20, width: 360, height: 754, fill: '#ffffff', cornerRadius: 10 },
      { type: 'text', text: 'DESIGN PHILOSOPHY', x: 410, y: 50, width: 300, fontSize: 20, fontWeight: 'bold', fill: '#292524', fontFamily: 'Montserrat' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80', x: 410, y: 90, width: 300, height: 200, cornerRadius: 6 },
      { type: 'text', text: 'Every interior tells a story through proportion, light, and materiality. We blend bespoke furniture with sustainable materials.', x: 410, y: 310, width: 300, fontSize: 12, fill: '#57534e', fontFamily: 'Poppins' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&auto=format&fit=crop&q=80', x: 410, y: 400, width: 300, height: 260, cornerRadius: 6 },
      { type: 'figure', subType: 'rect', x: 410, y: 685, width: 300, height: 48, fill: '#292524', cornerRadius: 8 },
      { type: 'text', text: 'VIEW LOOKBOOK', x: 410, y: 700, width: 300, fontSize: 13, fontWeight: 'bold', fill: '#ffffff', align: 'center', fontFamily: 'Poppins' },

      // Right Panel
      { type: 'figure', subType: 'rect', x: 760, y: 20, width: 340, height: 754, fill: '#ffffff', cornerRadius: 10 },
      { type: 'text', text: 'CONSULTATION & PRICING', x: 785, y: 50, width: 290, fontSize: 18, fontWeight: 'bold', fill: '#292524', fontFamily: 'Montserrat' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop&q=80', x: 785, y: 90, width: 290, height: 210, cornerRadius: 8 },
      { type: 'text', text: 'Services We Provide:\n• Residential Spatial Planning\n• Custom Millwork & Furnishings\n• Lighting & Acoustic Design\n• Complete Turnkey Execution', x: 785, y: 320, width: 290, fontSize: 12, fill: '#57534e', fontFamily: 'Poppins' },
      { type: 'text', text: 'Studio: 74 Mercer Street, Soho\nEmail: hello@studiostyle.design', x: 785, y: 480, width: 290, fontSize: 12, fontWeight: '600', fill: '#9a7b56', fontFamily: 'Poppins' },
      { type: 'figure', subType: 'rect', x: 785, y: 685, width: 290, height: 48, fill: '#9a7b56', cornerRadius: 8 },
      { type: 'text', text: 'BOOK DESIGN SESSION', x: 785, y: 700, width: 290, fontSize: 13, fontWeight: 'bold', fill: '#ffffff', align: 'center', fontFamily: 'Poppins' },
    ],
  },
];

/**
 * Loads a Canva template into Polotno store.
 */
export function loadCanvaTemplate(store, tpl) {
  try {
    store.clear();
    const w = tpl.w || 1123;
    const h = tpl.h || 794;
    store.setSize(w, h);

    const page = store.addPage();
    (tpl.elements || []).forEach((el) => {
      try {
        page.addElement(el);
      } catch (err) {
        console.warn('Could not add element:', el, err);
      }
    });
    return true;
  } catch (err) {
    console.error('Failed to load Canva template:', err);
    return false;
  }
}

/**
 * Universal Canva-Style Templates Panel (All Categories + Cloud API).
 */
export function CanvaTemplatesPanel({ store }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sameSize, setSameSize] = useState(false);
  const [cloudTemplates, setCloudTemplates] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  // Fetch templates from Polotno Cloud API
  const fetchCloud = async (q = '', p = 1, append = false, matchSize = false) => {
    try {
      setLoading(true);
      const key = (store && store.key) || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_POLOTNO_KEY) || '';
      const sizeParam = matchSize && store ? `size=${store.width}x${store.height}` : 'size=all';
      const url = `https://api.polotno.com/api/get-templates?${sizeParam}&query=${encodeURIComponent(q)}&per_page=30&page=${p}&KEY=${key}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load cloud templates');
      const data = await res.json();
      const items = data.items || [];
      if (append) {
        setCloudTemplates((prev) => [...prev, ...items]);
      } else {
        setCloudTemplates(items);
      }
      setHasMore(items.length >= 30 && p < (data.totalPages || 1));
    } catch (err) {
      console.warn('Polotno cloud templates error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search & category trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      let query = search.trim();
      if (!query && category !== 'all') {
        if (category === 'biology') query = 'biology';
        else if (category === 'corporate') query = 'business';
        else if (category === 'posters') query = 'poster';
        else if (category === 'flyers') query = 'flyer';
        else if (category === 'modern') query = 'modern';
      }
      fetchCloud(query, 1, false, sameSize);
    }, 250);
    return () => clearTimeout(timer);
  }, [search, category, sameSize]);

  // Handle Load More
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    let query = search.trim();
    if (!query && category !== 'all') {
      if (category === 'biology') query = 'biology';
      else if (category === 'corporate') query = 'business';
      else if (category === 'posters') query = 'poster';
      else if (category === 'flyers') query = 'flyer';
      else if (category === 'modern') query = 'modern';
    }
    fetchCloud(query, nextPage, true, sameSize);
  };

  // Filter local Canva templates
  const localFiltered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return CANVA_TEMPLATES.filter((tpl) => {
      if (category === 'biology' && tpl.category !== 'biology') return false;
      if (category === 'corporate' && tpl.category !== 'corporate') return false;
      if (category === 'tech' && tpl.category !== 'tech') return false;
      if (category === 'posters' && tpl.category !== 'creative') return false;
      if (!q) return true;
      return (
        tpl.name.toLowerCase().includes(q) ||
        tpl.subtitle.toLowerCase().includes(q) ||
        tpl.category.toLowerCase().includes(q)
      );
    });
  }, [search, category]);

  // Handle template selection
  const handleSelectTemplate = async (item) => {
    setLoadingId(item.id);
    try {
      if (item.json) {
        // Polotno Cloud Template
        const res = await fetch(item.json);
        const json = await res.json();
        store.loadJSON(json, true);
      } else if (item.elements) {
        // Built-in Canva Biology / Corporate template
        loadCanvaTemplate(store, item);
      }
    } catch (err) {
      console.error('Failed to load template:', err);
      alert('Could not load template: ' + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const combinedList = useMemo(() => {
    return [...localFiltered, ...cloudTemplates];
  }, [localFiltered, cloudTemplates]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '12px 10px', boxSizing: 'border-box' }}>
      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: '8px' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search all templates (e.g. biology, business, poster)..."
          style={{
            width: '100%',
            padding: '8px 28px 8px 30px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            fontSize: '12px',
            fontFamily: 'Poppins, sans-serif',
            boxSizing: 'border-box',
            outline: 'none',
          }}
        />
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#64748b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ position: 'absolute', left: '9px', top: '9px' }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        {search && (
          <button
            onClick={() => setSearch('')}
            style={{
              position: 'absolute',
              right: '8px',
              top: '8px',
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '14px',
              padding: 0,
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* Same size toggle */}
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#475569',
          marginBottom: '10px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <span>Show templates with same size</span>
        <input
          type="checkbox"
          checked={sameSize}
          onChange={(e) => setSameSize(e.target.checked)}
          style={{ cursor: 'pointer', accentColor: '#0b5d4b' }}
        />
      </label>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '5px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All Templates' },
          { id: 'biology', label: 'Biology & Medical' },
          { id: 'corporate', label: 'Corporate' },
          { id: 'posters', label: 'Posters & Flyers' },
          { id: 'modern', label: 'Modern Designs' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setCategory(c.id);
              setSearch('');
            }}
            style={{
              background: category === c.id ? '#0b5d4b' : '#f1f5f9',
              color: category === c.id ? '#ffffff' : '#334155',
              border: 'none',
              borderRadius: '14px',
              padding: '4px 9px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Templates Images Grid using Polotno's native ImagesGrid */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <ImagesGrid
          images={combinedList}
          getPreview={(tpl) => tpl.preview}
          getAlt={(tpl) => tpl.name || 'Template'}
          isLoading={loading}
          loadMore={hasMore ? handleLoadMore : null}
          shadowEnabled={true}
          onSelect={handleSelectTemplate}
        />
      </div>
    </div>
  );
}

export const CanvaTemplatesSection = {
  name: 'templates',
  Tab: TemplatesSection.Tab,
  Panel: CanvaTemplatesPanel,
};
