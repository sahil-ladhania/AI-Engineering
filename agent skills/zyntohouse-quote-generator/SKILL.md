---
name: zyntohouse-quote
description: >
  Generate a professional, branded 2-page PDF client quote/proposal for Zyntohouse.
  Use this skill whenever Sahil says things like "generate a quote", "new client quote",
  "create a proposal", "client ka quote bnao", "quote ready karo", "quote bnana hai",
  "new project quote", or provides client details and asks for a quote document.
  Always use this skill for any quote, proposal, or pricing document for Zyntohouse clients.
---

# Zyntohouse Quote Generator

Generates a branded, professional **2-page PDF quote** for Zyntohouse clients.

```
Page 1 → Header · Prepared For/From · Project Scope · Timeline · Phase-wise Payment + AMC/Note
Page 2 → Terms & Conditions · Acceptance / Signature
```

---

## Step 1 — Collect Details (ask in one message)

```
CLIENT
• Name
• Company name
• Email

PROJECT
• What are we building? (2–3 lines)
• Deliverables list (each item we hand over)

TIMELINE
Each phase needs:
  - Phase name       e.g. "Phase 1 — Discovery"
  - Duration         e.g. "1 week"
  - What's delivered e.g. "Wireframes, DB schema"
  - Notes            e.g. "Client review required"

PHASE-WISE PAYMENT
Each milestone needs:
  - Phase name       e.g. "Phase 1 — Advance"
  - Description      e.g. "Project kickoff & design"
  - Due when         e.g. "On signing", "End of week 3", "On final delivery"
  - Amount in Rs.    plain number only

OTHER
• Payment note (optional) — e.g. "UPI/bank transfer only"
• Any custom terms? (defaults used if not provided)
• Quote number (default: ZH-YYYY-NNN)
• Valid until (default: issue date + 14 days)
```

> Infer what you can. Only ask for what's genuinely missing. Client email is required.

---

## Step 2 — Build JSON

```json
{
  "quote_number": "ZH-2026-001",
  "issue_date": "DD Month YYYY",
  "valid_until": "DD Month YYYY",
  "agency_tagline": "Building Digital Products for Growing Businesses",
  "contact_name": "Sahil — Founder",
  "client": {
    "name": "Client Name",
    "company": "Company Name",
    "email": "client@email.com"
  },
  "project_description": "Short 2–3 line project summary.",
  "deliverables": [
    "Deliverable 1",
    "Deliverable 2"
  ],
  "timeline": [
    {
      "phase": "Phase 1 — Discovery",
      "duration": "1 week",
      "deliverable": "Wireframes, DB schema",
      "notes": "Client review required"
    }
  ],
  "phases": [
    {
      "phase": "Phase 1 — Advance",
      "description": "Project kickoff & discovery",
      "due_when": "On agreement signing",
      "amount": 50000
    },
    {
      "phase": "Phase 2 — Midpoint",
      "description": "Backend & frontend delivery",
      "due_when": "End of week 3",
      "amount": 40000
    },
    {
      "phase": "Phase 3 — Final",
      "description": "Full delivery & handover",
      "due_when": "On final delivery",
      "amount": 28000
    }
  ],
  "payment_note": "Payments via UPI or bank transfer. Next phase begins only after current phase payment is cleared.",
  "terms": [
    "This quote is valid for 14 days from the date of issue.",
    "Advance payment required before work commences. No work begins without cleared payment.",
    "Any changes to scope after sign-off will be quoted separately as a change request.",
    "Client must provide all content (text, images, brand assets) within 3 days of kickoff.",
    "Zyntohouse retains the right to showcase this project in our portfolio unless an NDA is signed.",
    "Hosting, domain, and third-party API costs are not included unless explicitly stated.",
    "Source code is handed over only after full payment is received.",
    "Post-launch support covers bug fixes only. New features are billed separately."
  ]
}
```

> All `amount` values are plain integers (no ₹ symbol). No GST field needed.

---

## Step 3 — Generate PDF

```bash
pip install reportlab --break-system-packages -q  # only if not installed
python <skill_path>/scripts/generate_quote.py '<JSON>' /mnt/user-data/outputs/Quote_<quote_number>_<ClientName>.pdf
```

- Wrap JSON in single quotes in bash
- No spaces in filename — use underscores
- Always output to `/mnt/user-data/outputs/`
- Confirm `✅ Quote generated:` in stdout

---

## Step 4 — Present

Use `present_files` with the PDF path. Summarize:
- Quote number
- Total project value
- Valid until date

---

## Defaults Reference

| Field | Default |
|-------|---------|
| `agency_tagline` | "Building Digital Products for Growing Businesses" |
| `contact_name` | "Sahil — Founder" |
| `valid_until` | Issue date + 14 days |
| `quote_number` | ZH-YYYY-001 (increment if multiple quotes) |
| `terms` | 8 standard terms above |
| `payment_note` | UPI/bank transfer note |

---

## Errors

| Error | Fix |
|-------|-----|
| `ModuleNotFoundError: reportlab` | `pip install reportlab --break-system-packages` |
| JSON parse error | Re-escape JSON, no unescaped quotes inside strings |
| Script not found | Use absolute path to `scripts/generate_quote.py` |
