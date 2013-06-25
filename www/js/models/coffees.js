// Coffee
var Coffee = StackMob.Model.extend({
  schemaName: 'coffee'
});
var Coffees = StackMob.Collection.extend({
  model: Coffee
});