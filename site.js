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