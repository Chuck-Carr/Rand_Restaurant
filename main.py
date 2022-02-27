import random
import googlemaps
from api import key

from flask import Flask, render_template, request
app = Flask(__name__)


@app.route('/', methods=['POST', 'GET'])
def index():
    return render_template('index.html')


@app.route('/form', methods=["POST"])
def form():
    if request.form.get("keyword"):
        keyword = request.form.get("keyword")
    else:
        keyword = "Food"
    lat = request.form.get("lat")
    long = request.form.get("long")
    api_key = key
    gmaps = googlemaps.Client(key=api_key)
    # coords = '39.17534,-84.29438'
    coords = lat, long
    places_result = gmaps.places_nearby(
        location=coords, radius=17000, open_now=False, keyword=keyword)
    dinner_choices = []
    for place in places_result['results']:
        # define my place id
        my_place_id = place['place_id']
    # define the fields we want to send back to us
        my_fields = ['name', 'formatted_phone_number', 'formatted_address']
    # make a request for the details
        place_details = gmaps.place(place_id=my_place_id, fields=my_fields)
    # add to dinner choices
        dinner_choices.append(place_details)
    choice = random.choice(dinner_choices)
    rand_dinner_choice = f"{choice['result']['name']} - {choice['result']['formatted_address']} - {choice['result']['formatted_phone_number']}"
    print(rand_dinner_choice)
    return render_template('form.html', keyword=keyword, lat=lat, long=long, dinner=rand_dinner_choice)
