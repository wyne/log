// Espresso Note
var EspressoNote = StackMob.Model.extend({
  schemaName: 'espresso_note'
});
var EspressoNotes = StackMob.Collection.extend({
  model: EspressoNote
});
var espressoNotes = new EspressoNotes();

// Espresso Note
var DripNote = StackMob.Model.extend({
  schemaName: 'drip_note'
});
var DripNotes = StackMob.Collection.extend({
  model: DripNote
});
var dripNotes = new DripNotes();

// Espresso Note
var SiphonNote = StackMob.Model.extend({
  schemaName: 'siphon_note'
});
var SiphonNotes = StackMob.Collection.extend({
  model: SiphonNote
});
var siphonNotes = new SiphonNotes();