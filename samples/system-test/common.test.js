// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const common = require('../common');
const {assert} = require('chai');

// This is a very simple yargs mockup for testing the generated
// command line spec.
class YargsMock {
  constructor() {
    this.data = {
      commands: [],
      examples: [],
      epilogue: '',
    };
  }

  command(args, helpText, extraOptions, func) {
    this.data.commands.push({
      args,
      helpText,
      extraOptions,
      func,
    });
    return this;
  }

  example(ex) {
    this.data.examples.push(ex);
    return this;
  }

  wrap() {
    return this;
  }

  recommendCommands() {
    return this;
  }

  epilogue(text) {
    this.data.epilogue = text;
    return this;
  }

  help() {
    return this;
  }

  strict() {
    return this;
  }

  get sampleOpts() {
    return {
      test: 'test',
    };
  }

  get argv() {
    this.data.commands[0].func(this.sampleOpts);
    return '';
  }
}

describe('samples common', () => {
  let yargs = null;
  let sampleMain = null;

  beforeEach(() => {
    // Zero out the test yargs data before each test.
    yargs = new YargsMock();

    // Create a sample declaration.
    sampleMain = common.sampleMain(yargs);
    sampleMain
      .commandName('test')
      .help('help')
      .args('<args>', {options: ''})
      .example('example1')
      .example('example2');
  });

  function checkOutputs(opts, isMain) {
    if (isMain) {
      assert.deepEqual(opts, yargs.sampleOpts);
    }

    assert.strictEqual(yargs.data.commands.length, 1);
    const cmd = yargs.data.commands[0];
    assert.strictEqual(yargs.data.examples.length, 2);
    if (isMain) {
      assert.strictEqual(cmd.args, '$0 <args>');
      assert.strictEqual(yargs.data.examples[0], 'example1');
      assert.strictEqual(yargs.data.examples[1], 'example2');
      assert.isTrue(yargs.data.epilogue.indexOf('cloud.google') >= 0);
    } else {
      assert.strictEqual(cmd.args, 'test <args>');
      assert.strictEqual(yargs.data.examples[0], 'node $0 test example1');
      assert.strictEqual(yargs.data.examples[1], 'node $0 test example2');
    }
    assert.strictEqual(cmd.helpText, 'help');
    assert.deepEqual(cmd.extraOptions, {options: ''});
  }

  it('should run as a standalone process', () => {
    let called = false;
    sampleMain.execute(
      module,
      opts => {
        called = true;
        checkOutputs(opts, true);
      },
      true
    );

    assert.strictEqual(called, true);
  });

  it('should add to yargs gracefully', () => {
    let called = false;
    sampleMain.execute(
      module,
      opts => {
        called = true;
        checkOutputs(opts, false);
      },
      false
    );

    assert.isTrue(module.exports.declaration === sampleMain);
    const decl = module.exports.declaration;
    delete module.exports.declaration;

    decl.addToYargs(yargs);

    assert.strictEqual(called, false);
    yargs.data.commands[0].func(yargs.sampleOpts);
    assert.strictEqual(called, true);
  });
});
