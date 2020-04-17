import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))


# This is expected by the managed settings
LOCAL_BASE_DIR = os.path.join(BASE_DIR, 'local/')
