var LocationsView = StackMob.View.extend({
  model: new Location(),
  initialize: function() {
    this.template = _.template($('#locations-template').html());
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
  }
});