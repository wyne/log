// Model
var Location = StackMob.Model.extend({
  schemaName: 'location'
});

// Collection
var Locations = StackMob.Collection.extend({
  model: Location
});