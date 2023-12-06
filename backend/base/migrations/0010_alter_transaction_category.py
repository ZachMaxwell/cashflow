# Generated by Django 4.2.3 on 2023-12-06 18:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0009_alter_transaction_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='category',
            field=models.CharField(choices=[('Going out & Eating out', 'Going out & Eating out'), ('Car & Gas & Auto Insurance', 'Car & Gas & Auto Insurance'), ('Rent & Utilities', 'Rent & Utilities'), ('Travel & Personal & Other', 'Travel & Personal & Other'), ('Loans', 'Loans'), ('Subscriptions', 'Subscriptions'), ('Groceries', 'Groceries'), ('Paycheck & Deposits', 'Paycheck & Deposits')], default='Travel & Personal & Other', max_length=75),
        ),
    ]
