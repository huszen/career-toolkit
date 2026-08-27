from typing import List, Optional

from pydantic import BaseModel, Field


class ExperienceItem(BaseModel):
    job_title: str | None = Field(default=None, description="The job title or role held.")
    company: str | None = Field(default=None, description="The company, organization, or lab name.")
    location: str | None = Field(default=None, description="City, country, or remote status if mentioned.")
    start_date: str | None = Field(default=None, description="Start date as stated in text (e.g. 'Aug 2024').")
    end_date: str | None = Field(default=None, description="End date as stated in text (e.g. 'Present', 'Aug 2025').")
    description: list[str] = Field(
        default_factory=list,
        description="List of specific achievements, responsibilities, or bullet points.",
    )
    technologies: list[str] = Field(
        default_factory=list,
        description="Key tools, languages, or frameworks mentioned specifically for this role.",
    )


class EducationItem(BaseModel):
    degree: str | None = Field(default=None, description="Degree or program (e.g. 'B.S. in Computer Science').")
    institution: str | None = Field(default=None, description="University, college, or school name.")
    location: str | None = Field(default=None, description="City, country if mentioned.")
    start_date: str | None = Field(default=None, description="Start date or year.")
    end_date: str | None = Field(default=None, description="Graduation date, expected graduation, or year.")
    gpa: str | None = Field(default=None, description="GPA or grade if explicitly stated.")
    details: list[str] = Field(
        default_factory=list,
        description="Honors, relevant coursework, thesis, or major achievements.",
    )


class ProjectItem(BaseModel):
    project_name: str | None = Field(default=None, description="Name or title of the project.")
    role: str | None = Field(default=None, description="Role within the project if mentioned.")
    start_date: str | None = Field(default=None, description="Start date if mentioned.")
    end_date: str | None = Field(default=None, description="End date if mentioned.")
    description: list[str] = Field(
        default_factory=list,
        description="Key features, deliverables, or bullet points.",
    )
    technologies: list[str] = Field(
        default_factory=list,
        description="Technologies, libraries, or tools utilized in this project.",
    )
    url: str | None = Field(default=None, description="Project link, demo URL, or GitHub repo if present.")


class CertificationItem(BaseModel):
    name: str | None = Field(default=None, description="Name of the certification or license.")
    issuer: str | None = Field(default=None, description="Issuing body or organization (e.g. 'AWS', 'Coursera').")
    issue_date: str | None = Field(default=None, description="Date issued or obtained if mentioned.")
    expiration_date: str | None = Field(default=None, description="Expiration date if mentioned.")
    credential_id: str | None = Field(default=None, description="Credential ID or certificate URL if mentioned.")


class TrainingItem(BaseModel):
    name: str | None = Field(default=None, description="Name of training program, bootcamp, or workshop.")
    provider: str | None = Field(default=None, description="Provider, organization, or platform.")
    completion_date: str | None = Field(default=None, description="Date or duration completed.")
    details: list[str] = Field(
        default_factory=list,
        description="Key topics covered or highlights.",
    )


class SkillCategory(BaseModel):
    category_name: str = Field(
        description="Name of the skill category (e.g. 'Programming Languages', 'Frameworks & Libraries', 'Cloud & DevOps', 'Tools', 'Soft Skills')."
    )
    skills: list[str] = Field(
        default_factory=list,
        description="List of individual skill names under this category.",
    )


class CustomSection(BaseModel):
    section_title: str = Field(
        description="Title of any other section not covered above (e.g. 'Publications', 'Volunteering', 'Languages', 'Awards')."
    )
    items: list[str] = Field(
        default_factory=list,
        description="Bullet points or entries found in that section.",
    )


class StructuredProfileSchema(BaseModel):
    summary: str | None = Field(
        default=None,
        description="Professional summary or bio statement normalized into clean prose.",
    )
    skill_categories: list[SkillCategory] = Field(
        default_factory=list,
        description="Categorized grouping of all technical and soft skills.",
    )
    experience: list[ExperienceItem] = Field(
        default_factory=list,
        description="Work experiences, internships, research positions.",
    )
    education: list[EducationItem] = Field(
        default_factory=list,
        description="Academic background and degrees.",
    )
    projects: list[ProjectItem] = Field(
        default_factory=list,
        description="Notable personal, academic, or professional projects.",
    )
    certifications: list[CertificationItem] = Field(
        default_factory=list,
        description="Professional certifications and credentials.",
    )
    training: list[TrainingItem] = Field(
        default_factory=list,
        description="Bootcamps, workshops, vocational training courses.",
    )
    custom_sections: list[CustomSection] = Field(
        default_factory=list,
        description="Any additional sections that do not fit into standard categories.",
    )
