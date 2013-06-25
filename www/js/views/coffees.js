// var CoffeeView = Backbone.View.extend({
//   tagName: 'div',
//   model: new Coffee(),
//   initialize: function() {
//     this.template = _.template($('#coffees-template').html());
//   },
//   render: function(){

//   }
// });

var CoffeesView = Backbone.View.extend({
  // el: $("#coffees-select-container"),

  model: new Coffees(),
  tagName: 'div',

  initialize: function() {
    // this.template = _.template($('#coffees-select-template').html());
    // this.coffees = new Coffees();
    // this.coffees.add(new Coffee({
    //   name: 'first'
    // }));
    //
    this.template = _.template($("#coffees-select-template").html());

    var self = this;
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