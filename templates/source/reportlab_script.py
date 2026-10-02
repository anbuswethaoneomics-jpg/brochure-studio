<USER_REQUEST>
import math
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER

# ---- fonts: Caladea (serif headings) + Carlito (body). Change paths if needed.
CX = '/usr/share/fonts/truetype/crosextra/'
for n, f in [('S','Caladea-Regular'),('S-B','Caladea-Bold'),('S-I','Caladea-Italic'),('S-BI','Caladea-BoldItalic'),
             ('C','Carlito-Regular'),('C-B','Carlito-Bold'),('C-I','Carlito-Italic'),('C-BI','Carlito-BoldItalic')]:
    pdfmetrics.registerFont(TTFont(n, CX+f+'.ttf'))
registerFontFamily('C', normal='C', bold='C-B', italic='C-I', boldItalic='C-BI')
registerFontFamily('S', normal='S', bold='S-B', italic='S-I', boldItalic='S-BI')

CREAM, CARD, MINT = HexColor('#FBF7EF'), HexColor('#FFFFFF'), HexColor('#E7F1F1')
INK, TEAL, TEAL2 = HexColor('#0B3C49'), HexColor('#16808F'), HexColor('#BFDDE1')
CORAL, BLUE, GREEN = HexColor('#E2574C'), HexColor('#0793EB'), HexColor('#33A015')
TEXT, MUTED, LINE = HexColor('#34454F'), HexColor('#78878F'), HexColor('#E4DDCF')
W, H = 297*mm, 210*mm
OUT_W = [97*mm, 100*mm, 100*mm]   # outside: flap | back | front
IN_W  = [100*mm, 100*mm, 97*mm]   # inside : A | B | C
PAD = 9*mm

def st(name, font='C', size=9, lead=None, color=TEXT, align=TA_LEFT, **kw):
    return ParagraphStyle(name, fontName=font, fontSize=size, leading=lead or size*1.35,
                          textColor=color, alignment=align, **kw)
def measure(text, style, w):
    return Paragraph(text, style).wrap(w, 1000*mm)[1]
def para(c, text, style, x, ytop, w):
    p = Paragraph(text, style); _, h = p.wrap(w, 1000*mm); p.drawOn(c, x, ytop-h); return ytop-h

def bg(c, x, w, col=CREAM):
    c.setFillColor(col); c.rect(x, 0, w, H, stroke=0, fill=1)

def dots3(c, xr, y, r=1.15*mm):          # brand motif: three dots, right-aligned at xr
    for i, col in enumerate((GREEN, BLUE, CORAL)):
        c.setFillColor(col); c.circle(xr-i*3.6*mm, y, r, stroke=0, fill=1)

def footer(c, x0, pw, label='ONEOMICS'):
    c.setFillColor(MUTED); c.setFont('C-B', 6.5)
    c.drawString(x0+PAD, 6*mm, label)
    dots3(c, x0+pw-PAD-2*mm, 6.8*mm)

def logo(c, x, y, w):
    h = w*304/1172; c.drawImage('logo.png', x, y, w, h, mask='auto'); return h

def title(c, kicker, text, x, ytop, w, size=22):
    y = para(c, kicker.upper(), st('k','C-B',7.2,9,TEAL,charSpace=1.8), x, ytop, w)-1.5*mm
    y = para(c, text, st('t','S-B',size,size*1.15,INK), x, y, w)
    c.setStrokeColor(CORAL); c.setLineWidth(1.4); c.line(x, y-2.6*mm, x+11*mm, y-2.6*mm)
    c.setFillColor(CORAL); c.circle(x+13*mm, y-2.6*mm, 0.9*mm, stroke=0, fill=1)
    return y-7.5*mm

def arch_path(c, cx, y0, w, ytop):
    r = w/2; p = c.beginPath()
    p.moveTo(cx-r, y0); p.lineTo(cx+r, y0); p.lineTo(cx+r, ytop-r)
    p.arcTo(cx-r, ytop-2*r, cx+r, ytop, startAng=0, extent=180)
    p.lineTo(cx-r, y0); p.close(); return p

def dot_helix(c, cx, y0, y1, amp, period, phase=0.0):
    n = int((y1-y0)/(1.5*mm))
    for i in range(n+1):
        y = y0+(y1-y0)*i/n
        a = 2*math.pi*(y-y0)/period+phase
        s, d = math.sin(a), math.cos(a)
        x1, x2 = cx+amp*s, cx-amp*s
        if i % 2 == 0:
            c.setStrokeColor(TEAL2); c.setLineWidth(0.7); c.line(x1, y, x2, y)
        # depth: larger dot when "in front"
        for x, col, dd in ((x1, TEAL, d), (x2, CORAL, -d)):
            r = (1.2+0.8*dd)*mm*0.9
            c.setFillColor(col); c.circle(x, y, max(r, 0.35*mm), stroke=0, fill=1)

# ================================================================ OUTSIDE
def outside(c):
    xf, xb, xc = 0, OUT_W[0], OUT_W[0]+OUT_W[1]

    # ---------- flap: About, stats, mission, vision
    bg(c, xf, OUT_W[0])
    x, w = xf+PAD, OUT_W[0]-2*PAD-2*mm
    logo(c, x, H-PAD-6.5*mm, 30*mm)
    y = title(c, 'Who we are', 'About<br/>ONEOMICS', x, H-PAD-17*mm, w)
    y = para(c, 'ONEOMICS Private Limited is a genomics company offering one connected portfolio: '
        '<b>sequencing services</b>, <b>sample collection and stabilization products</b>, '
        '<b>nucleic-acid extraction and library-prep kits</b>, and <b>bioinformatics software</b>.',
        st('b','C',9.2,12.8), x, y, w)-5*mm
    gap = 2.5*mm; tw = (w-2*gap)/3
    for i, (num, lab, col) in enumerate([('11','sequencing<br/>service lines',TEAL),('13','kits &amp;<br/>reagents',CORAL),('3','Lasergene<br/>modules',BLUE)]):
        tx = x+i*(tw+gap)
        c.setFillColor(CARD); c.setStrokeColor(LINE); c.setLineWidth(0.6)
        c.roundRect(tx, y-20*mm, tw, 20*mm, 2.5*mm, stroke=1, fill=1)
        c.setFillColor(col); c.setFont('S-B', 19); c.drawCentredString(tx+tw/2, y-9*mm, num)
        para(c, lab, st('sl','C',7.2,8.8,MUTED,align=TA_CENTER), tx, y-11.2*mm, tw)
    y -= 27*mm
    for ttl, body, icon in [
        ('Our Mission','To make high-quality genomic science accessible through reliable sequencing, robust sample-stabilization products and dependable molecular tools.','m'),
        ('Our Vision','To be a trusted partner in genomics, enabling discoveries that advance human health, agriculture and the environment.','v')]:
        cx, cy = x+6.5*mm, y-7*mm
        c.setFillColor(MINT); c.circle(cx, cy, 6.5*mm, stroke=0, fill=1)
        c.setStrokeColor(TEAL); c.setLineWidth(1.1); c.setFillColor(TEAL)
        if icon == 'm':
            c.circle(cx, cy, 4*mm, stroke=1, fill=0); c.circle(cx, cy, 2*mm, stroke=1, fill=0); c.circle(cx, cy, 0.7*mm, stroke=0, fill=1)
        else:
            c.ellipse(cx-4.4*mm, cy-2.6*mm, cx+4.4*mm, cy+2.6*mm, stroke=1, fill=0); c.circle(cx, cy, 1.4*mm, stroke=0, fill=1)
        yy = para(c, ttl, st('mt','S-B',12.5,15,INK), x+16*mm, y-1*mm, w-16*mm)-1*mm
        yy = para(c, body, st('mb','C',8.8,12), x+16*mm, yy, w-16*mm)
        y = min(yy, y-14*mm)-6*mm
    footer(c, xf, OUT_W[0])

    # ---------- back: Lasergene + contact
    bg(c, xb, OUT_W[1])
    x, w = xb+PAD, OUT_W[1]-2*PAD
    y = title(c, 'Software', 'DNASTAR<br/>Lasergene', x, H-PAD-1*mm, w)
    y = para(c, 'The trusted desktop suite for sequence analysis, genome assembly and protein research, available through ONEOMICS.',
             st('b','C',9.2,12.8), x, y, w)-4*mm
    for num, t, d in [('1','Molecular Biology Module','Sequence viewing, primer design, cloning and DNA/RNA analysis.'),
                      ('2','Genomics Module','Assembly, alignment and analysis of next-generation sequencing data.'),
                      ('3','Proteomics Module','Protein sequence analysis, structure prediction and visualization.')]:
        c.setStrokeColor(LINE); c.setLineWidth(0.6); c.line(x, y, x+w, y)
        c.setFillColor(TEAL2); c.setFont('S-B', 30); c.drawString(x, y-11.5*mm, num)
        yy = para(c, t, st('lt','C-B',10.5,13,INK), x+11*mm, y-3*mm, w-11*mm)-0.8*mm
        yy = para(c, d, st('ld','C',8.6,11.4), x+11*mm, yy, w-11*mm)
        y = min(yy, y-14*mm)-3*mm
    # contact block
    by0, bh = 14*mm, y-14*mm-3*mm
    c.setFillColor(MINT); c.roundRect(x-3*mm, by0, w+6*mm, bh, 4*mm, stroke=0, fill=1)
    ix, iw = x+2*mm, w-4*mm
    yy = H*0+by0+bh-5*mm
    yy = para(c, 'Let\u2019s talk', st('gt','S-B',14,16,INK), ix, yy, iw)-1*mm
    yy = para(c, 'Tell us about your project, sample type or software needs.', st('gs','C',8.6,11.4,MUTED), ix, yy, iw)-3.5*mm
    for lab, val in [('WEB','www.[your-website].com'),('EMAIL','[info@your-domain.com]'),
                     ('PHONE','[+91 00000 00000]'),('ADDRESS','[Company address, City, State, PIN]')]:
        para(c, lab, st('cl','C-B',6.6,9,TEAL,charSpace=1.2), ix, yy, 16*mm)
        yy = para(c, val, st('cv','C',9,11.6), ix+15*mm, yy+0.7*mm, iw-15*mm)-2*mm
    logo(c, ix, by0+5*mm, 30*mm)
    footer(c, xb, OUT_W[1])

    # ---------- front cover
    bg(c, xc, OUT_W[2])
    cx = xc+OUT_W[2]/2; aw = 78*mm; ay0, aytop = 80*mm, 172*mm
    c.saveState()
    c.setFillColor(MINT); c.drawPath(arch_path(c, cx, ay0, aw, aytop), stroke=0, fill=1)
    c.clipPath(arch_path(c, cx, ay0, aw, aytop), stroke=0, fill=0)
    c.setStrokeColor(white); c.setLineWidth(1.2)
    for r in (22*mm, 31*mm, 40*mm, 49*mm):
        c.setStrokeAlpha(0.8); c.circle(cx, ay0+8*mm, r, stroke=1, fill=0)
    c.setStrokeAlpha(1)
    dot_helix(c, cx, ay0-2*mm, aytop+2*mm, 17*mm, 52*mm, 0.5)
    c.restoreState()
    c.setStrokeColor(TEAL2); c.setLineWidth(0.8)
    r = aw/2+3.5*mm; c.saveState(); p = arch_path(c, cx, ay0, aw+7*mm, aytop+3.5*mm); c.drawPath(p, stroke=1, fill=0); c.restoreState()
    x, w = xc+PAD+1*mm, OUT_W[2]-2*PAD-2*mm
    logo(c, x, H-PAD-12.5*mm, 52*mm)
    y = para(c, 'Every sample<br/><font name="S-BI" color="#E2574C">tells a story.</font>', st('ct','S-B',25,29,INK), x, 70*mm, w)-3*mm
    para(c, 'Sequencing services, sample preservation and extraction kits, and DNASTAR Lasergene software.',
         st('cs','C',9.4,12.8), x, y, w*0.92)
    fy = 14*mm; fx = x
    for t, col in [('Sequencing', CORAL), ('Kits', BLUE), ('Software', GREEN)]:
        c.setFillColor(col); c.circle(fx+1*mm, fy+1.1*mm, 1*mm, stroke=0, fill=1)
        c.setFillColor(INK); c.setFont('C-B', 8.5); c.drawString(fx+3.4*mm, fy, t)
        fx += pdfmetrics.stringWidth(t, 'C-B', 8.5)+9*mm

# ================================================================ INSIDE
def card(c, x, ytop, w, num, name, subs, col):
    pad = 3.6*mm; tx = x+pad+10*mm; tw = w-pad*2-10*mm
    sub = ' <font color="#E2574C">\u2022</font> '.join(subs)
    nh = measure(name, st('cn','C-B',10.8,13,INK), tw)
    sh = measure(sub, st('cs','C',8.7,11.6), tw) if subs else 0
    h = pad*2+nh+(sh+1.2*mm if subs else 0)
    h = max(h, 11.5*mm)
    c.setFillColor(CARD); c.setStrokeColor(LINE); c.setLineWidth(0.6)
    c.roundRect(x, ytop-h, w, h, 2.8*mm, stroke=1, fill=1)
    c.setFillColor(col); c.setFont('S-B', 17); c.drawString(x+pad, ytop-pad-4.2*mm, num)
    yy = para(c, name, st('cn','C-B',10.8,13,INK), tx, ytop-pad, tw)
    if subs: para(c, sub, st('cs','C',8.7,11.6), tx, yy-1.2*mm, tw)
    return ytop-h-2.6*mm

def prod_panel(c, x0, pw):
    bg(c, x0, pw, MINT)
    x, w = x0+PAD, pw-2*PAD-2*mm
    y = title(c, 'Kits &amp; reagents', 'Our Range<br/>of Products', x, H-PAD-1*mm, w)
    groups = [
      ('Collect &amp; stabilize', CORAL, [
        ('ONESpit™','Zero-prep saliva collection; DNA stable 1+ year at room temperature.'),
        ('ONEasy™','Faecal collection &amp; preservation; room-temperature transport up to 2 years*.'),
        ('NucleoGUARD™','RNA stabilization buffer.'),
        ('RNAguard™','Ambient shipping of total RNA.'),
        ('ProteinGUARD™','Ambient shipping of protein.'),
        ('SoilGUARD™','Soil stabilization buffer.')]),
      ('Extract', BLUE, [
        ('ONEMag™ Rapid Universal DNA','Under 30 minutes, from diverse sample types.'),
        ('ONEMag™ Rapid Soil DNA','Efficient removal of humic acids.'),
        ('ONEMag™ Rapid Plant DNA','For polysaccharide- and polyphenol-rich tissue.'),
        ('ONEMag™ Rapid Soil RNA','High-integrity RNA from soil samples.')]),
      ('Amplify &amp; sequence', GREEN, [
        ('ONENext™ 16S (V3–V4)','Library prep kit for Illumina.'),
        ('ONENext™ 16S (V1–V9)','Full-length library prep kit for ONT.'),
        ('2X Taq Plus PCR Master Mix','Ready-to-use, with RED dye for direct gel loading.')]),
    ]
    n = 1
    for g, col, items in groups:
        c.setFillColor(col); c.circle(x+1.2*mm, y-2.1*mm, 1.2*mm, stroke=0, fill=1)
        c.setFillColor(INK); c.setFont('S-BI', 11.5); c.drawString(x+4.2*mm, y-3.3*mm, g.replace('&amp;','&'))
        c.setStrokeColor(TEAL2); c.setLineWidth(0.7)
        gw = pdfmetrics.stringWidth(g.replace('&amp;','&'), 'S-BI', 11.5)
        c.line(x+7*mm+gw, y-2.2*mm, x+w, y-2.2*mm)
        y -= 6.2*mm
        for name, desc in items:
            c.setFillColor(col); c.setFont('S-B', 9); c.drawString(x, y-3*mm, f'{n:02d}')
            yy = para(c, f'<font name="C-B" size="9.3" color="#0B3C49">{name}</font><br/>{desc}', st('pi','C',8.5,11), x+7.5*mm, y, w-7.5*mm)
            y = yy-1.3*mm; n += 1
        y -= 1.6*mm
    para(c, '*Under validated storage conditions. Refer to the product datasheet.', st('fn','C-I',6.5,8.5,MUTED), x, 13*mm, w)
    footer(c, x0, pw)

def inside(c):
    xa, xb, xc = 0, IN_W[0], IN_W[0]+IN_W[1]
    # A
    bg(c, xa, IN_W[0]); x, w = xa+PAD, IN_W[0]-2*PAD-2*mm
    y = title(c, 'Next generation sequencing', 'Sequencing<br/>Services', x, H-PAD-1*mm, w)
    for num, name, subs, col in [
        ('01','Whole Genome Sequencing',['De novo Sequencing','Reference-Based Sequencing','Hi-C Genome Sequencing','Chloroplast Genome Sequencing','Mitochondrial Genome Sequencing'],CORAL),
        ('02','Whole Exome Sequencing',[],TEAL),
        ('03','Epigenetics',['Whole Genome Bisulfite Sequencing','Whole Genome Methylation Sequencing'],BLUE),
        ('04','Genotyping By Sequencing',[],GREEN),
        ('05','Metagenome Sequencing',['16S (V3–V4) Metagenome Sequencing','16S (V1–V9) rRNA Sequencing','ITS Metagenome Sequencing','18S Metagenome Sequencing','Shotgun Metagenome Sequencing','Custom Amplicon Sequencing','Meta-Barcoding'],CORAL)]:
        y = card(c, x, y, w, num, name, subs, col)
    footer(c, xa, IN_W[0])
    # B
    bg(c, xb, IN_W[1]); x, w = xb+PAD+1*mm, IN_W[1]-2*PAD-2*mm
    y = title(c, 'Next generation sequencing', 'Sequencing<br/>Services <font name="S-I" color="#16808F">(cont.)</font>', x, H-PAD-1*mm, w)
    for num, name, subs, col in [
        ('06','Transcriptome Sequencing',['Whole Transcriptome (mRNA + lncRNA)','mRNA Sequencing','Small RNA Sequencing','Metatranscriptome Sequencing','Dual RNA Sequencing','Single Cell RNA Sequencing','Isoform Sequencing (RNA)'],TEAL),
        ('07','Long Read Sequencing',['PacBio Sequencing','Nanopore Sequencing'],BLUE),
        ('08','qRT-PCR Validation',[],GREEN),
        ('09','SSR Marker Validation',[],CORAL),
        ('10','Taurine and Telomere Assay',[],TEAL),
        ('11','ChIP-Sequencing',[],BLUE)]:
        y = card(c, x, y, w, num, name, subs, col)
    bh = 27*mm; by = 16*mm
    c.setFillColor(MINT); c.roundRect(x, by, w, bh, 3.5*mm, stroke=0, fill=1)
    yy = para(c, 'Have a custom project?', st('cp','S-B',11.5,14,INK), x+5*mm, by+bh-4.5*mm, w-10*mm)-1*mm
    para(c, 'Share your sample type and research goal and our team will help you choose the right sequencing approach.',
         st('cb','C',8.7,11.4), x+5*mm, yy, w-10*mm)
    footer(c, xb, IN_W[1])
    # C
    prod_panel(c, xc, IN_W[2])

c = canvas.Canvas('ONEOMICS_Trifold_Brochure_v2.pdf', pagesize=(W, H))
c.setTitle('ONEOMICS Tri-Fold Brochure (Design 2)'); c.setAuthor('ONEOMICS Private Limited')
outside(c); c.showPage(); inside(c); c.showPage(); c.save() also put this as hird brochure ok in the Tri-fold Brochures
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-10-01T14:34:16+05:30.

The user's current state is as follows:
Active Document: /home/sowmya-bioinfo/Desktop/Anbu swetha/brochure-studio/client/src/styles.css (LANGUAGE_UNSPECIFIED)
Cursor is on line: 72
Other open documents:
- /home/sowmya-bioinfo/Desktop/Anbu swetha/brochure-studio/client/src/templates.js (LANGUAGE_UNSPECIFIED)
- /home/sowmya-bioinfo/Desktop/Anbu swetha/brochure-studio/client/src/components/StudioSidebar.jsx (LANGUAGE_UNSPECIFIED)
- /home/sowmya-bioinfo/Desktop/Anbu swetha/brochure-studio/client/src/StudioApp.jsx (LANGUAGE_UNSPECIFIED)
- /home/sowmya-bioinfo/Desktop/Anbu swetha/brochure-studio/client/src/StudioAppMain.jsx (LANGUAGE_UNSPECIFIED)
- /home/sowmya-bioinfo/Desktop/Anbu swetha/brochure-studio/client/src/components/PropsBar.jsx (LANGUAGE_UNSPECIFIED)
</ADDITIONAL_METADATA>