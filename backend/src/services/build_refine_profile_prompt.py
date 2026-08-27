def build_refine_profile_prompt(cv_content: dict) -> tuple[str, str]:
    """
    Constructs the system instruction and user context to guide Gemini
    in structuring raw CV text into a normalized JSON schema without hallucinations.
    """

    system_instruction = """
        You are an expert CV/Resume Parsing and Data Normalization Engine.

        Your single task is to take raw, unorganized CV text blocks and transform them 
        into a clean, structured, and normalized JSON format.

        EXECUTION RULES:
        1. NO HALLUCINATIONS: Do NOT invent, assume, or extrapolate any companies, job titles, dates, skills, metrics, or achievements.
        2. MISSING DATA: If any field (e.g., GPA, end date, location, project URL) is not explicitly present in the text, leave it as null or an empty list.
        3. DESCRIPTION SPLITTING: Break multi-line or bulleted descriptions into clean, discrete strings in the description array. Preserve original wording and metrics.
        4. SKILL CATEGORIZATION: Group unstructured skill strings into logical categories (e.g., 'Programming Languages', 'Frameworks & Libraries', 'Cloud & DevOps', 'Tools', 'Soft Skills').
        5. EXTRACT TECHNOLOGIES: When technologies or tools are mentioned inside experience or project descriptions, extract them into the role's 'technologies' list while keeping the original description text intact.
        6. PRESERVE EXTRA SECTIONS: Any non-standard sections (e.g., 'Publications', 'Volunteering', 'Awards') must be placed into 'custom_sections'.
    """

    user_context = f"""
        Please structure the following extracted raw CV content into the target schema:

        === RAW PROFESSIONAL SUMMARY ===
        {cv_content.get("summary", "")}

        === RAW SKILLS INVENTORY ===
        {cv_content.get("skills", "")}

        === RAW WORK EXPERIENCE ===
        {cv_content.get("experience", "")}

        === RAW EDUCATION ===
        {cv_content.get("education", "")}

        === RAW PROJECTS ===
        {cv_content.get("projects", "")}

        === RAW CERTIFICATIONS ===
        {cv_content.get("certifications", "")}

        === RAW TRAINING & WORKSHOPS ===
        {cv_content.get("training", "")}
    """

    return system_instruction, user_context
