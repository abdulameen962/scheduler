# Generated by Django 4.2 on 2023-12-09 14:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0007_alter_user_options_remove_task_user_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='labels',
            field=models.ManyToManyField(related_name='task_labels', to='main.label'),
        ),
    ]
