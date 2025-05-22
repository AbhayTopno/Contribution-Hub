import strawberry
from typing import List, Optional
from .models import Organization, YearlyParticipation

@strawberry.django.type(YearlyParticipation)
class YearlyParticipationType:
    year: int
    project_count: int

@strawberry.django.type(Organization)
class OrganizationType:
    name: str
    description: Optional[str]
    url: Optional[str]
    image_url: Optional[str]
    category: Optional[str]
    topics: Optional[List[str]]
    tech_stack: Optional[List[str]]
    rating: float
    total_projects: int
    
    @strawberry.field
    def yearly_participations(self) -> List[YearlyParticipationType]:
        return self.yearly_participations.all().order_by('-year')

@strawberry.type
class Query:
    @strawberry.field
    def organizations(
        category: Optional[str] = None,
        tech_stack: Optional[List[str]] = None,
        topic: Optional[List[str]] = None,
        offset: int = 0,
        limit: int = 10
    ) -> List[OrganizationType]:
        queryset = Organization.objects.prefetch_related('yearly_participations')
        
        if category:
            queryset = queryset.filter(category__iexact=category)
        
        if tech_stack:
            for tech in tech_stack:
                queryset = queryset.filter(tech_stack__contains=[tech])
        
        if topic:
            for t in topic:
                queryset = queryset.filter(topics__contains=[t])
            
        queryset = queryset.order_by(
            '-rating',        
            '-total_projects'   
        )[offset:offset + limit]
        
        return queryset

schema = strawberry.Schema(query=Query)