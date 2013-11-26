//site.js

function getParameterByName(name){
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

StackMob.init({
    appName: "coffeelog",
    clientSubdomain: "bennettbluebottlecoffeecom",
    publicKey: "e8f36db3-d231-438c-b6f7-4f7affed07ce",
    apiVersion: 1
   // useRelativePathForAjax: false
    //publicKey: "8480bb0b-99bc-4acc-abc9-0a19bd5eab1e",
    //apiVersion: 0
});


StackMob.isLoggedIn({
  no: function(){
    if (getParameterByName("redir") != "true"){
      window.location="/login.html?redir=true";
    }
  }
});

// ===== SCHEMA SETUP

// User
var username = StackMob.getLoggedInUser();
if (username) { var user = new StackMob.User({'username': username}); };

// Users
var users = new StackMob.Users();

//Roles
var Role = StackMob.Model.extend({ schemaName: 'aclrole' });
var Roles = StackMob.Collection.extend({ model: Role });
var roles = new Roles();

// Locations
var Loc = StackMob.Model.extend({ schemaName: 'location' });
var Locs = StackMob.Collection.extend({ model: Loc });
var locations = new Locs();

// Coffees
var Coffee = StackMob.Model.extend({ schemaName: 'coffee' });
var Coffees = StackMob.Collection.extend({ model: Coffee });
var coffees = new Coffees();

// Roasts
var Roast = StackMob.Model.extend({ schemaName: 'roast' });
var Roasts = StackMob.Collection.extend({ model: Roast });
var roasts = new Roasts();

// Notes
var Note = StackMob.Model.extend({ schemaName: 'note' });
var Notes = StackMob.Collection.extend({ model: Note });
var notes = new Notes();

// Espresso Note
var EspressoNote = StackMob.Model.extend({ schemaName: 'espresso_note' });
var EspressoNotes = StackMob.Collection.extend({ model: EspressoNote });
var espressoNotes = new EspressoNotes();

// Drip Note
var DripNote = StackMob.Model.extend({ schemaName: 'drip_note' });
var DripNotes = StackMob.Collection.extend({ model: DripNote });
var dripNotes = new DripNotes();

// Beehouse Note
var BeehouseNote = StackMob.Model.extend({ schemaName: 'beehouse_note' });
var BeehouseNotes = StackMob.Collection.extend({ model: BeehouseNote });
var beehouseNotes = new BeehouseNotes();

// Siphon Note
var SiphonNote = StackMob.Model.extend({ schemaName: 'siphon_note' });
var SiphonNotes = StackMob.Collection.extend({ model: SiphonNote });
var siphonNotes = new SiphonNotes();

// Nel Note
var NelNote = StackMob.Model.extend({ schemaName: 'nel_note' });
var NelNotes = StackMob.Collection.extend({ model: NelNote });
var nelNotes = new NelNotes();

// Chemex Note
var ChemexNote = StackMob.Model.extend({ schemaName: 'chemex_note' });
var ChemexNotes = StackMob.Collection.extend({ model: ChemexNote });
var chemexNotes = new ChemexNotes();

// Cupping Note
var CuppingNote = StackMob.Model.extend({ schemaName: 'cupping_note' });
var CuppingNotes = StackMob.Collection.extend({ model: CuppingNote });
var cuppingNotes = new CuppingNotes();

// Messages
var Message = StackMob.Model.extend({ schemaName: 'messages' });
var Messages = StackMob.Collection.extend({ model: Message });
var messages = new Messages();

var qAll = new StackMob.Collection.Query();

// ===== HELPER METHODS
function getAllLocations() {
  locations.query(qAll, {
    success: function(col){
      col.each(function(model){
        $(".locations").append("<li>" + model.get('name') + "</li>");
      })
    },
    error: function(){ console.log("bad"); }
  });
};

function getCoffees() {
  coffees.query(qAll, {
    success: function(col){
      col.each(function(model){
        $(".coffees").append("<li>" + model.get('name') + "</li>");
      })
    },
    error: function(){ console.log("bad"); }
  });
};


/*
 * ==========
 * LOCATIONS
 * ==========
 */

function createNewLocation(locName, locCoffees){
  var dfd = new jQuery.Deferred();

  var newLocation = new Loc({
    name : locName,
    active : true,
    coffees : locCoffees || undefined
  });

  newLocation.create({
    success: function(model){ dfd.resolve(model) },
    error: function(model){ dfd.reject(model) }
  });

  return dfd.promise();
};

function assignLocationToCoffee(coffee, location){
  var dfd = new jQuery.Deferred();

  var coffee = new Coffee({coffee_id: coffee});

  coffee.appendAndSave('locations', [location], {
    success: function(model){ dfd.resolve(model) },
    error: function(model){ dfd.reject(model) }
  });

  return dfd.promise();
};

function assignLocationToCoffees(coffees, location){
  var dfd = new jQuery.Deferred();

  if ( coffees != null ){
    var deferreds = coffees.map(function(coffeeId) {
      return assignLocationToCoffee(coffeeId, location);
    });

    $.when(deferreds)
    .then(
      function(status) { dfd.resolve(status) },
      function(status) { dfd.reject(status) }
    );
  } else {
    dfd.resolve(location);
  }

  return dfd.promise();
};

function removeLocation(location){
  var dfd = new jQuery.Deferred();

  var newLocation = new Loc({
    location_id : location,
  });
  newLocation.set({
    active : false
  });
  newLocation.save({
    success: function(model){ dfd.resolve(location) },
    error: function(model){ dfd.reject(location) }
  });

  return dfd.promise();
};

function removeLocationFromCoffee(coffee, location){
  var dfd = new jQuery.Deferred();

  var coffee = new Coffee({coffee_id: coffee});

  coffee.deleteAndSave('locations', [location], {
    success: function(model){ dfd.resolve(location) },
    error: function(model){ dfd.reject(location) }
  });

  return dfd.promise();
};

function removeLocationFromAllCoffees(location){
  var dfd = new jQuery.Deferred();

  var hasLocation = new StackMob.Collection.Query();
  hasLocation.mustBeOneOf('locations', location);
  coffees.query(hasLocation, {
    success: function(collection){
      var deferreds = collection.map(function(coffee) {
        return removeLocationFromCoffee(coffee.get('coffee_id'), location);
      });

      $.when(deferreds)
      .then(
        function(status) { dfd.resolve(location) },
        function(status) { dfd.reject(location) }
      );

    },
    error: function(){
      console.log("Error removing location from coffees.");
    }
  });

  return dfd.promise();
}

/*
 * ==========
 * COFFEES
 * ==========
 */

function createNewCoffee(coffeeName, coffeeLocations){
  var dfd = new jQuery.Deferred();

  var newCoffee = new Coffee({
    name : coffeeName,
    locations : coffeeLocations || undefined
  });

  newCoffee.create({
    success: function(model){ dfd.resolve(model) },
    error: function(model){ dfd.reject(model) }
  });

  return dfd.promise();
};

function assignCoffeeToLocation(location, coffee){
  var dfd = new jQuery.Deferred();

  var location = new Loc({location_id: location});

  location.appendAndSave('coffees', [coffee], {
    success: function(model){ dfd.resolve(model) },
    error: function(model){ dfd.reject(model) }
  });

  return dfd.promise();
};

function assignCoffeeToLocations(locations, coffee){
  var dfd = new jQuery.Deferred();

  if ( locations != null ){
    var deferreds = locations.map(function(locationId) {
      return assignCoffeeToLocation(locationId, coffee);
    });

    $.when(deferreds)
    .then(
      function(status) { dfd.resolve(status) },
      function(status) { dfd.reject(status) }
    );
  } else {
    dfd.resolve(coffee);
  }

  return dfd.promise();
};

/*
function removeCoffee(coffee){
  var dfd = new jQuery.Deferred();

  var newCoffee = new Coffee({
    coffee_id : coffee,
  });

  newCoffee.destroy({
    success: function(model){ dfd.resolve(coffee) },
    error: function(model){ dfd.reject(coffee) }
  });

  return dfd.promise();
};
*/
function removeCoffeeFromLocation(location, coffee){
  var dfd = new jQuery.Deferred();

  var location = new Loc({location_id: location});

  location.deleteAndSave('coffees', [coffee], {
    success: function(model){ dfd.resolve(model) },
    error: function(model){ dfd.reject(model) }
  });

  return dfd.promise();
};

function removeCoffeeFromAllLocations(coffee){
  var dfd = new jQuery.Deferred();

  var hasCoffee = new StackMob.Collection.Query();
  hasCoffee.mustBeOneOf('coffees', coffee);
  locations.query(hasCoffee, {
    success: function(collection){
      var deferreds = collection.map(function(location) {
        return removeCoffeeFromLocation(location.get('location_id'), coffee);
      });

      $.when(deferreds)
      .then(
        function(status) { dfd.resolve(coffee) },
        function(status) { dfd.reject(coffee) }
      );

    },
    error: function(){
      console.log("Error removing coffee from locations.");
    }
  });

  return dfd.promise();
}

/*
 * ==========
 * MISC
 * ==========
 */

function refreshWithMessage(msg){
  var l = window.location.pathname + "?message=" + msg;
  window.location = l;
}

function ifAdmin(){
  var dfd = new jQuery.Deferred();

  var admin = new Role({role_id: "admin"});

  admin.fetch({
    success: function(model){
      var isAdmin = false;
      _.each( model.get(0).members, function(item){
        if (item == username) { isAdmin = true; }
      });

      isAdmin ? dfd.resolve() : dfd.reject();
    },
    error: function(){
      dfd.reject();
    }
  });

  return dfd.promise();
}

function durationStringToMilliseconds(str){
  var sp = str.split(":");
  var h = parseInt(sp[0]),
      m = parseInt(sp[1]),
      s = parseInt(sp[2]);
  return ( (60*60*h) + (60*m) + s) * 1000;
}

function millisecondsToDurationString(ms){
  var sec = ms / 1000;
  var s = sec%60,
      m = (sec%(60*60)-s)/60,
      h = (sec-(m*60)-s)/60/60;


  var timeArray = [h, m, s];

  timeArray = _.map(timeArray,function(time){
    return time < 10 ? "0" + time : time;
  });

  return timeArray[0] + ":" + timeArray[1] + ":" + timeArray[2];
}

function parseInputs(inputs){
  var jsonForm = {};

  inputs.each(function(){
    var name = $(this).attr("name"),
        type = $(this).attr("type"),
        step = $(this).attr('step'),
        val  = $(this).val();

    if (val == "" || type == "submit") return;

    switch (type){
      case "number":
        if (step == "any")
          jsonForm[name] = parseFloat(val);
        else
          jsonForm[name] = parseInt(val);
        break;

      case "radio":
        if ($(this).hasClass("milk") && $(this).is(":checked")) {
          jsonForm[name] = (val == "YES") ? true : false;
        } else if ($(this).hasClass("true_to_intent") && $(this).is(":checked")) {
          jsonForm[name] = (val == "YES") ? true : false;
        } else if ( $(this).is(":checked") ) {
          jsonForm[name] = val;
        }
        break;

      case "checkbox":
        jsonForm[name] = $(this).is(":checked");
        break;

      default:
        if ($(this).hasClass("date-input") ) {
          var convertedDate = new Date(val);
          var offset = convertedDate.getTimezoneOffset();
          jsonForm[name] = convertedDate.getTime() - (offset * 60000);
          if (name == "preparation_date") {
            jsonForm["prep_date_string"] = convertedDate.toString();
          } else if (name == "roastdate") {
            jsonForm["roast_date_string"] = convertedDate.toString();
          }
        } else if ( $(this).hasClass("time_entry_sec") || $(this).hasClass("time_entry_min")) {
          jsonForm[name] = durationStringToMilliseconds(val);
          console.log(jsonForm[name]);
        } else
          jsonForm[name] = val;
        break;
    }

  });
  return jsonForm;
}

$(document).ready(function(){

  $(".date-input").datepicker();

  $(".dialog").dialog({
        dialogClass: "alert",
        draggable: false,
        autoOpen: false,
        modal: true,
        buttons: {
          "OK": function() {
            $(this).dialog("close");
          }
        },
        title: "Error",
        resizable: false
  });

  // q.mustBeOneOf('members', )

  ifAdmin().then(
    function(){
      $(".nav li.admin").css("display", "initial");
    }
  );

});


/*
  CSV EXPOT
 */
function saveFile(str){
  if (navigator.appName != 'Microsoft Internet Explorer'){
    // window.open('data:text/csv;charset=utf-8,' + escape(str));

    // This is a workaround so that we get a filename

    var uri = 'data:text/csv;charset=utf-8,' + escape(str);

    var downloadLink = document.createElement("a");
    downloadLink.href = uri;
    downloadLink.download = "data.csv";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } else{
    console.log("not ie");
    var popup = window.open('','csv','');
    popup.document.body.innerHTML = '<pre>' + str + '</pre>';
  }
}

/**
* trimTail function trims the ending , after row reading ends
*/
function trimTail(str){
  var tail = str.substring( 0, str.length - 1 );
  return tail;
}

/**
* Main function that is to be called to read table content before saving
*/
function saveTable(t){
  var table     = document.getElementById(t),
      rowLength = table.rows.length,
      colLength = table.rows[0].cells.length,
      header    = "",
      body      = "";

  for( var i=0; i<colLength; i++ ){
    header = header + table.rows[0].cells[i].innerHTML + ",";
  };

  header = trimTail( header );

  for( var j=1; j<rowLength; j++ ){
    for( var k=0; k<colLength; k++ ){ // reading content of each column
      body = body + table.rows[j].cells[k].innerHTML + ",";
    }
    body = trimTail( body ) + '\r\n';
  };

  body = header + '\r\n' + body;
  saveFile( body );
}
