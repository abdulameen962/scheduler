# build_files.sh

echo "Building the project..."
pip install -r requirements.txt

echo "Migrating project"
python3.9 manage.py makemigrations
python3.9 manage.py migrate

echo "Running jobs..."
python3.9 manage.py cronjobs
