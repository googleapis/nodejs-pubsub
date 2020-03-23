<<<<<<< HEAD
// Copyright 2020 Google LLC
=======
// Copyright 2019 Google LLC
>>>>>>> feat: convert client to typescript
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
<<<<<<< HEAD
=======
<<<<<<< HEAD:test/index.ts

import * as assert from 'assert';
import {describe, it} from 'mocha';
import * as pubsub from '../src';

describe('exports', () => {
  it('should export the gapic clients', () => {
    assert.ok(pubsub.v1);
  });
});
=======
>>>>>>> feat: convert client to typescript
const config = {
  "enable-source-maps": true,
  "throw-deprecation": true,
  "timeout": 10000
}
if (process.env.MOCHA_THROW_DEPRECATION === 'false') {
  delete config['throw-deprecation'];
}
if (process.env.MOCHA_REPORTER) {
  config.reporter = process.env.MOCHA_REPORTER;
}
if (process.env.MOCHA_REPORTER_OUTPUT) {
  config['reporter-option'] = `output=${process.env.MOCHA_REPORTER_OUTPUT}`;
}
module.exports = config
<<<<<<< HEAD
=======
>>>>>>> feat: convert client to typescript:.mocharc.js
>>>>>>> feat: convert client to typescript
