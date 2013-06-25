//Roles
var Role = StackMob.Model.extend({
  schemaName: 'aclrole'
});
var Roles = StackMob.Collection.extend({
  model: Role
});