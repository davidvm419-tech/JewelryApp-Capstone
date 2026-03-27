from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError
from django.core.paginator import Paginator
from django.core.validators import validate_email
from django.db import IntegrityError
from django.db.models import Avg
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST

import json

from .models import (Category, CartItem, Comment, Order, OrderItem, Product, 
                     ProductImage, Rating, User, Wishlist)

from .helpers import paginate

# Create your views here.

# Generate token and send user information if is authenticated for landing page and dashboard
def get_session(request):
    return JsonResponse({
        "token": get_token(request),
        "is_authenticated": request.user.is_authenticated,
        "username": request.user.username if request.user.is_authenticated else None,   
        "user_id": request.user.id if request.user.is_authenticated else False, 
        })


# Products for complete catalog
def catalog(request):

    products_catalog = Product.objects.all().order_by("-created_at")

    items_per_page = 9

    # function to create pagination sending the objects to paginate and the page
    page_obj, pagination = paginate(products_catalog, request.GET.get("page"), items_per_page)    

    # Return JSON response
    return JsonResponse({
        "products": [product.serialize(request) for product in page_obj.object_list],
        "pagination": pagination, 
        }, status=200)


# Function to get product details
def product_details(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    return JsonResponse(product.serialize(request), status=200)

# Images for product section
def images(request, product_id):
    images = ProductImage.objects.filter(pk=product_id)
    # Request to send the absolute route of the image to the front end
    return JsonResponse({"images":[image.serialize(request) for image in images]}, safe=False, status=200)


# Add a product rating
@login_required
def add_rating(request, product_id):
    # Confirm method
    if request.method != "POST":
        return JsonResponse({"error": "Wrong method, POST expected"}, status=400)
    
    # Get JSON data
    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error": "Error recieving data, JSON data invalid"}, status=400)
    
    # Check valid data (third protection on rating value)
    try:
        rating = int(data.get("rating"))
        if rating < 1 or rating > 5:
            return JsonResponse({"error": "rating is not a valid number between 1 and 5"}, status=400)
    except:
        return JsonResponse({"error": "rating is not a valid number between 1 and 5"}, status=400) 

    # Add rating to database
    try:
        new_rating = Rating.objects.create(
            user=request.user,
            product=Product.objects.get(pk=product_id),
            rating=rating,
            )
    except IntegrityError:
        return JsonResponse({"error": "You already rated this product"}, status=400) 

    # Get new values to update state
    new_avg = Rating.objects.filter(product=product_id).aggregate(avg=Avg("rating"))["avg"]
    
    # Return response
    return JsonResponse({
        "message": "Thanks for rate this product!",
        "new_avg": new_avg,
        "new_rating": new_rating.serialize(),
        }, status=200)


# Edit rating
@login_required
def edit_rating(request, product_id):
    # confirm method
    if request.method != "PUT":
        return JsonResponse({"error": "Wrong method, PUT expected"}, status=400)
    
    # Get JSON data
    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error": "Error recieving data, JSON data invalid"}, status=400)
    
    # Check valid data (third protection on rating value)
    try:
        rating = int(data.get("rating"))
        if rating < 1 or rating > 5:
            return JsonResponse({"error": "rating is not a valid number between 1 and 5"}, status=400)
    except:
        return JsonResponse({"error": "rating is not a valid number between 1 and 5"}, status=400)
    
    # Ensure user updating is the same
    rate_product = get_object_or_404(Rating, user=request.user, product=product_id)
    if rate_product.user != request.user:
        return JsonResponse({"error": "Not authorized to update this post"}, status=403)

    # Update data base
    try:
        rate_product.rating = rating
        rate_product.save()

    except IntegrityError:
        return JsonResponse({"error": "You already rated this product"}, status=400) 

    # Get udpated values
    new_avg = Rating.objects.filter(product=product_id).aggregate(avg=Avg("rating"))["avg"]
        
    #return response
    return JsonResponse({
        "message": "Rating updated!",
        "new_avg": new_avg,
        "new_rating": rate_product.serialize(),
        }, status=200)



# User login 
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