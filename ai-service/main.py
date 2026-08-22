from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import numpy as np

app = FastAPI(
    title="Avsar AI Recommendation & Skill Assessment Engine",
    description="Backend AI service for Avsar AI Internship Recommendation, Assessment Evaluation, and Learning Pathways",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StudentProfilePayload(BaseModel):
    user_id: Optional[str] = "student-001"
    discipline: str
    skills: List[str]
    interests: List[str]
    assessment_scores: Dict[str, float] = {}
    projects: List[Dict[str, Any]] = []
    preferred_locations: List[str] = []

class AssessmentEvaluatePayload(BaseModel):
    assessment_id: str
    category: str
    user_answers: Dict[str, str]
    answer_key: Dict[str, str]
    skill_topic: str

# Curated Recommended Guides
CURATED_GUIDES_DATABASE = {
    "Clinical Diagnostics": {
        "title": "Mastering Classical Diagnostics & Wave Analysis",
        "author": "Avsar AI Research Wing",
        "type": "Clinical Guide",
        "level": "Intermediate to Advanced",
        "read_time": "3.5 Hours",
        "url": "https://avsar.ai/guides/clinical-diagnostics-masterclass"
    },
    "Phytochemistry Analysis": {
        "title": "HPLC & HPTLC Standardization of Formulations",
        "author": "Central Healthcare Council",
        "type": "Laboratory Handbook",
        "level": "Intermediate",
        "read_time": "4 Hours",
        "url": "https://avsar.ai/guides/hplc-standardization"
    }
}

OPPORTUNITIES_DATABASE = [
    {
        "id": "int-101",
        "title": "Clinical Diagnostics Research Trainee",
        "organization": "All India Institute of Healthcare Sciences",
        "location": "New Delhi",
        "category": "GENERAL_HEALTHCARE",
        "stipend": "₹18,000 / month",
        "duration": "6 Months",
        "type": "On-site",
        "required_skills": ["Clinical Diagnostics", "Patient EHR Management"],
        "preferred_interests": ["Clinical Research", "Hospital Diagnostics"],
        "min_assessment_score": 70.0,
        "description": "Lead clinical diagnostics therapy administration, patient profiling, and health research trials."
    },
    {
        "id": "int-102",
        "title": "Pharmacovigilance Research Associate",
        "organization": "Dabur R&D Division",
        "location": "Ghaziabad, UP",
        "category": "HERBAL_MANUFACTURING",
        "stipend": "₹20,000 / month",
        "duration": "4 Months",
        "type": "On-site",
        "required_skills": ["Phytochemistry Analysis", "HPLC / HPTLC Analysis", "GMP Compliance"],
        "preferred_interests": ["R&D", "Phytomedicine", "Quality Control"],
        "min_assessment_score": 75.0,
        "description": "Engage in formulation standardization, active component extraction, and testing."
    }
]

@app.get("/")
def read_root():
    return {
        "engine": "Avsar AI Recommendation & Assessment Engine",
        "version": "2.0.0",
        "status": "online",
        "portal": "Avsar AI Platform"
    }

@app.post("/api/evaluate-assessment")
def evaluate_assessment(payload: AssessmentEvaluatePayload):
    total = len(payload.answer_key)
    if total == 0:
        raise HTTPException(status_code=400, detail="Invalid answer key")

    correct_count = 0
    breakdown = []

    for q_id, correct_ans in payload.answer_key.items():
        user_ans = payload.user_answers.get(q_id, "")
        is_correct = (user_ans.strip().upper() == correct_ans.strip().upper())
        if is_correct:
            correct_count += 1
        breakdown.append({
            "question_id": q_id,
            "user_answer": user_ans,
            "correct_answer": correct_ans,
            "is_correct": is_correct
        })

    score_percentage = round((correct_count / total) * 100, 1)
    passed = score_percentage >= 60.0

    recommended_guides = []
    if score_percentage < 85.0 and payload.skill_topic in CURATED_GUIDES_DATABASE:
        recommended_guides.append(CURATED_GUIDES_DATABASE[payload.skill_topic])

    return {
        "assessment_id": payload.assessment_id,
        "skill_topic": payload.skill_topic,
        "total_questions": total,
        "correct_count": correct_count,
        "score_percentage": score_percentage,
        "passed": passed,
        "breakdown": breakdown,
        "recommended_guides": recommended_guides
    }

@app.post("/api/recommendations")
def get_ai_recommendations(payload: StudentProfilePayload):
    user_skills = set([s.lower().strip() for s in payload.skills])
    user_interests = set([i.lower().strip() for i in payload.interests])
    assessment_scores = payload.assessment_scores

    scored_list = []

    for opp in OPPORTUNITIES_DATABASE:
        req_skills = set([s.lower().strip() for s in opp["required_skills"]])
        pref_interests = set([i.lower().strip() for i in opp["preferred_interests"]])

        skill_overlap = len(user_skills.intersection(req_skills))
        skill_score = (skill_overlap / len(req_skills)) * 100 if len(req_skills) > 0 else 50.0

        assessment_points = []
        for skill in opp["required_skills"]:
            if skill in assessment_scores:
                assessment_points.append(assessment_scores[skill])
        avg_assessment_score = np.mean(assessment_points) if len(assessment_points) > 0 else 65.0

        interest_overlap = len(user_interests.intersection(pref_interests))
        interest_score = (interest_overlap / len(pref_interests)) * 100 if len(pref_interests) > 0 else 50.0

        project_count = len(payload.projects)
        project_score = min(100.0, project_count * 35.0)

        final_score = (
            (0.40 * skill_score) +
            (0.30 * avg_assessment_score) +
            (0.20 * interest_score) +
            (0.10 * project_score)
        )

        final_score_rounded = round(final_score, 1)

        opp_copy = dict(opp)
        opp_copy["ai_match_score"] = final_score_rounded
        opp_copy["matched_skills"] = [s for s in opp["required_skills"] if s.lower() in user_skills]
        opp_copy["missing_skills"] = [s for s in opp["required_skills"] if s.lower() not in user_skills]

        scored_list.append(opp_copy)

    scored_list.sort(key=lambda x: x["ai_match_score"], reverse=True)

    return {
        "student_user_id": payload.user_id,
        "recommendations": scored_list
    }
