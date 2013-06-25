// View
var LocationsView = Backbone.View.extend({

  model: new Locations(),

  el: $("#locations-select-container"),

  initialize: function() {
    this.template = _.template($("#locations-select-template").html());

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