import logging
import time
from django.core.management.base import BaseCommand
from django.db import transaction
from api.gsoc_api.models import Organization
from api.gsoc_api.utils import google_items, first_github_url

REQUEST_DELAY_SEC = 0.25
MAX_RETRIES = 3
logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Fetch an organization's GitHub URL via Google Custom Search and save it."

    def add_arguments(self, parser):
        parser.add_argument("--limit", type=int, help="Process only the first N organizations.")
        parser.add_argument("--force", action="store_true", help="Overwrite existing github_url values.")

    def handle(self, *args, **options):
        limit = options.get("limit")
        force = options.get("force", False)

        qs = Organization.objects.all()
        qs = qs if force else qs.filter(github_url__isnull=True)
        if limit:
            qs = qs[:limit]

        total = qs.count()
        if total == 0:
            self.stdout.write(self.style.SUCCESS("Nothing to do."))
            return

        self.stdout.write(self.style.SUCCESS(f"Scanning {total} organizations..."))

        updated = 0
        skipped = 0
        failed = 0

        for idx, org in enumerate(qs, start=1):
            query = f"{org.name} GitHub"
            self.stdout.write(f"[{idx}/{total}] Searching: {query}")

            try:
                url = self._search_github_url(query)
                if not url:
                    skipped += 1
                    self.stdout.write(self.style.WARNING("  • No result found."))
                    continue

                with transaction.atomic():
                    org.github_url = url
                    org.save(update_fields=["github_url"])

                updated += 1
                self.stdout.write(self.style.SUCCESS(f"  • Saved: {url}"))

            except Exception as exc:
                failed += 1
                self.stdout.write(self.style.ERROR(f"  • ERROR: {exc}"))
                logger.exception("Error fetching GitHub URL for %s", org.name)

            time.sleep(REQUEST_DELAY_SEC)

        summary = f"\nDone!\n  Updated : {updated}\n  Skipped : {skipped}\n  Failed  : {failed}\n"
        self.stdout.write(self.style.SUCCESS(summary))

    def _search_github_url(self, query: str) -> str | None:
        last_exc = None
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                items = google_items(query)
                return first_github_url(items)
            except Exception as exc:
                last_exc = exc
                if attempt < MAX_RETRIES:
                    time.sleep(2 * attempt)
                    continue
        raise last_exc or RuntimeError("Unknown Google CSE error")