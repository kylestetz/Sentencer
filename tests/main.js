var assert = require("assert");

var Sentencer = require('../index.js');

describe('Sentencer:', function () {

  it('should exist', function () {
    assert(Sentencer);
  });

  describe('Default', function () {

    describe('# Words', function () {

      it('should include a list of nouns', function () {
        assert(Sentencer._nouns.length);
      });

      it('should include a list of adjectives', function () {
        assert(Sentencer._adjectives.length);
      });

    });

    describe('# Actions', function () {

      it('should include `noun`', function () { assert(Sentencer.actions.noun); });
      it('should include `a_noun`', function () { assert(Sentencer.actions.a_noun); });
      it('should include `nouns`', function () { assert(Sentencer.actions.nouns); });
      it('should include `adjective`', function () { assert(Sentencer.actions.adjective); });
      it('should include `an_adjective`', function () { assert(Sentencer.actions.an_adjective); });

    });

  });

  describe('API', function () {

    it('should include a `configure` function', function () {
      assert(Sentencer.configure);
    });

    it('should merge a new action', function () {
      Sentencer.configure({
        actions: {
          firstNewAction: function () { return 'hello'; }
        }
      });

      assert.equal(Sentencer.actions.firstNewAction(), 'hello');
    });

    it('should accept another action merge later', function () {
      Sentencer.configure({
        actions: {
          secondNewAction: function () { return 'hello again'; }
        }
      });

      assert.equal(Sentencer.actions.firstNewAction(), 'hello', 'first action still exists');
      assert.equal(Sentencer.actions.secondNewAction(), 'hello again', 'second action exists as well');
    });

    it('should include a `make` function', function () {
      assert(Sentencer.make);
    });

    it('should merge a new custom list', function () {
      Sentencer.configure({
        customLists: [
          {
            key: "animal",
            values: ["dog", "cat", "elephant"],
            articlize: "an_animal", // if named, add action that calls articlize
            pluralize: "animals"    // if named, add action that calls pluralize
          }
        ]
      });

      assert(Sentencer.actions.animal);
      assert(Sentencer.actions.an_animal);
      assert(Sentencer.actions.animals);

      assert.notEqual(["dog", "cat", "elephant"].indexOf(Sentencer.actions.animal()), -1, "missing animal");
      assert.notEqual(["a dog", "a cat", "an elephant"].indexOf(Sentencer.actions.an_animal()), -1, "missing an_animal");
      assert.notEqual(["dogs", "cats", "elephants"].indexOf(Sentencer.actions.animals()), -1, "missing animals");
    });

  });

  describe('Templating', function () {

    describe('# Default Actions', function () {

      it('{{ noun }}', function () { assert(Sentencer.make('{{ noun }}')); });
      it('{{ a_noun }}', function () { assert(Sentencer.make('{{ a_noun }}')); });
      it('{{ nouns }}', function () { assert(Sentencer.make('{{ nouns }}')); });
      it('{{ adjective }}', function () { assert(Sentencer.make('{{ adjective }}')); });
      it('{{ an_adjective }}', function () { assert(Sentencer.make('{{ an_adjective }}')); });

    });

    describe('# Custom Actions', function () {

      it('{{ firstNewAction }}', function () {
        assert.equal(Sentencer.make('{{ firstNewAction }}'), 'hello');
      });

      it('{{ secondNewAction }}', function () {
        assert.equal(Sentencer.make('{{ secondNewAction }}'), 'hello again');
      });

      it('should return {{ action }} if it does not exist', function () {
        assert.equal(Sentencer.make('{{ nonexistant thing }}'), '{{ nonexistant thing }}');
      });

    });

    describe('# Custom Actions With Arguments', function () {

      Sentencer.configure({
        actions: {
          withArgument: function (number) {
            return number;
          },
          withArguments: function () {
            return arguments.length;
          }
        }
      });

      it('should allow an action with one argument', function () {
        assert.equal(Sentencer.make('{{ withArgument(1) }}'), 1);
      });

      it('should allow an action with multiple arguments', function () {
        assert.equal(Sentencer.make('{{ withArguments(1,2,3) }}'), 3);
      });

      it('should cast arguments as numbers when possible, otherwise strings', function () {
        var result = null;

        Sentencer.configure({
          actions: {
            test: function () {
              result = Array.prototype.slice.call(arguments);
            }
          }
        });

        Sentencer.make('{{ test(1, hey hello, 2) }}');
        assert.deepEqual(result, [1, 'hey hello', 2]);
      });

      it('should fail silently if an action with arguments does not exist', function () {
        assert.deepEqual(Sentencer.make('{{ nonExistantThing(1,2,3) }}'), '');
      });

      it('pass text through if someone tries to exploit eval', function () {
        assert.deepEqual(
          Sentencer.make('{{ nothing; console.log("This should not evaluate"); }}'),
          '{{ nothing; console.log("This should not evaluate"); }}'
        );
      });

      it('should pass text through when handed some garbage', function () {
        assert.deepEqual(
          Sentencer.make('{{ &@#&(%*@$UU#I$HTRIGUHW$@) }}'),
          '{{ &@#&(%*@$UU#I$HTRIGUHW$@) }}'
        );
      });

    });

    describe('# Custom Lists', function () {

      it('{{ animal }}', function () {
        assert.notEqual(["dog", "cat", "elephant"].indexOf(Sentencer.make('{{ animal }}')), -1, "missing animal");
      });

      it('{{ an_animal }}', function () {
        assert.notEqual(["a dog", "a cat", "an elephant"].indexOf(Sentencer.make('{{ an_animal }}')), -1, "missing an_animal");
      });

      it('{{ animals }}', function () {
        assert.notEqual(["dogs", "cats", "elephants"].indexOf(Sentencer.make('{{ animals }}')), -1, "missing animals");
      });

    });
  });

  describe('Test Print', function () {

    it('should have logged a sentence', function () {
      console.log(Sentencer.make("      Here is {{ an_adjective }} sentence generated by Sentencer's {{ nouns }}."));
    });

  });

});