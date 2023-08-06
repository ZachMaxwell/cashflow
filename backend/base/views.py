from django.shortcuts import render
from django.http import JsonResponse
from .transactions import transactions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Transaction
from .serializers import TransactionSerializer

@api_view(['GET'])
def getRoutes(request):

    routes = [

        "/api/transactions/",
        "/api/transactions/create/",
        "/api/transactions/<id>/",
        "/api/transactions/delete/<id>/",
        "/api/transactions/update/<id>/",

    ]
    
    return Response(routes)


@api_view(['GET'])
def getTransactions(request):
    transactions = Transaction.objects.all()
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getTransaction(request, pk):
    transaction = Transaction.objects.get(id=pk)
    serializer = TransactionSerializer(transaction, many=False)
    return Response(serializer.data)