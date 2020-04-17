from django.test import TestCase

from local.settings import *
from managed.constants import *

# https://docs.djangoproject.com/en/1.11/topics/testing/overview/
# https://docs.djangoproject.com/en/1.11/topics/testing/tools/


# Create your tests here.
class TestTests(TestCase):

    def test_do_the_tests_work(self):
        self.assertEqual(1, 1)

    def testing_queue_names(self):
        self.assertEqual(API_HIGH, 'api_high')
        self.assertEqual(API_LOW, 'api_low')
        self.assertEqual(CRON_HIGH, 'cron_high')
        self.assertEqual(CRON_LOW, 'cron_low')

    # `SERVICE_QUEUE_LIST` is an expected list, but can be empty.
    def test_are_the_queues_defined(self):
        list_exists = isinstance(SERVICE_QUEUE_LIST, list)
        self.assertEqual(list_exists, True)
