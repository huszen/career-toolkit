def build_cover_letter_prompt(cv_data: dict, job_data: dict) -> str:
    """
    Merges raw CV extraction data and Scraped Job data into a single 
    structured prompt optimized for a single-hit API call.
    """
    
    job_info = job_data.get("data",{})

    system_instruction = """
        You are an expert ATS Optimization Engineer and Career Coach.

        Your single task is to analyze the candidate's CV against the Job Requirements and write a highly tailored, compelling professional cover letter.

        EXECUTION STEPS:
        1. SKILL INTERSECTION: Identify matching hard skills, frameworks, and tools.
        2. EXPERIENCE MAPPING: Align candidate projects or histories directly to the job responsibilities.
        3. TONE ALIGNMENT: Adopt the target company's communication style.

        CRITICAL OUTPUT CONSTRAINTS:
        - Do NOT output any HTML, CSS, or markdown code blocks (no ```html or ```markdown).
        - Output the letter in clean, standard paragraphs separated by a double newline.
        - No placeholders like [Date] or [Company Address]. If specific information is missing, begin directly with 'Dear Hiring Team,'.
        - Absolutely do not hallucinate or invent candidate experiences or metrics.
    """
    
    user_context = f"""
        Please generate a cover letter based on the following authenticated datasets:
        
        === TARGET JOB INFORMATION ===
        Company Name: {job_info.get('company', 'Unknown')}
        Job Title: {job_info.get('title', 'Target Role')}
        Core Requirements: {job_info.get('requirements', 'See description')}
        Full Job Description: {job_info.get('description', '')}
        
        === CANDIDATE CERTIFIED BACKGROUND ===
        Name: {cv_data['identity']['name']}
        Contact: {cv_data['identity']['email']} | {cv_data['identity']['phone']}
        Links: LinkedIn: {cv_data['identity']['linkedin']} | Portfolio: {cv_data['identity']['website']}
        
        Summary: {cv_data['content']['summary']}
        Skills Inventory: {cv_data['content']['skills']}
        Professional Experience: {cv_data['content']['experience']}
        Key Projects: {cv_data['content']['projects']}
        Certifications & Training: {cv_data['content']['certifications']} | {cv_data['content']['training']}
    """
    
    return system_instruction, user_context