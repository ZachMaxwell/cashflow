from django.db import models
from django.contrib.auth.models import User

class Transaction(models.Model):

    CATEGORY_CHOICES = [ 
        ('Going out & Eating out', 'Going out & Eating out'),
        ('Car & Gas & Auto Insurance', 'Car & Gas & Auto Insurance'),
        ('Rent & Utilities', 'Rent & Utilities'),
        ('Travel & Personal & Other', 'Travel & Personal & Other'),
        ('Loans', 'Loans'),
        ('Subscriptions', 'Subscriptions' ),
        ('Groceries', 'Groceries'),
    ]

    TRANSACTION_TYPE_CHOICES = [
        ('Income', 'Income'),
        ('Expense', 'Expense'),
        ('Investment', 'Investment'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(null=True)
    description = models.CharField(max_length=100, null=True, blank=True)
    transaction_type = models.CharField(max_length=10, choices = TRANSACTION_TYPE_CHOICES, default = 'Expense', null=False, blank=False)
    category = models.CharField(max_length=75, choices = CATEGORY_CHOICES, null=True, blank=False)
    account = models.CharField(max_length=10, null=True, blank=True)
    id = models.AutoField(primary_key=True, editable=False)
    
    def __str__(self):
        return self.description