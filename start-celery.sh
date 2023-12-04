#!/bin/bash
echo "Building the project..."
pip install -r requirements.txt

echo "Celery tasks adding"
celery -A football worker -l info -P eventlet
celery -A football beat -l info
python manage.py check --deploy
