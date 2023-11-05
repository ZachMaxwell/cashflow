from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .models import Transaction
from .serializers import TransactionSerializer, UserSerializer, UserSerializerWithToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        print(data)
        
        '''
        # Overriding the validate method to add more data to the response. 
        # Makes it a lot easier to use this data in the frontend. Don't have to decode the token every time I want to get this data
        data['username'] = self.user.username
        data['first_name'] = self.user.first_name
        data['email'] = self.user.email
        '''
        serializer = UserSerializerWithToken(self.user).data

        for k, v in serializer.items(): # loop through all the fields in the UserSerializerWithToken class
            data[k] = v #update the data dictionary with the data from the UserSerializerWithToken class
        
        print(data)

        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

'''
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

    ]
    
    return Response(routes)
'''
    
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

@api_view(['GET'])
def get_transaction_model_fields_and_types(request):
    model = Transaction
    fields_and_types = {}

    for field in model._meta.get_fields():
        print(field)
        if field.name == 'user' or field.name == 'id':
            continue
        else:
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
            continue

    return Response({'form_data_choices': form_data_choices})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user #Because of the decorator @api_view(['GET']) and simpleJWT authentication, this will be the user associated with the token
    serializer = UserSerializer(user, many=False) #passes in the user object and returns a single user
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create_user(
            first_name = data['name'],
            username = data['email'],
            email = data['email'],
            password = data['password'] # removed make_password() because it was giving me a bug when trying to log in with a user I had just registered (not from the admin panel). Inside the User model, the set_password method already takes care of the password hashing, so I was hashing the password twice causing login errors. 
        )
        serializer = UserSerializerWithToken(user, many=False) # using the UserSerializerWithToken makes it possible to get the 'token' right away (upon creation of the user). Will make it possible to log in a user right away upon creation in the frontend
    except:
        message = {'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

    return Response(serializer.data)