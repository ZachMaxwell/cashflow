from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Transaction

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)
    user_id = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['user_id', 'username', 'email', 'name', 'isAdmin']

    def get_isAdmin(self, obj):
        return obj.is_staff
        
    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email
        return name
    
    def get_user_id(self, obj):
        user_id = obj.id
        return user_id
        

class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['user_id', 'username', 'email', 'name', 'isAdmin', 'token']
    
    def get_token(self, obj):
        token = RefreshToken.for_user(obj) #token is equal to the current token associated with the current user object
        print('inside user serialize with token', token)
        return str(token.access_token)


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = "__all__"

