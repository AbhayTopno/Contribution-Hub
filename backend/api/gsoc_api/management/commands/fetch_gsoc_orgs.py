import json
import requests
from django.core.management.base import BaseCommand
from api.gsoc_api.models import Organization, YearlyParticipation

class Command(BaseCommand):
    help = 'Fetch GSoC organizations from API and store in database'
    
    def handle(self, *args, **options):
        API_URL = "https://api.gsocorganizations.dev/organizations.json"
        
        self.stdout.write(self.style.SUCCESS('Fetching data from API...'))
        
        try:
            response = requests.get(API_URL)
            response.raise_for_status()
            data = response.json()
            
            self.stdout.write(self.style.SUCCESS(f'Successfully fetched {len(data)} organizations'))
            
            orgs_count = 0
            for org_data in data:
                try:
                    name = org_data.get('name', '')
                    description = org_data.get('description', '')
                    url = org_data.get('url', '')
                    image_url = org_data.get('image_url', '')
                    category = org_data.get('category', '')
                    topics = org_data.get('topics', [])
                    tech_stack = org_data.get('technologies', [])
                    
                    org, created = Organization.objects.update_or_create(
                        name=name,
                        defaults={
                            'description': description,
                            'url': url,
                            'image_url': image_url,
                            'category': category,
                            'topics': topics,
                            'tech_stack': tech_stack,
                        }
                    )
                    
                    years_data = org_data.get('years', {})
                    for year_str, year_data in years_data.items():
                        try:
                            year = int(year_str)
                            project_count = len(year_data.get('projects', []))
                            
                            YearlyParticipation.objects.update_or_create(
                                organization=org,
                                year=year,
                                defaults={'project_count': project_count}
                            )
                        except ValueError:
                            self.stdout.write(self.style.WARNING(f'Invalid year format: {year_str}'))
                    
                    org.update_stats()
                    
                    orgs_count += 1
                    if orgs_count % 50 == 0:
                        self.stdout.write(self.style.SUCCESS(f'Processed {orgs_count} organizations'))
                        
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Error processing organization {org_data.get("name", "Unknown")}: {str(e)}'))
            
            self.stdout.write(self.style.SUCCESS(f'Successfully processed all {orgs_count} organizations'))
            
        except requests.exceptions.RequestException as e:
            self.stdout.write(self.style.ERROR(f'Error fetching data from API: {str(e)}'))
        except json.JSONDecodeError as e:
            self.stdout.write(self.style.ERROR(f'Error decoding JSON response: {str(e)}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Unexpected error: {str(e)}'))