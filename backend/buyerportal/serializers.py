from rest_framework import serializers
from .models import Favourite


# Serializers
class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class FavouriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favourite 
        fields = ['id', 'item_name', 'image_url']