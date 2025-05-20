from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.utils import timezone

class Organization(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    url = models.URLField(max_length=255, blank=True, null=True)
    image_url = models.URLField(max_length=255, blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    topics = ArrayField(models.CharField(max_length=100), blank=True, null=True)
    tech_stack = ArrayField(models.CharField(max_length=100), blank=True, null=True)
    rating = models.FloatField(default=0.0)
    total_projects = models.IntegerField(default=0)
    
    def __str__(self):
        return self.name

    def update_stats(self):
        participations = self.yearly_participations.all()
        current_year = timezone.now().year
        
        total_projects = 0
        weighted_rating = 0.0
        
        for participation in participations:
            total_projects += participation.project_count
            
            years_ago = current_year - participation.year
            weight = 2 ** (-years_ago)
            weighted_rating += weight
        
        self.rating = round(weighted_rating, 4)
        self.total_projects = total_projects
        self.save()

class YearlyParticipation(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='yearly_participations')
    year = models.IntegerField()
    project_count = models.IntegerField(default=0)
    
    class Meta:
        unique_together = ('organization', 'year')
        
    def __str__(self):
        return f"{self.organization.name} - {self.year} ({self.project_count} projects)"