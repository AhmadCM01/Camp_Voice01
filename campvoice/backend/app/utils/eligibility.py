import re

MATRIC_PATTERN = re.compile(r"^U(?P<year>\d{2})(?P<dept>CO|C0)(?P<num>\d{4})$", re.IGNORECASE)

YEAR_LEVEL = {
    "19": "500",
    "21": "400",
    "23": "300",
    "24": "200",
    "26": "100",
}

def normalize_level(level: str) -> str:
    l = (level or "").strip()
    if l.endswith("L"):
        l = l[:-1]
    return l

def is_comp_engineering(department: str, faculty: str) -> bool:
    d = (department or "").strip().lower()
    f = (faculty or "").strip().lower()
    return ("computer engineering" in d) and ("engineering" in f)

def validate_comp_eng_eligibility(matric_no: str, level: str, department: str, faculty: str) -> None:
    if not matric_no:
        raise ValueError("Matric number is required for this phase.")

    if not is_comp_engineering(department, faculty):
        raise ValueError("Access is restricted to Computer Engineering students for this phase.")

    m = MATRIC_PATTERN.match(matric_no.strip())
    if not m:
        raise ValueError("Invalid matric number format. Expected UYYCO#### (e.g., U21CO1234).")

    year = m.group("year")
    num = int(m.group("num"))

    if year not in YEAR_LEVEL:
        raise ValueError("This matric year is not eligible for this phase.")

    required_level = YEAR_LEVEL[year]
    if normalize_level(level) != required_level:
        raise ValueError(f"Invalid level for matric year U{year}. Expected {required_level} level.")

    if year == "19":
        if num < 1000 or num > 2099:
            raise ValueError("U19CO matric numbers must be within U19CO1000 to U19CO20xx for this phase.")

