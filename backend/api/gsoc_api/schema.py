import strawberry
from typing import List, Optional
from .models import Organization, YearlyParticipation
from collections import Counter

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
    github_url: Optional[str]
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
    def organization(self, name: str) -> Optional[OrganizationType]:
        try:
            return Organization.objects.prefetch_related('yearly_participations').get(name=name)
        except Organization.DoesNotExist:
            return None

    @strawberry.field
    def organizations(
        self,
        search: Optional[str] = None,
        category: Optional[str] = None,
        tech_stack: Optional[List[str]] = None,
        topic: Optional[List[str]] = None,
        offset: int = 0,
        limit: int = 10
    ) -> List[OrganizationType]:
        queryset = Organization.objects.prefetch_related('yearly_participations')

        if search:
            queryset = queryset.filter(name__icontains=search)

        if category:
            queryset = queryset.filter(category__iexact=category)

        if tech_stack:
            for tech in tech_stack:
                queryset = queryset.filter(tech_stack__contains=[tech])

        if topic:
            for t in topic:
                queryset = queryset.filter(topics__contains=[t])

        queryset = queryset.order_by('-rating', '-total_projects')[offset:offset + limit]
        return queryset

    @strawberry.field
    def all_categories(self) -> List[str]:
        return list(Organization.objects.exclude(category__isnull=True).values_list('category', flat=True).distinct())

    @strawberry.field
    def all_tech_stacks(self) -> List[str]:
        techs = Organization.objects.values_list('tech_stack', flat=True)
        flat = [item for sublist in techs if sublist for item in sublist]
        counter = Counter(flat)
        return [tech for tech, _ in counter.most_common()]

    @strawberry.field
    def all_topics(self) -> List[str]:
        topics = Organization.objects.values_list('topics', flat=True)
        flat = [item for sublist in topics if sublist for item in sublist]
        counter = Counter(flat)
        return [topic for topic, _ in counter.most_common()]

schema = strawberry.Schema(query=Query)
