// Model
var Coffee = StackMob.Model.extend({
  schemaName: 'coffee'
});

// Collection
var Coffees = StackMob.Collection.extend({
  model: Coffee
});