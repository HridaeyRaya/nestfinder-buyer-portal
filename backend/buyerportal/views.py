from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import RegisterSerializer, LoginSerializer, FavouriteSerializer
from drf_yasg.utils import swagger_auto_schema
from .models import Favourite 

# Register 
class RegisterView(APIView):
    permission_classes = [AllowAny]  # allows anyone to register

    @swagger_auto_schema(request_body=RegisterSerializer)
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            if User.objects.filter(username=email).exists():
                return Response({"error": "Email already taken"}, status=status.HTTP_400_BAD_REQUEST)

            # Use email as username
            User.objects.create_user(username=email, email=email, password=password)
            return Response({"message": "User created"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login
class LoginView(APIView):
    permission_classes = [AllowAny]  # anyone can login

    @swagger_auto_schema(request_body=LoginSerializer)
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            try:
                user_obj = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

            user = authenticate(username=user_obj.username, password=password)
            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    "access": str(refresh.access_token),
                    "refresh": str(refresh)
                })
            
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Add Favourite 
class AddFavourite(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=FavouriteSerializer)
    def post(self, request):
        item_name = request.data.get('item_name', '').strip()
        image_url = (request.data.get('image_url') or '').strip()

        if not item_name:
            return Response({"error": "Property name cannot be empty"}, status=400)
        if len(item_name) > 200:
            return Response({"error": "Property name is too long"}, status=400)
        if Favourite.objects.filter(user=request.user, item_name=item_name).exists():
            return Response({"error": "Already in favourites"}, status=400)

        Favourite.objects.create(
            user=request.user,
            item_name=item_name,
            image_url=image_url or None
        )
        return Response({'message': 'Added to favourites'}, status=201)


# List Favourites 
class ListFavourite(APIView):
    permission_classes = [IsAuthenticated]

    
    def get(self, request):
        favs = Favourite.objects.filter(user = request.user)
        serializers = FavouriteSerializer(favs, many = True)

        return Response(serializers.data)


# Delete Favourites 
class DeleteFavourite(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            fav = Favourite.objects.get(id = id, user = request.user)
            fav.delete()

            return Response({"message": "Deleted"})

        except Favourite.DoesNotExist:
            return Response({"error": "Not Found"}, status = 404)