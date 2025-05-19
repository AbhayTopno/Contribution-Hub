from django.db import models
from django.contrib.postgres.fields import ArrayField

class Organization(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    url = models.URLField(max_length=255, blank=True, null=True)
    image_url = models.URLField(max_length=255, blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    topics = ArrayField(models.CharField(max_length=100), blank=True, null=True)
    tech_stack = ArrayField(models.CharField(max_length=100), blank=True, null=True)
    
    def __str__(self):
        return self.name

class YearlyParticipation(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='yearly_participations')
    year = models.IntegerField()
    project_count = models.IntegerField(default=0)
    
    class Meta:
        unique_together = ('organization', 'year')
        
    def __str__(self):
        return f"{self.organization.name} - {self.year} ({self.project_count} projects)"