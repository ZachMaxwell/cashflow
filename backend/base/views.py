from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Transaction
from .serializers import TransactionSerializer


@api_view(['GET'])
def getRoutes(request):

    routes = [

        "/api/transactions/",
        "/api/transactions/<str:pk>/",
        "/api/transactions/create/",
        "/api/transactions/delete/<str:pk>/",
        "/api/transactions/update/<str:pk>/",

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

@api_view(['POST'])
def createTransaction(request):
    data = request.data
    serializer = TransactionSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
def deleteTransaction(request, pk):
    transaction = Transaction.objects.get(id=pk)
    transaction.delete()
    return Response("Item successfully deleted!")

@api_view(['PUT'])
def updateTransaction(request, pk):
    transaction = Transaction.objects.get(id=pk)
    serializer = TransactionSerializer(instance=transaction, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)