from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Transaction
from .serializers import TransactionSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import login, authenticate
from django.views.decorators.csrf import csrf_exempt
import json


@api_view(['GET'])
def getRoutes(request):

    routes = [

        
        "/api/transactions/",
        "/api/transactions/<str:pk>/",
        "/api/transactions/create/",
        "/api/transactions/delete/<str:pk>/",
        "/api/transactions/update/<str:pk>/",
        "/api/transaction-model-fields-and-types/",
        "/api/transaction-model-form-data-choices/",
        #"/api/login/",

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
# @permission_classes([IsAuthenticated])
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

@api_view(['GET'])
def get_transaction_model_fields_and_types(request):
    model = Transaction
    fields_and_types = {}

    for field in model._meta.get_fields():
        field_name = field.name
        field_type = field.get_internal_type()
        fields_and_types[field_name] = field_type

    return Response({'fields_and_types': fields_and_types})

@api_view(['GET'])
def get_transaction_model_form_data_choices(request):
    model = Transaction
    form_data_choices = {}

    for field in model._meta.get_fields():
        if field.choices:
            field_name = field.name
            form_data_choice = field.choices
            form_data_choices[field_name] = form_data_choice
        else:
            form_data_choices[field.name] = ''

    return Response({'form_data_choices': form_data_choices})

@api_view(['POST'])
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'message': 'Login successful'})
        else:
            return JsonResponse({'message': 'Login failed'}, status=401)


