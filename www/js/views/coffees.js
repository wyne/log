// Model

var CoffeeView = Backbone.View.extend({

  model: new Coffee(),

  tagName: 'div',

  initialize: function() {

  },

  render: function() {
    return this;
  }
});

// Collection

var CoffeesView = Backbone.View.extend({

  model: new Coffees(),

  el: $("#coffees-select-container"),

  initialize: function() {
    // Events
    this.model.on('add', this.render, this);

    // Template
    this.template = _.template($("#coffees-select-template").html());

    var self = this;

    // Fetch
    this.model.fetch({
      success: function() {
        self.render();
      }
    });
  },

  render: function() {
    var coffees_select_template = this.template({
      model: this.model
    });

    this.$el.html(coffees_select_template);

    return this;
  }

});