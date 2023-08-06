from django import forms
from .models import Transaction

class TransactionForm(forms.ModelForm):
    class Meta:
        model = Transaction
        fields = [
            'user',
            'day',
            'month',
            'year', 
            'category', 
            'account', 
            'amount',
            'description',
            'type',
        ]

