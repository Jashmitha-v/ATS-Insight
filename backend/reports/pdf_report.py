"""Generate a downloadable PDF ATS report using ReportLab."""
import io
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

PRIMARY_PURPLE = colors.HexColor("#7C3AED")
PRIMARY_BLUE = colors.HexColor("#2563EB")
DARK_BG = colors.HexColor("#111827")
LIGHT_GREY = colors.HexColor("#F3F4F6")


def _build_styles():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        name="ReportTitle", fontSize=22, leading=26, textColor=PRIMARY_PURPLE,
        spaceAfter=4, fontName="Helvetica-Bold",
    ))
    styles.add(ParagraphStyle(
        name="ReportSubtitle", fontSize=10, leading=14, textColor=colors.grey,
        spaceAfter=18,
    ))
    styles.add(ParagraphStyle(
        name="SectionHeading", fontSize=14, leading=18, textColor=PRIMARY_BLUE,
        spaceBefore=16, spaceAfter=8, fontName="Helvetica-Bold",
    ))
    styles.add(ParagraphStyle(
        name="BodySmall", fontSize=9.5, leading=14,
    ))
    return styles


def _score_table(sub_scores, weights, styles):
    data = [["Category", "Score", "Weight"]]
    for key, value in sub_scores.items():
        data.append([key.replace("_", " ").title(), f"{value}/100", f"{int(weights[key] * 100)}%"])

    table = Table(data, colWidths=[7 * cm, 4 * cm, 4 * cm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PRIMARY_PURPLE),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9.5),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT_GREY]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E5E7EB")),
        ("ALIGN", (1, 0), (-1, -1), "CENTER"),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    return table


def _keyword_table(detail, styles):
    matched = ", ".join(detail["matched"][:15]) or "None"
    missing = ", ".join(detail["missing"][:15]) or "None"
    data = [
        ["Matched Keywords", Paragraph(matched, styles["BodySmall"])],
        ["Missing Keywords", Paragraph(missing, styles["BodySmall"])],
    ]
    table = Table(data, colWidths=[4 * cm, 11 * cm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, 0), colors.HexColor("#DCFCE7")),
        ("BACKGROUND", (0, 1), (0, 1), colors.HexColor("#FEE2E2")),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E5E7EB")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    return table


def generate_pdf_report(resume_data: dict, jd_data: dict, score_result: dict, suggestions: list) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        topMargin=2 * cm, bottomMargin=2 * cm, leftMargin=2 * cm, rightMargin=2 * cm,
    )
    styles = _build_styles()
    elements = []

    contact = resume_data["contact"]
    elements.append(Paragraph("ATS Insight — Resume Analysis Report", styles["ReportTitle"]))
    elements.append(Paragraph(
        f"Generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}",
        styles["ReportSubtitle"],
    ))

    elements.append(Paragraph("Candidate Details", styles["SectionHeading"]))
    elements.append(Paragraph(
        f"<b>Name:</b> {contact.get('name') or 'Not detected'}<br/>"
        f"<b>Email:</b> {contact.get('email') or 'Not detected'}<br/>"
        f"<b>Phone:</b> {contact.get('phone') or 'Not detected'}<br/>"
        f"<b>LinkedIn:</b> {contact.get('linkedin') or 'Not detected'}<br/>"
        f"<b>GitHub:</b> {contact.get('github') or 'Not detected'}",
        styles["BodySmall"],
    ))

    elements.append(Paragraph("Overall ATS Score", styles["SectionHeading"]))
    elements.append(Paragraph(
        f"<font size=28 color='#7C3AED'><b>{score_result['overall_score']}/100</b></font>",
        styles["BodySmall"],
    ))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("Score Breakdown", styles["SectionHeading"]))
    elements.append(_score_table(score_result["sub_scores"], score_result["weights"], styles))

    elements.append(Paragraph("Keyword Analysis", styles["SectionHeading"]))
    elements.append(_keyword_table(score_result["keywords_detail"], styles))

    elements.append(Paragraph("Recommendations", styles["SectionHeading"]))
    for s in suggestions[:10]:
        elements.append(Paragraph(
            f"<b>[{s['priority'].upper()}] {s['title']}</b><br/>{s['description']}<br/>"
            f"<i>Why: {s['reason']}</i>",
            styles["BodySmall"],
        ))
        elements.append(Spacer(1, 6))

    doc.build(elements)
    buffer.seek(0)
    return buffer.getvalue()
