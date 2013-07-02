// Select Box

var CoffeesSelectView = Backbone.View.extend({

  model: new Coffees(),

  el: $('#coffees-select-container'),

  initialize: function() {
    // Events
    this.model.on('all', this.render, this);

    // Template
    this.template = _.template($('#coffees-select-template').html());

    var self = this;

    self.render();
  },

  render: function() {
    var coffees_select_template = this.template({
      model: this.model
    });

    this.$el.html(coffees_select_template);

    return this;
  }

});

// Model

var CoffeeView = Backbone.View.extend({

  defaults: {
    name: '',
    locations: []
  },

  model: new Coffee(),

  events: {
    'click .delete': 'destroy',
    'click .edit': 'edit',
    'dblclick .name': 'edit',
    'blur .name': 'close',
    'keypress .name': 'onEnterUpdate'
  },

  initialize: function() {
    // Events
    this.model.on('fetch', this.render, this);
    this.model.on('destroy', this.render, this);

    // Template
    this.template = _.template($('#coffee-template').html());

    this.render();
  },

  edit: function(e) {
    e.preventDefault();
    this.$('.name').attr('contenteditable', true).focus();
  },

  destroy: function(e) {
    e.preventDefault();
    this.model.destroy();
  },

  close: function() {
    var name = this.$('.name').text();

    // Save if updated
    if (name !== this.model.get('name')) {
      var self = this;
      this.model.save({
        'name': name
      }, {
        'remote_ignore': ['locations']
      }).then(function() {
        return self.model.fetchExpanded(1);
      }).done(function() {
        self.model.trigger('fetch');
      });
    }

    this.$('.name').attr('contenteditable', false);
  },

  onEnterUpdate: function(ev) {
    if (ev.keyCode === 13) {
      ev.preventDefault();

      this.close();
      // Blur workaround
      var self = this;
      _.delay(function() {
        self.$('.name').blur();
      }, 100);
    }
  },

  render: function() {
    var coffee_template = this.template(this.model.toJSON());

    var self = this;

    this.$el.html(coffee_template).addClass('coffee');

    _.each(this.model.get('locations'), function(location, i) {
      self.$('.coffee-locations-list').append(new CoffeeLocationView({
        model: location
      }).render().$el);
    });

    return this;
  }
});

// List
var CoffeesListView = Backbone.View.extend({

  model: new Coffees(),

  el: $('#coffees-list-container'),

  initialize: function() {
    // Events
    this.model.on('all', this.render, this);

    var self = this;

    self.render();
  },

  render: function() {
    var self = this;

    this.$el.html('');

    _.each(this.model.toArray(), function(coffee, i) {
      var template = new CoffeeView({
        model: coffee
      }).render().$el;

      self.$el.append(template);
    });

    return this;
  }

});