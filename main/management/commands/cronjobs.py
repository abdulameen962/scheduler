from django.core.management.base import BaseCommand
from main.tasks import update_goals,send_regular_notifications

class Command(BaseCommand):
    help = "Custom admin to run cronjobs"
    
    def handle(self, *args, **options):
        # obj_id = options.get('id')
        update_goals(task="goal")
        update_goals(task="task")
        send_regular_notifications()
        self.stdout.write(self.style.SUCCESS('Just completed tasks'))
        
    # def add_arguments(self, parser):
    #     parser.add_argument('id', type=int, help='ID of the record being updated')
        
    