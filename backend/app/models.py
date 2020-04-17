import uuid

from django.db import models
from django.utils import timezone

from simple_history.models import HistoricalRecords, _history_user_setter


class FeatureFlag(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    description = models.CharField(max_length=255, default='', blank=True)
    enabled = models.BooleanField(default=False)
    active = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)
    long_term = models.BooleanField(default=False)
    store_specific = models.BooleanField(default=False)
    activated_at = models.DateTimeField(null=True, blank=True)
    user_email = None
    history = HistoricalRecords(
        history_user_id_field=models.CharField(max_length=255, default='', blank=True)
    )

    def status(self, store_location_id=None):
        active_status = self.active and self.enabled and not self.deleted
        if active_status and self.store_specific:
            active_status = False
            if store_location_id:
                flag_by_store = FeatureFlagByStore.objects.filter(feature_flag=self, store_location_id=store_location_id).first()
                if flag_by_store:
                    active_status = flag_by_store.active
        return active_status

    @property
    def _history_user(self):
        return self.user_email


class FeatureFlagByStore(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    store_location_id = models.UUIDField(blank=False)
    feature_flag = models.ForeignKey(FeatureFlag, on_delete=models.DO_NOTHING)
    active = models.BooleanField(default=True)
    activated_at = models.DateTimeField(null=True, blank=True, default=timezone.now)
    user_email = None
    history = HistoricalRecords(
        history_user_id_field=models.CharField(max_length=255, default='', blank=True)
    )

    class Meta:
        unique_together = ('store_location_id', 'feature_flag')

    @property
    def _history_user(self):
        return self.user_email
