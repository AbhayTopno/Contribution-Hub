from django.contrib import admin
from .models import Organization, YearlyParticipation

class YearlyParticipationInline(admin.TabularInline):
    model = YearlyParticipation
    extra = 0

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'url', 'image_url', 'category', 'topics', 
                    'tech_stack', 'github_url','get_years_participated', 'rating', 'total_projects',)
    search_fields = ('name', 'category', 'topics', 'tech_stack')
    list_filter = ('category', 'yearly_participations__year')
    inlines = [YearlyParticipationInline]
    
    def get_years_participated(self, obj):
        years = obj.yearly_participations.values_list('year', flat=True)
        return ', '.join(str(year) for year in sorted(years, reverse=True))
    
    get_years_participated.short_description = 'Years Participated'

@admin.register(YearlyParticipation)
class YearlyParticipationAdmin(admin.ModelAdmin):
    list_display = ('organization', 'year', 'project_count')
    list_filter = ('year',)
    search_fields = ('organization__name',)