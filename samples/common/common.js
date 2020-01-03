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

/**
 * Common functions/classes for separate sample handling.
 */

'use strict';

// A builder for individual sample files. This allows a sample to provide
// some simple metadata that may be passed to yargs in various contexts,
// specifically when running with the sample as main, versus using one
// of the sample runner files.
class SampleDeclaration {
  constructor(yargs) {
    this.name = null;
    this.helpText = '';
    this.argString = '';
    this.spacedArgs = '';
    this.extraOptions = {};
    this.exampleText = [];
    this.yargs = yargs;
  }

  // Pass the name of the command (e.g. "create-push").
  commandName(name) {
    this.name = name;
    return this;
  }

  // Pass the help text for the command (e.g. "Does the foo.").
  help(text) {
    this.helpText = text;
    return this;
  }

  // Pass the argument string and any extra options. These are passed
  // directly to yargs.
  args(argString, extraOptions) {
    this.argString = argString;
    this.spacedArgs = this.argString ? ` ${this.argString}` : '';
    this.extraOptions = extraOptions || {};
    return this;
  }

  // Pass an example string for use as a yargs example.
  example(exampleText) {
    this.exampleText = this.exampleText || [];
    this.exampleText.push(exampleText);
    return this;
  }

  // Call this last; it will either run the sample with what's been
  // given (if it's running as main) or export this object for the
  // consolidated runner module to use. 'forceMain' is for testing
  // purposes.
  execute(sampleModule, executionCallback, forceMain = false) {
    // If we're not running as main, then we're probably being required in
    // by one of the sample runners. In which case, stuff the arg setup
    // function into its exports so that the runner can build with it.
    if (sampleModule !== require.main && !forceMain) {
      this.executionCallback = executionCallback;
      sampleModule.exports.declaration = this;
    } else {
      // The sample is running as main. Create a parser of our own.
      const cli = this.yargs.command(
        `$0${this.spacedArgs}`,
        this.helpText,
        this.extraOptions,
        opts => executionCallback(opts)
      );
      (this.exampleText || []).forEach(e => cli.example(e));
      cli
        .wrap(120)
        .recommendCommands()
        .epilogue(
          'For more information, see https://cloud.google.com/pubsub/docs'
        );

      cli.help().strict().argv; // eslint-disable-line
    }
  }

  addToYargs(yargs) {
    yargs.command(
      `${this.name}${this.spacedArgs}`,
      this.helpText,
      this.extraOptions,
      opts => this.executionCallback(opts)
    );
    (this.exampleText || []).forEach(e => {
      const base = `node $0 ${this.name}`;
      const text = e ? `${base} ${e}` : base;
      yargs.example(text);
    });
  }
}

// Returns a builder object that can be used to declare information about
// a sample; this can be used from one of the consolidated runner modules
// to add to its command line parameters, or if it's running as main, it
// will make its own arg parser and start the sample.
function sampleMain(yargs = require('yargs')) {
  return new SampleDeclaration(yargs);
}

module.exports = {sampleMain};
