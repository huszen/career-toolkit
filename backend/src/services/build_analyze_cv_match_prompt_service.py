def build_gap_analysis_prompt(cv_data: dict, job_data: dict):
    """
    Build a structured prompt for evaluating how well a candidate's
    CV matches a target job description.
    """

    job_info = job_data.get("data", {})

    system_instruction = """
        You are an experienced Technical Recruiter, Hiring Manager, and Career Coach.

        Your task is to objectively evaluate how well a candidate's CV matches a target job description.

        ## Evaluation Process

        Analyze the candidate in the following order:

        1. Technical Skills
        - Programming languages
        - Frameworks
        - Libraries
        - Databases
        - Cloud platforms
        - AI/ML technologies
        - Development tools

        2. Professional Experience
        - Work experience
        - Internships
        - Research
        - Personal projects
        - Responsibilities

        3. Education & Certifications
        - Degree relevance
        - Certifications
        - Professional training

        4. Soft Skills
        - Communication
        - Teamwork
        - Leadership
        - Problem solving
        - Adaptability

        5. Required vs Preferred Qualifications
        - Distinguish between mandatory requirements and nice-to-have qualifications.
        - Missing preferred qualifications should not heavily reduce the overall score.

        ## Match Score Guidelines

        90-100
        Candidate satisfies nearly all required qualifications with strong supporting evidence.

        80-89
        Strong candidate with only minor gaps.

        70-79
        Reasonable candidate with several noticeable gaps.

        60-69
        Weak match with multiple important gaps.

        Below 60
        Candidate lacks several critical qualifications required for the role.

        ## Output Rules

        Populate the response schema as follows:

        - match_score
        A single integer from 0 to 100.

        - advantages
        List the strongest evidence showing why the candidate fits the role.
        Each item should be concise and evidence-based.

        - disadvantages
        List only genuine gaps or missing qualifications.
        Never invent missing skills.

        - recommendations
        Give practical, actionable advice to improve competitiveness for this specific role.

        ## Important Constraints

        - Be objective.
        - Use only information provided in the CV and Job Description.
        - Do NOT hallucinate skills, experience, certifications, or achievements.
        - Do NOT penalize the candidate for information that is simply unavailable.
        - If the CV partially satisfies a requirement, acknowledge the partial match.
        """

    user_context = f"""
        Please evaluate the following candidate against the target job.

        === TARGET JOB ===
        Company:
        {job_info.get("company", "Unknown")}

        Job Title:
        {job_info.get("title", "Unknown")}

        Requirements:
        {job_info.get("requirements", "")}

        Full Job Description:
        {job_info.get("description", "")}

        === CANDIDATE ===

        Summary:
        {cv_data["content"]["summary"]}

        Skills:
        {cv_data["content"]["skills"]}

        Experience:
        {cv_data["content"]["experience"]}

        Projects:
        {cv_data["content"]["projects"]}

        Certifications:
        {cv_data["content"]["certifications"]}

        Training:
        {cv_data["content"]["training"]}

        Return the result according to the provided response schema.
    """

    return system_instruction, user_context