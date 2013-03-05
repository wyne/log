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
    publicKey: "8480bb0b-99bc-4acc-abc9-0a19bd5eab1e",
    apiVersion: 0
});

if(StackMob.isLoggedOut()){
  if (getParameterByName("redir") != "true"){
    window.location="/login.html?redir=true";
  }
}

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

// Espresso Note
var EspressoNote = StackMob.Model.extend({ schemaName: 'espresso_note' });
var EspressoNotes = StackMob.Collection.extend({ model: EspressoNote });
var espressoNotes = new EspressoNotes();

// Espresso Note
var DripNote = StackMob.Model.extend({ schemaName: 'drip_note' });
var DripNotes = StackMob.Collection.extend({ model: DripNote });
var dripNotes = new DripNotes();

// Espresso Note
var SiphonNote = StackMob.Model.extend({ schemaName: 'siphon_note' });
var SiphonNotes = StackMob.Collection.extend({ model: SiphonNote });
var siphonNotes = new SiphonNotes();


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

  newLocation.destroy({
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

function durationStringToSeconds(str){
  var sp = str.split(":");
  var h = sp[0];
  var m = sp[1];
  var s = sp[2];
  return (60*60*h) + (60*m) + s;
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
        } else if ( $(this).is(":checked") ) {
          jsonForm[name] = val;
        }
        break;

      case "checkbox":
        jsonForm[name] = $(this).is(":checked");
        break;

      default:
        if ($(this).hasClass("date-input") )
          jsonForm[name] = new Date(val).getTime();
        else
          jsonForm[name] = val;
        break;
    }

  });
  return jsonForm;
}

$(document).ready(function(){

  $(".date-input").datepicker();

  // q.mustBeOneOf('members', )

  ifAdmin().then(
    function(){
      $(".nav li.admin").css("display", "initial");
    }
  );

});
