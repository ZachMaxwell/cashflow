# Generated by Django 4.2.3 on 2024-01-06 20:41

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('base', '0013_alter_transaction_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='amount',
            field=models.DecimalField(decimal_places=2, max_digits=15),
        ),
        migrations.CreateModel(
            name='Budget',
            fields=[
                ('date', models.DateField(null=True)),
                ('income_budget', models.DecimalField(blank=True, decimal_places=2, max_digits=15, null=True)),
                ('expense_budget', models.DecimalField(blank=True, decimal_places=2, max_digits=15, null=True)),
                ('savings_budget', models.DecimalField(blank=True, decimal_places=2, max_digits=15, null=True)),
                ('investments_budget', models.DecimalField(blank=True, decimal_places=2, max_digits=15, null=True)),
                ('loans_budget', models.DecimalField(blank=True, decimal_places=2, max_digits=15, null=True)),
                ('subscriptions_budget', models.DecimalField(blank=True, decimal_places=2, max_digits=15, null=True)),
                ('groceries_budget', models.DecimalField(blank=True, decimal_places=2, max_digits=15, null=True)),
                ('personal_budget', models.DecimalField(blank=True, decimal_places=2, max_digits=15, null=True)),
                ('social_budget', models.DecimalField(blank=True, decimal_places=2, max_digits=15, null=True)),
                ('car_budget', models.DecimalField(blank=True, decimal_places=2, max_digits=15, null=True)),
                ('housing_budget', models.DecimalField(blank=True, decimal_places=2, max_digits=15, null=True)),
                ('id', models.AutoField(editable=False, primary_key=True, serialize=False)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
