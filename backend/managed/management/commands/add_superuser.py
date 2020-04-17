from django.contrib.auth.models import User
from django.core.management.base import BaseCommand


class Command(BaseCommand):

    def handle(self, *args, **options):
        User.objects.get_or_create(
            username='dev-ops@olla.co',
            email='dev-ops@olla.co',
            password='pbkdf2_sha256$150000$7UV8ObAZjW7W$ipedFWWl5kWtxRX2tQ4EHU8GcA6tqpOO+YOIAHlVXaY=',
            is_staff=True,
            is_superuser=True
        )
