from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError
from django.core.paginator import Paginator
from django.core.validators import validate_email
from django.db import IntegrityError
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

import json

from .models import (Category, CartItem, Comment, Order, OrderItem, Product, 
                     ProductImage, Rating, User, Wishlist)

# Create your views here.

# Generate token and send user information if is authenticated for landing page and dashboard
def get_session(request):
    return JsonResponse({
        "token": get_token(request),
        "is_authenticated": request.user.is_authenticated,
        "username": request.user.username if request.user.is_authenticated else None,    
        })


# Products for complete catalog
def catalog(request):
    products_catalog = Product.objects.all().order_by("-created_at")

    # 12 products per page
    paginator = Paginator(products_catalog, 12)
    
    # Get page number
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    # Pass valid or invalid page
    if page_obj.has_next():
        next_page = page_obj.next_page_number()
    else:
        next_page = None

    if page_obj.has_previous():
        prev_page = page_obj.previous_page_number()
    else:
        prev_page = None

    # Return JSON response
    return JsonResponse({
        "products": [product.serialize(request) for product in page_obj.object_list],
        "pagination": {
            "total_pages": paginator.num_pages,
            "current_page": page_obj.number,
            "has_previous": page_obj.has_previous(),
            "has_next": page_obj.has_next(),
            "next_page": next_page,
            "prev_page": prev_page,
        }
        }, status=200)

# Images for product sections (REFACTOR TO THE IMAGES FOR THE PRODUCT)
def images(request):
    images = ProductImage.objects.all()
    # Request to send the absolute route of the image to the front end
    return JsonResponse([image.serialize(request) for image in images], safe=False, status=200)


# User login registration and logout    

def login_view(request):
    # Confirm method
    if request.method != "POST":
        return JsonResponse({"error": "Wrong method, POST expected"}, status=400)
    
    # Get JSON data
    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error": "Error recieving data, JSON data invalid"}, status=400)
    
    identification = data.get("identification", "").strip()
    password = data.get("password", "").strip()

    # Check if user login with email or username
    if "@" in identification:
        try:
            user = User.objects.get(email=identification)
            username = user.username
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid username/email, please try again"}, status=400)
    else:
        username = identification

    # Authenticate user information
    user = authenticate(request, username=username, password=password)

    if user is None:
        return JsonResponse({"error": "Invalid username/email or password, please try again"}, status=400)
    
    # Log in user and return JSON response
    login(request, user)
    return JsonResponse({"message": f"welcome back {user.username}!"}, status=200)


def register_view(request):
    # Confirm post method
    if request.method != "POST":
        return JsonResponse({"error": "Wrong method, POST expected"}, status=400)
    
    # Get JSON data
    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error": "Error recieving data, JSON data invalid"}, status=400)
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()
    password_confirmation = data.get("confirmation", "").strip()
    email = data.get("email", "").strip()
    first_name = data.get("name", "").strip()
    last_name = data.get("last_name", "").strip()

    # Check password constrains (8 char and 1 number) and passwords match
    if len(password) < 8:
        return JsonResponse({"error": "password must have at least 8 characters and 1 number!"}, status=400) 
    
    is_digit = False
    for char in password:
        if char.isdigit():
            is_digit = True
            break
    if not is_digit:
        return JsonResponse({"error": "password must have at least 8 characters and 1 number!"}, status=400)

    if password != password_confirmation:
        return JsonResponse({"error": "passwords don't match!"}, status=400)
    
    # Check username is not taken
    user_check = User.objects.filter(username=username).exists()
    if user_check:
        return JsonResponse({"error": "user already exists"}, status=400)
    
    # Check vaild email
    try:
        validate_email(email)
    except ValidationError:
        return JsonResponse({"error": "invalid email"}, status=400)
    
    # Avoid user creates an account with the same email
    email_check = User.objects.filter(email=email).exists()
    if email_check:
        return JsonResponse({"error": "user already exists"}, status=400)

    # Add data to data base
    try:
        user = User.objects.create_user(
            username=username, password=password, email=email, 
            first_name=first_name, last_name=last_name)
    except IntegrityError:
        return JsonResponse({"error": "User already exists"}, status=400) 
    
    # login user and return JSON response
    login(request, user)
    return JsonResponse({"message": "User successfully created!"}, status=200) 

@require_POST
def logout_view(request):
    # Confirm post method 
    if request.method != "POST":
        return JsonResponse({"error": "Wrong method, POST expected"}, status=400)
    
    # Log out user and return JSON response
    logout(request)
    return JsonResponse({"message": "logout successfull, see you later!"}, status=200)