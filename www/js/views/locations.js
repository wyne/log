// View
var LocationsSelectView = Backbone.View.extend({

  model: new Locations(),

  el: $('#locations-select-container'),

  initialize: function() {
    // Events
    this.model.on('all', this.render, this);

    // Template
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

// Standalone Location

var LocationView = Backbone.View.extend({
  model: new Location(),
  tagName: 'div',

  events: {
    'click .delete': 'destroy',
    'click .edit': 'edit',
    'dblclick .name': 'edit',
    'blur .name': 'close',
    'keypress .name': 'onEnterUpdate'
  },

  initialize: function() {
    this.template = _.template($('#location-template').html());
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
        'remote_ignore': ['coffees']
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

    var html = this.template(this.model.toJSON());

    this.$el.html(html).addClass('location');

    return this;
  }
});

// A Coffee's Location

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

// List
var LocationsListView = Backbone.View.extend({

  model: new Locations(),

  el: $('#locations-list-container'),

  initialize: function() {
    // Events
    this.model.on('all', this.render, this);

    var self = this;

    self.render();
  },

  render: function() {
    var self = this;

    this.$el.html('');

    _.each(this.model.toArray(), function(location, i) {
      // console.log(location);
      var template = new LocationView({
        model: location
      }).render().$el;

      self.$el.append(template);
    });

    return this;
  }

});