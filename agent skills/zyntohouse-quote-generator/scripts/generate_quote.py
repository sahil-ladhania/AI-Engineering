"""
Zyntohouse Quote Generator v2
Usage: python generate_quote.py '<json_data>' <output_path>
"""

import sys
import json
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_RIGHT, TA_CENTER, TA_LEFT

# ── Brand ─────────────────────────────────────────────────────────────────────
EMERALD      = colors.HexColor('#10b981')
EMERALD_DARK = colors.HexColor('#059669')
DARK_BG      = colors.HexColor('#18181b')
DARK_CARD    = colors.HexColor('#27272a')
OFF_WHITE    = colors.HexColor('#fafafa')
MUTED        = colors.HexColor('#71717a')
LIGHT_BORDER = colors.HexColor('#e4e4e7')
LIGHT_GREEN  = colors.HexColor('#f0fdf4')
TEXT_DARK    = colors.HexColor('#18181b')
TEXT_BODY    = colors.HexColor('#3f3f46')
ZINC_50      = colors.HexColor('#fafafa')
ZINC_100     = colors.HexColor('#f4f4f5')

W, H       = A4               # 595.27 x 841.89 pt
HEADER_H   = 52 * mm
LEFT_M     = 20 * mm
RIGHT_M    = 20 * mm
UW         = W - LEFT_M - RIGHT_M   # usable width


# ── Styles ────────────────────────────────────────────────────────────────────
def S():
    return {
        'section': ParagraphStyle('section',
            fontName='Helvetica-Bold', fontSize=9.5,
            textColor=EMERALD, leading=14, spaceBefore=2, spaceAfter=1,
            letterSpacing=0.8),
        'client_name': ParagraphStyle('client_name',
            fontName='Helvetica-Bold', fontSize=15,
            textColor=TEXT_DARK, leading=20),
        'client_sub': ParagraphStyle('client_sub',
            fontName='Helvetica', fontSize=9,
            textColor=TEXT_BODY, leading=12),
        'body': ParagraphStyle('body',
            fontName='Helvetica', fontSize=9,
            textColor=TEXT_BODY, leading=12),
        'deliverable': ParagraphStyle('deliverable',
            fontName='Helvetica', fontSize=9,
            textColor=TEXT_BODY, leading=12, leftIndent=10),
        'label': ParagraphStyle('label',
            fontName='Helvetica-Bold', fontSize=8,
            textColor=EMERALD, leading=11, spaceAfter=1),
        'th': ParagraphStyle('th',
            fontName='Helvetica-Bold', fontSize=8.5,
            textColor=OFF_WHITE, leading=12),
        'td': ParagraphStyle('td',
            fontName='Helvetica', fontSize=8.5,
            textColor=TEXT_BODY, leading=12),
        'td_r': ParagraphStyle('td_r',
            fontName='Helvetica', fontSize=8.5,
            textColor=TEXT_BODY, leading=12, alignment=TA_RIGHT),
        'td_bold': ParagraphStyle('td_bold',
            fontName='Helvetica-Bold', fontSize=8.5,
            textColor=TEXT_DARK, leading=12),
        'td_bold_r': ParagraphStyle('td_bold_r',
            fontName='Helvetica-Bold', fontSize=9,
            textColor=EMERALD, leading=12, alignment=TA_RIGHT),
        'td_total_r': ParagraphStyle('td_total_r',
            fontName='Helvetica-Bold', fontSize=10,
            textColor=EMERALD, leading=13, alignment=TA_RIGHT),
        'terms': ParagraphStyle('terms',
            fontName='Helvetica', fontSize=9,
            textColor=TEXT_BODY, leading=14),
        'muted': ParagraphStyle('muted',
            fontName='Helvetica', fontSize=8,
            textColor=MUTED, leading=12),
        'sig_label': ParagraphStyle('sig_label',
            fontName='Helvetica-Bold', fontSize=8,
            textColor=MUTED, leading=12),
    }


# ── Canvas decorator ──────────────────────────────────────────────────────────
def make_decorator(data):
    def on_page(canv, doc):
        canv.saveState()

        # ── Header band ───────────────────────────────────────────────────────
        canv.setFillColor(DARK_BG)
        canv.rect(0, H - HEADER_H, W, HEADER_H, fill=1, stroke=0)

        # Bottom accent line
        canv.setFillColor(EMERALD)
        canv.rect(0, H - HEADER_H, W, 2.5, fill=1, stroke=0)

        # ── Vertical center of header ─────────────────────────────────────────
        cy = H - HEADER_H / 2   # center Y of header band

        # ── LEFT: Blocks icon ────────────────────────────────────────────────
        bx     = LEFT_M
        bw     = 10 * mm
        bh     = 3 * mm
        bgap   = 2 * mm
        # Total height of 3 bars
        btotal = 3 * bh + 2 * bgap
        # Top bar starts at cy + btotal/2
        b1_y   = cy + btotal / 2 - bh    # top bar bottom-left y
        b2_y   = b1_y - bh - bgap        # mid bar
        b3_y   = b2_y - bh - bgap        # bot bar

        canv.setFillAlpha(1)
        canv.setFillColor(EMERALD)
        canv.roundRect(bx,            b1_y, bw,      bh, 0.7 * mm, fill=1, stroke=0)
        canv.setFillAlpha(0.55)
        canv.roundRect(bx + 3.5 * mm, b2_y, bw,      bh, 0.7 * mm, fill=1, stroke=0)
        canv.setFillAlpha(1)
        canv.roundRect(bx,            b3_y, bw * 0.75, bh, 0.7 * mm, fill=1, stroke=0)

        # ── LEFT: Wordmark ────────────────────────────────────────────────────
        wx = LEFT_M + bw + 4 * mm
        # Wordmark Y: baseline aligned to center (cap height ~ 0.7 * fontSize)
        font_size = 21
        wy = cy - (font_size * 0.35)   # visually centered

        canv.setFillAlpha(1)
        canv.setFont('Helvetica-Bold', font_size)
        canv.setFillColor(EMERALD)
        canv.drawString(wx, wy, 'Z')
        zw = canv.stringWidth('Z', 'Helvetica-Bold', font_size)
        canv.setFillColor(OFF_WHITE)
        canv.drawString(wx + zw, wy, 'yntohouse')

        # Tagline below wordmark
        canv.setFont('Helvetica', 8)
        canv.setFillColor(colors.HexColor('#71717a'))
        tagline = data.get('agency_tagline', 'Building Digital Products for Growing Businesses')
        canv.drawString(wx, wy - 13, tagline)

        # ── RIGHT: Quote info block ───────────────────────────────────────────
        rx = W - RIGHT_M

        # Measure total height of right block to center it
        # Block = "QUOTE" (8pt) + 4px gap + number (22pt) + 4px gap + date (8pt)
        block_h = 10 + 4 + 26 + 4 + 10   # approx pt
        block_top_y = cy + block_h / 2

        # "QUOTE" label
        canv.setFont('Helvetica-Bold', 8)
        canv.setFillColor(EMERALD)
        canv.drawRightString(rx, block_top_y - 8, 'QUOTE')

        # Quote number
        canv.setFont('Helvetica-Bold', 22)
        canv.setFillColor(OFF_WHITE)
        canv.drawRightString(rx, block_top_y - 8 - 4 - 22, f"#{data.get('quote_number', '001')}")

        # Dates
        canv.setFont('Helvetica', 8)
        canv.setFillColor(colors.HexColor('#71717a'))
        issue = data.get('issue_date', '')
        valid = data.get('valid_until', '')
        canv.drawRightString(rx, block_top_y - 8 - 4 - 22 - 4 - 8,
                             f"Issued: {issue}   •   Valid Until: {valid}")

        # ── Footer ────────────────────────────────────────────────────────────
        canv.setStrokeColor(LIGHT_BORDER)
        canv.setLineWidth(0.4)
        canv.line(LEFT_M, 15 * mm, W - RIGHT_M, 15 * mm)
        canv.setFont('Helvetica', 7.5)
        canv.setFillColor(MUTED)
        canv.drawCentredString(W / 2, 9.5 * mm,
            'Zyntohouse  •  zyntohouse.com  •  zyntohouse@gmail.com')
        canv.setFont('Helvetica', 7.5)
        canv.drawRightString(W - RIGHT_M, 9.5 * mm, f"Page {doc.page}")

        canv.restoreState()

    return on_page


# ── Section heading helper ────────────────────────────────────────────────────
def section(title, st):
    return [
        Paragraph(title, st['section']),
        HRFlowable(width='100%', thickness=0.5, color=EMERALD, spaceAfter=5),
    ]


# ── Table style helpers ───────────────────────────────────────────────────────
def base_table_style(extra=None):
    base = [
        ('BACKGROUND', (0, 0), (-1, 0), DARK_BG),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [ZINC_50, ZINC_100]),
        ('GRID', (0, 0), (-1, -1), 0.3, LIGHT_BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]
    if extra:
        base.extend(extra)
    return base


# ── Main ──────────────────────────────────────────────────────────────────────
def generate_quote(data: dict, output_path: str):
    st = S()

    doc = SimpleDocTemplate(
        output_path, pagesize=A4,
        topMargin=HEADER_H + 3 * mm,
        bottomMargin=20 * mm,
        leftMargin=LEFT_M, rightMargin=RIGHT_M,
        title=f"Quote {data.get('quote_number', '')} — {data.get('client', {}).get('name', '')}",
        author='Zyntohouse',
    )

    story = []

    # ════════════════════════════════════════════════════════════════════════════
    # PAGE 1
    # ════════════════════════════════════════════════════════════════════════════

    # ── Prepared For / From ───────────────────────────────────────────────────
    client = data.get('client', {})
    ct = Table([
        [Paragraph('PREPARED FOR', st['section']), Paragraph('FROM', st['section'])],
        [Paragraph(client.get('name', ''), st['client_name']), Paragraph('Zyntohouse', st['client_name'])],
        [Paragraph(client.get('company', ''), st['client_sub']), Paragraph(data.get('contact_name', 'Sahil — Founder'), st['client_sub'])],
        [Paragraph(client.get('email', ''), st['client_sub']), Paragraph('zyntohouse@gmail.com', st['client_sub'])],
    ], colWidths=[UW * 0.55, UW * 0.45])
    ct.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('LINEBELOW', (0, -1), (-1, -1), 0.5, LIGHT_BORDER),
    ]))
    story.append(ct)
    story.append(Spacer(1, 5 * mm))

    # ── Project Scope ─────────────────────────────────────────────────────────
    story.extend(section('PROJECT SCOPE', st))
    story.append(Paragraph(data.get('project_description', ''), st['body']))
    story.append(Spacer(1, 2 * mm))

    deliverables = data.get('deliverables', [])
    if deliverables:
        story.append(Paragraph('Deliverables:', st['label']))
        for d in deliverables:
            story.append(Paragraph(f'→  {d}', st['deliverable']))
    story.append(Spacer(1, 4 * mm))

    # ── Timeline ──────────────────────────────────────────────────────────────
    milestones = data.get('timeline', [])
    if milestones:
        story.extend(section('TIMELINE', st))
        td = [[Paragraph(h, st['th']) for h in ['Phase', 'Duration', 'Deliverable', 'Notes']]]
        for m in milestones:
            td.append([
                Paragraph(m.get('phase', ''), st['td']),
                Paragraph(m.get('duration', ''), st['td']),
                Paragraph(m.get('deliverable', ''), st['td']),
                Paragraph(m.get('notes', '—'), st['td']),
            ])
        t = Table(td, colWidths=[UW * 0.24, UW * 0.15, UW * 0.37, UW * 0.24])
        t.setStyle(TableStyle(base_table_style()))
        story.append(t)
        story.append(Spacer(1, 4 * mm))

    # ── Phase-wise Pricing ────────────────────────────────────────────────────
    phases = data.get('phases', [])
    if phases:
        phase_block = []  # everything goes here, wrapped in KeepTogether

        phase_block.extend(section('PHASE-WISE PAYMENT SCHEDULE', st))

        total = sum(p.get('amount', 0) for p in phases)
        pd_ = [[Paragraph(h, st['th']) for h in ['Phase', 'Description', 'Due When', 'Amount']]]
        for p in phases:
            pd_.append([
                Paragraph(p.get('phase', ''), st['td']),
                Paragraph(p.get('description', ''), st['td']),
                Paragraph(p.get('due_when', ''), st['td']),
                Paragraph(f"Rs. {p.get('amount', 0):,.0f}", st['td_r']),
            ])

        # Total row (no GST)
        pd_.append(['', '', Paragraph('TOTAL', st['td_bold']),
                    Paragraph(f"Rs. {total:,.0f}", st['td_total_r'])])

        p_tbl = Table(pd_, colWidths=[UW * 0.18, UW * 0.34, UW * 0.24, UW * 0.24])
        p_tbl.setStyle(TableStyle(base_table_style([
            ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#ecfdf5')),
            ('LINEABOVE', (0, -1), (-1, -1), 1.5, EMERALD_DARK),
            ('ALIGN', (3, 0), (3, -1), 'RIGHT'),
        ])))
        phase_block.append(p_tbl)
        phase_block.append(Spacer(1, 2 * mm))

        # Payment note + AMC side by side (saves vertical space)
        note = data.get('payment_note', '')
        amc_text = (
            'Zyntohouse offers an optional Annual Maintenance Contract (AMC). '
            'Covers bug fixes, minor updates, uptime monitoring & priority support. '
            'Pricing is customised per project — available on request.'
        )
        combined_tbl = Table([[
            Table([[Paragraph('Payment Note', st['label'])], [Paragraph(note or '—', st['body'])]], colWidths=[UW * 0.46]),
            Table([[Paragraph('AMC', st['label'])], [Paragraph(amc_text, st['body'])]], colWidths=[UW * 0.46]),
        ]], colWidths=[UW * 0.5, UW * 0.5])
        combined_tbl.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 4),
            ('TOPPADDING', (0, 0), (-1, -1), 0),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
        ]))

        # Style inner tables
        inner_note_style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), LIGHT_GREEN),
            ('BOX', (0, 0), (-1, -1), 0.8, EMERALD),
            ('LEFTPADDING', (0, 0), (-1, -1), 7), ('RIGHTPADDING', (0, 0), (-1, -1), 7),
            ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ])
        inner_amc_style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#fffbeb')),
            ('BOX', (0, 0), (-1, -1), 0.8, colors.HexColor('#f59e0b')),
            ('LEFTPADDING', (0, 0), (-1, -1), 7), ('RIGHTPADDING', (0, 0), (-1, -1), 7),
            ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ])

        # Rebuild as flat 2-col layout
        flat_tbl = Table([[
            [Paragraph('Payment Note', st['label']), Spacer(1, 2), Paragraph(note or '—', st['body'])],
            [Paragraph('AMC', st['label']), Spacer(1, 2), Paragraph(amc_text, st['body'])],
        ]], colWidths=[UW * 0.5, UW * 0.5])
        flat_tbl.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BACKGROUND', (0, 0), (0, 0), LIGHT_GREEN),
            ('BOX', (0, 0), (0, 0), 0.8, EMERALD),
            ('BACKGROUND', (1, 0), (1, 0), colors.HexColor('#fffbeb')),
            ('BOX', (1, 0), (1, 0), 0.8, colors.HexColor('#f59e0b')),
            ('LEFTPADDING', (0, 0), (-1, -1), 7),
            ('RIGHTPADDING', (0, 0), (-1, -1), 7),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('INNERGRID', (0, 0), (-1, -1), 0, colors.white),
        ]))
        phase_block.append(flat_tbl)

        # Append phase block directly - content compressed to fit page 1
        story.extend(phase_block)

    # ════════════════════════════════════════════════════════════════════════════
    # PAGE 2 — Terms & Conditions
    # ════════════════════════════════════════════════════════════════════════════
    story.append(PageBreak())

    terms = data.get('terms', [])
    story.extend(section('TERMS & CONDITIONS', st))
    for i, term in enumerate(terms, 1):
        story.append(Paragraph(f'<b>{i}.</b>  {term}', st['terms']))
        story.append(Spacer(1, 2 * mm))

    story.append(Spacer(1, 6 * mm))
    # ── Acceptance follows T&C on page 2 ─────────────────────────────────────

    story.extend(section('ACCEPTANCE', st))
    story.append(Paragraph(
        'By signing below, the client agrees to the project scope, timeline, payment schedule, '
        'and terms outlined in this quote. This document constitutes the formal agreement between '
        'the client and Zyntohouse.', st['body']))
    story.append(Spacer(1, 12 * mm))

    sig_data = [
        [Paragraph('CLIENT SIGNATURE', st['sig_label']), Paragraph('AUTHORIZED BY — ZYNTOHOUSE', st['sig_label'])],
        [Paragraph('', st['body']), Paragraph('', st['body'])],
        [Paragraph('', st['body']), Paragraph('', st['body'])],
        [Paragraph('', st['body']), Paragraph('', st['body'])],
        [Paragraph('Name:  _________________________________', st['body']), Paragraph('Sahil', st['body'])],
        [Paragraph('Date:   _________________________________', st['body']), Paragraph(data.get('issue_date', ''), st['body'])],
        [Paragraph('Company:  ______________________________', st['body']), Paragraph('Zyntohouse', st['body'])],
    ]

    sig_tbl = Table(sig_data, colWidths=[UW * 0.5, UW * 0.5])
    sig_tbl.setStyle(TableStyle([
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('LINEABOVE', (0, 1), (0, 1), 0.8, TEXT_DARK),
        ('LINEABOVE', (1, 1), (1, 1), 0.8, EMERALD),
        ('BACKGROUND', (0, 1), (0, 3), colors.HexColor('#fafafa')),
        ('BACKGROUND', (1, 1), (1, 3), colors.HexColor('#f0fdf4')),
    ]))
    story.append(sig_tbl)

    # ── Build ─────────────────────────────────────────────────────────────────
    decorator = make_decorator(data)
    doc.build(story, onFirstPage=decorator, onLaterPages=decorator)
    print(f"✅ Quote generated: {output_path}")


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python generate_quote.py '<json>' <output.pdf>")
        sys.exit(1)
    data = json.loads(sys.argv[1])
    generate_quote(data, sys.argv[2])
