# Flight Tracker App

**App is deployed at: [Flight Tracker](https://flighttracker-frontend.onrender.com/)**


## Installation 


``bash  

git clone https://github.com/tf292201/flighttracker-frontend.git  

cd flighttracker-frontend  

npm install  

npm run dev

## Usage

To use the app, navigate to the deployed URL and log in or create an account. Click on flight markers to view more information about the aircraft.



## User Experience

Flight Tracker is a live flight tracking web app that allows a user to view flights in real time imposed onto a Google map. The direction of the aircraft is demonstrated by the direction of the marker displayed. The location of the markers is updated every ten seconds to simulate a live radar situation.

A user is able to click on any marker and thereby retrieve more information about an aircraft. A bottom drawer will slide up to display this information and a thumbnail photo of the aircraft if available.

If the user is registered and logged in, they will be able to click the "spotted" button in this component to save the selected aircraft to the database.

The user can then navigate to their profile page where a table containing a list of "spotted" flights is kept. The table holds information available for those flights such as the model of aircraft, origin country, call sign, and a thumbnail photograph. There is a delete button next to the row of each entry that a user can use to remove an aircraft.

## API Usage

 ### Google Maps
The user will see a map rendered for their location when visiting the home page, or just logging in. This is done with the Google Maps API.
 ### OPENsky Network
The primary data source for the app is the OpenSky Network REST API, which provides live location and directional data for aircraft. This API also delivers essential details such as the aircraft's call sign and ICAO24 identifier.
 
 ### Planespotter Photo API
Finally, the app uses the ICAO24 number to make a call to the Planespotter Photo API to return a thumbnail photograph of the plane spotted.


## Static Data source
The app makes use of data downloaded from the FAA website. This data is extracted from a csv document and entered into a POSTgres database. This data enhances the details available for an aircraft if it is registered in the United States.

The ICAO24 number, or MODE S code HEX, is a unique identifier for every aircraft. If the aircraft is registered in the United States, the application will reference the database for more detailed information such as model, year of manufacture, and registration using the aircraft's ICAO24 number. Otherwise, this enhanced information will not be available for non-USA registered aircraft.

