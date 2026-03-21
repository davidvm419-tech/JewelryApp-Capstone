from django.shortcuts import render

# Create your views here.
def index(request):
    #Update teh phat when login  and register is implemented
    return render(request, "store/index.html")