// View
var LocationsView = Backbone.View.extend({

  model: new Locations(),

  el: $('#locations-select-container'),

  initialize: function() {
    this.template = _.template($('#locations-select-template').html());

    var self = this;

    this.model.fetch({
      success: function() {
        self.render();
      }
    });
  },

  render: function() {
    var locations_select_template = this.template({
      model: this.model
    });

    this.$el.html(locations_select_template);

    return this;
  }

});

// Location

var CoffeeLocationView = Backbone.View.extend({

  model: new Location(),

  tagName: 'li',

  initialize: function() {
    // Template
    this.template = _.template($('#coffee-location-template').html());

    this.render();
  },

  render: function() {
    // this.model.toJSON()
    var coffee_location_template = this.template(this.model);

    this.$el.html(coffee_location_template);

    return this;
  }
});