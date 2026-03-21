import logging
from typing import List, Dict, Any
from ..skill_extractor import SkillExtractor
try:
    from ..models import WorkerProfile, ServiceRequest
    from ..database import get_db
except (ImportError, ValueError):
    from app.models import WorkerProfile, ServiceRequest
    from app.database import get_db

logger = logging.getLogger(__name__)

class MatchingEngine:
    def __init__(self):
        self.skill_extractor = SkillExtractor()

    async def find_matches(self, request: ServiceRequest) -> List[Dict[str, Any]]:
        db = get_db()
        
        # 1. Extract required skills from request description using NLP
        required_skills = self.skill_extractor.extract_skills(request.description)
        if not required_skills:
            # Fallback to work_type if NLP fails to find specific skills
            required_skills = [request.work_type]
            
        logger.info(f"Matching request for {request.work_type}. Required: {required_skills}")

        # 2. Query workers from DB
        # Basic filter: must be available and verified
        cursor = db["worker_profiles"].find({"availability": True})
        workers = await cursor.to_list(length=200)

        matches = []
        for worker in workers:
            # 3. Calculate match score
            score = 0
            
            # Skill match (intersection + partial matching)
            worker_skills_list = worker.get("skills", [])
            worker_skills = set(s.lower() for s in worker_skills_list)
            req_skills_set = set(s.lower() for s in required_skills)
            
            common_skills = worker_skills.intersection(req_skills_set)
            skill_score = (len(common_skills) / len(required_skills)) * 60 if required_skills else 0
            
            # Additional boost for work_type match
            if request.work_type.lower() in [s.lower() for s in worker_skills_list]:
                skill_score = max(skill_score, 40)
            
            # Location match (simulated - for demo, we'll check if location string matches)
            location_score = 0
            user = await db["users"].find_one({"email": worker["user_id"]})
            if user:
                # Direct string match or partial match
                if user.get("location") == request.location:
                    location_score = 30
                elif request.location.lower() in user.get("location", "").lower():
                    location_score = 20
            
            # Rating score
            rating_score = (worker.get("rating", 0.0) / 5.0) * 10
            
            total_score = skill_score + location_score + rating_score
            
            if total_score > 15: # Lowered threshold slightly for better discovery
                matches.append({
                    "worker_id": worker["user_id"],
                    "name": user.get("name") if user else "Unknown",
                    "skills": worker_skills_list,
                    "score": round(total_score, 2),
                    "rating": worker.get("rating", 0.0),
                    "location": user.get("location") if user else "Unknown",
                    "charges": worker.get("service_charges", 0.0)
                })

        # Sort by score descending
        matches.sort(key=lambda x: x["score"], reverse=True)
        return matches[:10]
