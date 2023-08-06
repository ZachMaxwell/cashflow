from django.db import models
from django.contrib.auth.models import User

class Transaction(models.Model):

    CATEGORY_CHOICES = [ 
        ('Going out & Eating out', 'Going out & Eating out'),
        ('Car, Gas, & Auto Insurance', 'Car, Gas, & Auto Insurance'),
        ('Rent & Utilities', 'Rent & Utilities'),
        ('Travel, Personal, & Other', 'Travel, Personal, & Other'),
        ('Loans', 'Loans'),
        ('Savings & Investments', 'Savings & Investments'),
        ('Subscriptions', 'Subscriptions' ),
        ('Groceries', 'Groceries'),
        ('Paycheck & Deposits', 'Paycheck & Deposits'),
    ]

    TYPE_CHOICES = [
        ('Deposit', 'Deposit'),
        ('Expense', 'Expense'),
        ('Investment', 'Investment'),
    ]

    MONTH_CHOICES = [
        ('Jan', 'January'),
        ('Feb', 'February'),
        ('Mar', 'March'),
        ('Apr', 'April'),
        ('May', 'May'),
        ('Jun', 'June'),
        ('Jul', 'July'),
        ('Aug', 'August'),
        ('Sep', 'September'),
        ('Oct', 'October'),
        ('Nov', 'November'),
        ('Dec', 'December'),
    ]

    DAY_CHOICES = [
        ('1', '1'),
        ('2', '2'),
        ('3', '3'),
        ('4', '4'),
        ('5', '5'),
        ('6', '6'),
        ('7', '7'),
        ('8', '8'),
        ('9', '9'),
        ('10', '10'),
        ('11', '11'),
        ('12', '12'),
        ('13', '13'),
        ('14', '14'),
        ('15', '15'),
        ('16', '16'),
        ('17', '17'),
        ('18', '18'),
        ('19', '19'),
        ('20', '20'),
        ('21', '21'),
        ('22', '22'),
        ('22', '22'),
        ('23', '23'),
        ('24', '24'),
        ('25', '25'),
        ('26', '26'),
        ('27', '27'),
        ('28', '28'),
        ('29', '29'),
        ('30', '30'),
        ('31', '31'),
    ]


    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    day = models.CharField(max_length=2, choices = DAY_CHOICES, default = '1', null=False, blank=False)
    month = models.CharField(max_length=9, choices = MONTH_CHOICES, default = 'Jan', null=False, blank=False)
    year = models.CharField(max_length=4, null=False, blank=False)
    description = models.CharField(max_length=100, null=True, blank=True)
    type = models.CharField(max_length=10, choices = TYPE_CHOICES, default = 'Expense',null=False, blank=False)
    category = models.CharField(max_length=75, choices = CATEGORY_CHOICES, default = 'Travel, Personal, & Other',null=False, blank=False)
    account = models.CharField(max_length=10, null=True, blank=True)
    id = models.AutoField(primary_key=True, editable=False)
    
    def __str__(self):
        return self.description