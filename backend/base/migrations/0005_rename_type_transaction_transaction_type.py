# Generated by Django 4.2.3 on 2023-09-19 16:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0004_alter_transaction_category'),
    ]

    operations = [
        migrations.RenameField(
            model_name='transaction',
            old_name='type',
            new_name='transaction_type',
        ),
    ]