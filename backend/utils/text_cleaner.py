"""Shared text-normalization helpers used by both resume and JD parsers."""
import re

BULLET_CHARS = "•▪◦●○-–—*·∙"


def normalize_whitespace(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def strip_bullets(line: str) -> str:
    return line.lstrip(BULLET_CHARS + " ").strip()


def split_lines(text: str):
    return [strip_bullets(l) for l in text.split("\n") if l.strip()]


def tokenize_words(text: str):
    return re.findall(r"[A-Za-z][A-Za-z0-9+.#/-]*", text.lower())


STOPWORDS = {
    "the", "a", "an", "and", "or", "of", "to", "in", "for", "with", "on", "at",
    "by", "from", "as", "is", "are", "was", "were", "be", "been", "being",
    "this", "that", "these", "those", "it", "its", "we", "you", "your", "our",
    "will", "shall", "can", "could", "should", "would", "may", "might", "must",
    "have", "has", "had", "do", "does", "did", "not", "no", "but", "if", "than",
    "then", "so", "such", "into", "about", "above", "after", "again", "all",
    "any", "because", "between", "both", "each", "few", "more", "most", "other",
    "some", "than", "too", "very", "etc", "per", "via",
}
