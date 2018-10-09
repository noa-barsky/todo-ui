console.log("houston, we have landed!");

var addPicture = document.getElementById("adder");
var inputField = document.getElementById("enter-bar");
var inputValue = document.getElementById("input-value");

function saveValue(e){
    var id = e.id;
    var val = e.value;
    localStorage.setItem(id,val);
};

function getSavedValue(v){
    if (localStorage.getItem(v) === null) {
        return "Your name";
    }
    return localStorage.getItem(v);
};



function listAdder(){

    var html = '<div class="row"><div class="col-6"><div class="added-item">%description%</div></div><div class="col-6"><div class="checked"><img class="float-right" src="img/checkmark.png"></div></div></div>';
    var newHTML = html.replace ("%description%", inputValue.value);
    inputField.insertAdjacentHTML('afterend', newHTML);
    localStorage.setItem("datakey", JSON.stringify(newHTML))



    
}

function clickEvents () {
    addPicture.addEventListener("click", listAdder);

}

function init(){
    clickEvents ();
    
}


/*Google calendar api code*/

    // Client ID and API key from the Developer Console
    var CLIENT_ID = '131665949872-ptpi7l5kc5okc3t9dfqipfj8ad6mtoed.apps.googleusercontent.com';
    var API_KEY = 'AIzaSyDaO_Ay6ruzywcH5xYOEZT4Y2OXfA7CaHA';

    // Array of API discovery doc URLs for APIs used by the quickstart
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

    var authorizeButton = document.getElementById('authorize_button');
    var signoutButton = document.getElementById('signout_button');

    /**
     *  On load, called to load the auth2 library and API client library.
     */
    function handleClientLoad() {
      gapi.load('client:auth2', initClient);
    }

    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    function initClient() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
      });
    }

    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    function updateSigninStatus(isSignedIn) {
      if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listUpcomingEvents();
      } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
      }
    }

    /**
     *  Sign in the user upon button click.
     */
    function handleAuthClick(event) {
      gapi.auth2.getAuthInstance().signIn();
    }

    /**
     *  Sign out the user upon button click.
     */
    function handleSignoutClick(event) {
      gapi.auth2.getAuthInstance().signOut();
    }

    /**
     * Append a pre element to the body containing the given message
     * as its text node. Used to display the results of the API call.
     *
     * @param {string} message Text to be placed in pre element.
     */
    function appendPre(message) {
      var pre = document.getElementById('content');
      var textContent = document.createTextNode(message + '\n');
      pre.appendChild(textContent);
    }

    /**
     * Print the summary and start datetime/date of the next ten events in
     * the authorized user's calendar. If no events are found an
     * appropriate message is printed.
     */
    function listUpcomingEvents() {
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 5,
        'orderBy': 'startTime'
      }).then(function(response) {
        var events = response.result.items;

        if (events.length > 0) {
          for (i = 0; i < events.length; i++) {
            var event = events[i];
            var when = event.start.dateTime;
            if (!when) {
              when = event.start.date;
            }
            var currMonth = monthNames[when.slice(5,7) - 1 ];
            var currDay = when.slice(8,10);
            var currYear = when.slice(0,4);
            var currTime = when.slice(11,16);
            var currHour = when.slice(11,13);
            var currMin = when.slice(13, 16);
            currDay[0] === "0" ? currDay = currDay.substr(1) : currDay = currDay;
            if (currHour > 12 ) {
              currHour -= 12;
              currMin = currMin + " " + "PM"

             } else {
              currMin = currMin + " " + "AM"

             } 
            currHour[0] === "0" ? currHour = currHour.substr(1) : currHour = currHour;
            appendPre( currMonth + " " + currDay + ", " + currYear);
            appendPre(currHour + currMin + " " + event.summary + "\n");
          }
        } else {
          appendPre('No upcoming events found.');
        }
      });
    }



init();