# Generated by Django 4.2.3 on 2023-12-28 00:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0012_alter_transaction_transaction_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='category',
            field=models.CharField(choices=[('Going out & Eating out', 'Going out & Eating out'), ('Car & Gas & Auto Insurance', 'Car & Gas & Auto Insurance'), ('Rent & Utilities', 'Rent & Utilities'), ('Travel & Personal & Other', 'Travel & Personal & Other'), ('Loans', 'Loans'), ('Subscriptions', 'Subscriptions'), ('Groceries', 'Groceries')], max_length=75, null=True),
        ),
    ]
