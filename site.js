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
var user = new StackMob.User({'username': username});

// Users
var users = new StackMob.Users();

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

roasts.query(qAll, {
  success: function(col){
    col.each(function(model){
      $(".roasts").append("<li>" + (new Date(model.get('date'))) + "</li>");
    })
  },
  error: function(){ console.log("bad"); }
});


// ===== Objects

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

function assignLocationToCoffee(coffee, location){
  var dfd = new jQuery.Deferred();

  var coffee = new Coffee({coffee_id: coffee});

  coffee.fetch({
    success: function(model){
      model.save({ locations: _.union(model.get('locations') || new Array(), [location]) }, {
        success: function(){
          dfd.resolve(model);
        },
        error : function(){
          dfd.reject(model);
        }
      });
    },
    error: function(model){ dfd.reject(model) }
  });

  return dfd.promise();
};

function assignCoffeeToLocation(location, coffee){
  var dfd = new jQuery.Deferred();

  var location = new Loc({location_id: location});

  location.fetch({
    success: function(model){
      model.save({ coffees: _.union(model.get('coffees') || new Array(), [coffee]) }, {
        success: function(){
          dfd.resolve(model);
        },
        error : function(){
          dfd.reject(model);
        }
      });
    },
    error: function(model){ dfd.reject(model) }
  });

  return dfd.promise();
};

// ===== Misc
function redirectWithMessage(loc, msg){
  window.location = loc + "?message=" + msg;
}