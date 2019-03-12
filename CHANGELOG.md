# Changelog

[npm history][1]

[1]: https://www.npmjs.com/package/nodejs-pubsub?activeTab=versions

## v0.28.1

03-11-2019 15:36 PDT

### Bug Fixes
- fix(typescript): correctly import long ([#541](https://github.com/googleapis/nodejs-pubsub/pull/541))

### Internal / Testing Changes
- testing: set skipLibCheck to false for ts install test ([#543](https://github.com/googleapis/nodejs-pubsub/pull/543))
- refactor: fix/simplify proto gen scripts ([#542](https://github.com/googleapis/nodejs-pubsub/pull/542))

## v0.28.0

03-11-2019 09:11 PDT

### New Features
- feat(topic): create setMetadata method ([#537](https://github.com/googleapis/nodejs-pubsub/pull/537))

### Dependencies
- fix(deps): update dependency @google-cloud/paginator to ^0.2.0

### Internal / Testing Changes
- build: Add docuploader credentials to node publish jobs ([#533](https://github.com/googleapis/nodejs-pubsub/pull/533))
- test: add missing packages and install test ([#536](https://github.com/googleapis/nodejs-pubsub/pull/536))
- refactor(typescript): noImplicitAny for Subscription test file ([#534](https://github.com/googleapis/nodejs-pubsub/pull/534))

## v0.27.1

03-06-2019 20:11 PST

### Bug Fixes
- fix(typescript): correct response type of `Subscription.get` ([#525](https://github.com/googleapis/nodejs-pubsub/pull/525))

### Documentation
- fix(typo): correct typo: recieved => received ([#527](https://github.com/googleapis/nodejs-pubsub/pull/527))

### Internal / Testing Changes
- build: update release configuration
- refactor(typescript): noImplicitAny for message-stream test file ([#522](https://github.com/googleapis/nodejs-pubsub/pull/522))
- build: use node10 to run samples-test, system-test etc ([#529](https://github.com/googleapis/nodejs-pubsub/pull/529))
- refactor: type fixes and some light housekeeping ([#528](https://github.com/googleapis/nodejs-pubsub/pull/528))

## v0.27.0

03-04-2019 08:42 PST


### Bug Fixes
- refactor(typescript): various fixes/refactors to types ([#515](https://github.com/googleapis/nodejs-pubsub/pull/515))
- fix(ts): fix getPolicy promise return signature ([#511](https://github.com/googleapis/nodejs-pubsub/pull/511))
- fix(typescript): export all the types ([#516](https://github.com/googleapis/nodejs-pubsub/pull/516))

### Dependencies
- refactor: clean up unused packages ([#517](https://github.com/googleapis/nodejs-pubsub/pull/517))

### Documentation
- fix(docs): ensure docs are not removed by typescript ([#512](https://github.com/googleapis/nodejs-pubsub/pull/512))
- docs: update comments on protos ([#509](https://github.com/googleapis/nodejs-pubsub/pull/509))

### Internal / Testing Changes
- refactor(typescript):noImplicitAny for index test file ([#502](https://github.com/googleapis/nodejs-pubsub/pull/502))
- refactor(ts): enable noImplicitAny for IAM test file ([#501](https://github.com/googleapis/nodejs-pubsub/pull/501))
- refactor(ts): enable noImplicitAny for lease-manager test file ([#508](https://github.com/googleapis/nodejs-pubsub/pull/508))
- refactor(ts): enable noImplicitAny for Histogram and Message_queues test file ([#510](https://github.com/googleapis/nodejs-pubsub/pull/510))
- refactor(ts): enable noImplicitAny for pubsub system test file ([#519](https://github.com/googleapis/nodejs-pubsub/pull/519))
- refactor(ts): noImplicitAny for publisher test file ([#520](https://github.com/googleapis/nodejs-pubsub/pull/520))

## v0.26.0

02-28-2019 05:42 PST

### BREAKING: `message.publishTime` is now represented by a [`PreciseDate`](https://github.com/googleapis/nodejs-precise-date) object. ([#503](https://github.com/googleapis/nodejs-pubsub/pull/503))

The `PreciseDate` class extends the native Date object, so most users should be unaffected by this change. The notable differences between PreciseDate and Date objects are:

- `toISOString()` now returns as a RFC 3339 formatted string.
- Nano and microsecond data is available via `date.getNanoseconds()` and `date.getMicroseconds()` respectively.

### New Features
- feat(typescript): ship typescript declaration files ([#498](https://github.com/googleapis/nodejs-pubsub/pull/498))
- feat(subscription): support push config auth methods ([#504](https://github.com/googleapis/nodejs-pubsub/pull/504))

### Internal / Testing Changes
- refactor(typescript): noImplicitAny for snapshot and subscriber test file ([#490](https://github.com/googleapis/nodejs-pubsub/pull/490))
- fix(messageStream): remove call to destroy grpc stream ([#499](https://github.com/googleapis/nodejs-pubsub/pull/499))

## v0.25.0

02-20-2019 10:35 PST

### Implementation Changes
- fix: throw on invalid credentials and update retry config ([#476](https://github.com/googleapis/nodejs-pubsub/pull/476))

The retry logic for **all** methods has changed. It is possible that this could go unnoticed, however if you suddenly start seeing errors in places that were previously quiet, this might account for said errors.

### New Features
- refactor(ts): improve TypeScript types ([#482](https://github.com/googleapis/nodejs-pubsub/pull/482))
- refactor(typescript): noImplicityAny for snapshot.ts and publisher.ts ([#457](https://github.com/googleapis/nodejs-pubsub/pull/457))

### Bug Fixes
- fix: ignore messages that come in after close ([#485](https://github.com/googleapis/nodejs-pubsub/pull/485))

### Dependencies
- chore(deps): update dependency mocha to v6 ([#488](https://github.com/googleapis/nodejs-pubsub/pull/488))
- fix(deps): update dependency @google-cloud/promisify to ^0.4.0 ([#478](https://github.com/googleapis/nodejs-pubsub/pull/478))
- fix(deps): update dependency yargs to v13 ([#475](https://github.com/googleapis/nodejs-pubsub/pull/475))
- fix(deps): update dependency duplexify to v4 ([#462](https://github.com/googleapis/nodejs-pubsub/pull/462))
- fix(deps): update dependency google-gax to ^0.25.0 ([#456](https://github.com/googleapis/nodejs-pubsub/pull/456))

### Documentation
- docs: update links in contrib guide ([#479](https://github.com/googleapis/nodejs-pubsub/pull/479))
- docs: update contributing path in README ([#471](https://github.com/googleapis/nodejs-pubsub/pull/471))
- chore: move CONTRIBUTING.md to root ([#470](https://github.com/googleapis/nodejs-pubsub/pull/470))
- docs: make mention of message change in changelog ([#469](https://github.com/googleapis/nodejs-pubsub/pull/469))
- docs: add lint/fix example to contributing guide ([#464](https://github.com/googleapis/nodejs-pubsub/pull/464))
- fix(sample): fix retry codes in retry sample code ([#458](https://github.com/googleapis/nodejs-pubsub/pull/458))

### Internal / Testing Changes
- test(samples): correctly handle publishTime value ([#495](https://github.com/googleapis/nodejs-pubsub/pull/495))
- test: fix publishTime issues ([#494](https://github.com/googleapis/nodejs-pubsub/pull/494))
- refactor(typescript): noImplicityAny for Topic test file ([#487](https://github.com/googleapis/nodejs-pubsub/pull/487))
- refactor(ts): noImplicitAny for subscription test file ([#489](https://github.com/googleapis/nodejs-pubsub/pull/489))
- build: use linkinator for docs test ([#477](https://github.com/googleapis/nodejs-pubsub/pull/477))
- build: create docs test npm scripts ([#474](https://github.com/googleapis/nodejs-pubsub/pull/474))
- build: test using @grpc/grpc-js in CI ([#472](https://github.com/googleapis/nodejs-pubsub/pull/472))
- test: update code style of smoke test ([#463](https://github.com/googleapis/nodejs-pubsub/pull/463))
- test: make smoke test spam less ([#459](https://github.com/googleapis/nodejs-pubsub/pull/459))

## v0.24.1

01-29-2019 13:17 PST

### Bug Fixes

- fix(publisher): unbound max send message size ([#454](https://github.com/googleapis/nodejs-pubsub/pull/454))

## v0.24.0

01-28-2019 09:54 PST

### New Features
- fix(auth): pass project id to gax clients ([#447](https://github.com/googleapis/nodejs-pubsub/pull/447))
- refactor(typescript): noImplicityAny for topic.ts and subscription.ts ([#420](https://github.com/googleapis/nodejs-pubsub/pull/420))
- refactor: improve subscriber error handling ([#440](https://github.com/googleapis/nodejs-pubsub/pull/440))
- feat(subscription): auto close sub on non-recoverable errors ([#441](https://github.com/googleapis/nodejs-pubsub/pull/441))

### Dependencies
- chore(deps): update dependency eslint-config-prettier to v4 ([#450](https://github.com/googleapis/nodejs-pubsub/pull/450))
- fix(deps): update dependency google-gax to ^0.24.0 ([#444](https://github.com/googleapis/nodejs-pubsub/pull/444))
- fix(deps): update dependency google-auth-library to v3 ([#433](https://github.com/googleapis/nodejs-pubsub/pull/433))

### Documentation
- build: ignore googleapis.com in doc link check ([#439](https://github.com/googleapis/nodejs-pubsub/pull/439))
- chore: update year in the license headers. ([#434](https://github.com/googleapis/nodejs-pubsub/pull/434))

### Internal / Testing Changes
- chore: remove trailing whitespace in package.json
- fix(sample): factor setTimeout jitter into assertion ([#449](https://github.com/googleapis/nodejs-pubsub/pull/449))
- fix(test): broken snapshot test hook ([#448](https://github.com/googleapis/nodejs-pubsub/pull/448))

## v0.23.0

01-16-2019 13:09 PST

**This release has breaking changes.**

#### BREAKING: `Topic#publisher()` has been removed in favor of `Topic#publish()` ([#426](https://github.com/googleapis/nodejs-pubsub/pull/426))

Before
```js
const publisher = topic.publisher(publishOptions);
await publisher.publish(Buffer.from('Hello, world!'));
```

After
```js
topic.setPublishOptions(publishOptions);
await topic.publish(Buffer.from('Hello, world!'));
```

#### BREAKING: `Subscription` options have changed. ([#388](https://github.com/googleapis/nodejs-pubsub/pull/388))

Before
```js
const subscription = topic.subscription('my-sub', {
  batching: {
    maxMilliseconds: 100,
  },
  flowControl: {
    maxBytes: os.freem() * 0.2,
    maxMessages: 100,
  },
  maxConnections: 5,
});
```

After
```js
const subscription = topic.subscription('my-sub', {
  ackDeadline: 10,
  batching: {
    callOptions: {}, // gax call options
    maxMessages: 3000,
    maxMilliseconds: 100,
  },
  flowControl: {
    allowExcessMessages: true,
    maxBytes: os.freem() * 0.2,
    maxExtension: Infinity,
    maxMessages: 100
  },
  streamingOptions: {
    highWaterMark: 0,
    maxStreams: 5, // formerly known as maxConnections
    timeout: 60000 * 5, // 5 minutes
  }
});
```

#### BREAKING: messages are no longer plain objects. ([#388](https://github.com/googleapis/nodejs-pubsub/pull/388))

Messages were refactored into a [class](https://github.com/googleapis/nodejs-pubsub/blob/52305c7ee5bbc9caba1369a45ae7fdcdeba1c89b/src/subscriber.ts#L59),
this will only affect (some) users who treat messages like plain old objects.

The following example is something that would have worked previously, but will
now throw a `TypeError` since `ack` lives on the prototype chain.

```js
const m = Object.assign({}, message, customData);
m.ack(); // TypeError: m.ack is not a function
```

### New Features
- feat(topic): create method for publishing json ([#430](https://github.com/googleapis/nodejs-pubsub/pull/430))

### Dependencies
- fix(deps): update dependency google-gax to ^0.23.0 ([#423](https://github.com/googleapis/nodejs-pubsub/pull/423))
- chore(deps): update dependency @types/sinon to v7 ([#411](https://github.com/googleapis/nodejs-pubsub/pull/411))
- chore: update nyc and eslint configs ([#409](https://github.com/googleapis/nodejs-pubsub/pull/409))

### Documentation
- docs(samples): correct publish retry settings ([#419](https://github.com/googleapis/nodejs-pubsub/pull/419))
- docs: sync generated grpc message type docs
- fix(docs): remove unused long running operations and IAM types
- fix: modernize the sample tests ([#414](https://github.com/googleapis/nodejs-pubsub/pull/414))

### Internal / Testing Changes
- chore: update subscriber gapic
- fix: add getSubscriberStub to synth file ([#425](https://github.com/googleapis/nodejs-pubsub/pull/425))
- build: check broken links in generated docs ([#416](https://github.com/googleapis/nodejs-pubsub/pull/416))
- chore(build): inject yoshi automation key ([#410](https://github.com/googleapis/nodejs-pubsub/pull/410))
- chore: fix publish.sh permission +x ([#406](https://github.com/googleapis/nodejs-pubsub/pull/406))
- fix(build): fix Kokoro release script ([#404](https://github.com/googleapis/nodejs-pubsub/pull/404))

## v0.22.2

12-10-2018 09:37 PST

### Implementation Changes
*TypeScript related changes:*
- fix(ts): copy gapic code properly ([#399](https://github.com/googleapis/nodejs-pubsub/pull/399))

### Documentation
- fix(docs): add subscription expiration policy docs ([#400](https://github.com/googleapis/nodejs-pubsub/pull/400))
- Add migration for v0.20.0 from v0.19.0 ([#398](https://github.com/googleapis/nodejs-pubsub/pull/398))

## v0.22.1

12-06-2018 17:11 PST

### Dependencies
- chore(deps): update dependency typescript to ~3.2.0 ([#380](https://github.com/googleapis/nodejs-pubsub/pull/380))

### Documentation
- fix(docs): place doc comment above the last overload ([#393](https://github.com/googleapis/nodejs-pubsub/pull/393))
- docs: Update documentation for Subscription ([#387](https://github.com/googleapis/nodejs-pubsub/pull/387))
- docs: Add documentation about defaults for publisher ([#384](https://github.com/googleapis/nodejs-pubsub/pull/384))
- docs: update readme badges ([#383](https://github.com/googleapis/nodejs-pubsub/pull/383))

### Internal / Testing Changes
- chore: always nyc report before calling codecov ([#392](https://github.com/googleapis/nodejs-pubsub/pull/392))
- chore: nyc ignore build/test by default ([#391](https://github.com/googleapis/nodejs-pubsub/pull/391))
- chore: update license file ([#386](https://github.com/googleapis/nodejs-pubsub/pull/386))

## v0.22.0

### Implementation Changes
- fix(ts): do not ship types ([#377](https://github.com/googleapis/nodejs-pubsub/pull/377))

#### Road to TypeScript
- refactor(ts): improve types (2) ([#356](https://github.com/googleapis/nodejs-pubsub/pull/356))
- refactor(ts): updated lint and fix command to cover gts ([#375](https://github.com/googleapis/nodejs-pubsub/pull/375))
- refactor(ts): added ts style fix for src/iam.ts ([#352](https://github.com/googleapis/nodejs-pubsub/pull/352))
- refactor(ts): Added ts style fix for test/topic.ts ([#373](https://github.com/googleapis/nodejs-pubsub/pull/373))
- refactor(ts): Added ts style fix for test/subscription.ts ([#372](https://github.com/googleapis/nodejs-pubsub/pull/372))
- refactor(ts): Added ts style fix for test/subscriber.ts ([#371](https://github.com/googleapis/nodejs-pubsub/pull/371))
- refactor(ts): Added ts style fix for test/snapshot.ts ([#370](https://github.com/googleapis/nodejs-pubsub/pull/370))
- refactor(ts): Added ts style fix for test/publisher.ts ([#369](https://github.com/googleapis/nodejs-pubsub/pull/369))
- refactor(ts): added ts style fix for src/index.ts ([#351](https://github.com/googleapis/nodejs-pubsub/pull/351))
- refactor(ts): added ts style fix for src/publisher.ts ([#357](https://github.com/googleapis/nodejs-pubsub/pull/357))
- refactor(ts): added ts style fix for src/snapshot.ts ([#358](https://github.com/googleapis/nodejs-pubsub/pull/358))
- refactor(ts): added ts style fix for src/subscriber.ts ([#359](https://github.com/googleapis/nodejs-pubsub/pull/359))
- refactor(ts): added ts style fix for src/subscription.ts ([#360](https://github.com/googleapis/nodejs-pubsub/pull/360))
- refactor(ts): added ts style fix for src/topic.ts ([#361](https://github.com/googleapis/nodejs-pubsub/pull/361))
- refactor(ts): added ts style fix for src/util.ts ([#362](https://github.com/googleapis/nodejs-pubsub/pull/362))
- refactor(ts): added ts style fix for test/connection-pool.ts ([#364](https://github.com/googleapis/nodejs-pubsub/pull/364))
- refactor(ts): added ts style fix for test/histogram.ts ([#365](https://github.com/googleapis/nodejs-pubsub/pull/365))
- refactor(ts): added ts style fix for test/iam.ts ([#366](https://github.com/googleapis/nodejs-pubsub/pull/366))
- refactor(ts): added ts style fix for test/index.ts ([#368](https://github.com/googleapis/nodejs-pubsub/pull/368))
- refactor(ts): added ts style fix for src/connection-pool.ts ([#353](https://github.com/googleapis/nodejs-pubsub/pull/353))
- refactor(ts): added ts style fix for src/histogram.ts ([#354](https://github.com/googleapis/nodejs-pubsub/pull/354))
- refactor(ts): enable noImplicitAny on src/iam.ts ([#348](https://github.com/googleapis/nodejs-pubsub/pull/348))
- added ts style fix for system-test/pubsub.ts ([#374](https://github.com/googleapis/nodejs-pubsub/pull/374))
- chore: ts-ignoring some stuff in tests ([#343](https://github.com/googleapis/nodejs-pubsub/pull/343))

### Dependencies
- fix: Pin @types/sinon to last compatible version ([#345](https://github.com/googleapis/nodejs-pubsub/pull/345))
- chore(deps): update dependency @types/sinon to v5.0.7 ([#349](https://github.com/googleapis/nodejs-pubsub/pull/349))

### Documentation
- docs(samples): Publish with Retry Setting Example ([#355](https://github.com/googleapis/nodejs-pubsub/pull/355))
- docs: remove outdated comments ([#342](https://github.com/googleapis/nodejs-pubsub/pull/342))

### Internal / Testing Changes
- chore: add a synth.metadata
- feat: Add optional delay when calling nack() ([#255](https://github.com/googleapis/nodejs-pubsub/pull/255)) ([#256](https://github.com/googleapis/nodejs-pubsub/pull/256))

## v0.21.1

### Bug fixes
- fix: include protos in the package ([#336](https://github.com/googleapis/nodejs-pubsub/pull/336))

## v0.21.0

11-12-2018 17:25 PST

### Implementation Changes

**BREAKING CHANGE**
`@google-cloud/pubsub` now uses ES6 import/export syntax since v0.21.0.

Before:
```javascript
const pubsub = require('@google-cloud/pubsub')();
// OR
const PubSub = require('@google-cloud/pubsub');
const pubsub = new PubSub();
```
Now:
```javascript
const {PubSub} = require('@google-cloud/pubsub');
const pubsub = new PubSub();
```

- refactor: use Object.assign where possible ([#324](https://github.com/googleapis/nodejs-pubsub/pull/324))
- fix(subscription): promisify Subscription#close ([#282](https://github.com/googleapis/nodejs-pubsub/pull/282))
- fix: maxBytes batching sending empty messages ([#281](https://github.com/googleapis/nodejs-pubsub/pull/281))
- (New) Synchronous Pull with Lease Management  ([#272](https://github.com/googleapis/nodejs-pubsub/pull/272))
- Switch to let/const ([#254](https://github.com/googleapis/nodejs-pubsub/pull/254))

#### Road to TypeScript
- refactor(ts): introduce a round of types ([#319](https://github.com/googleapis/nodejs-pubsub/pull/319))
- refactor(ts): enable noImplicitThis ([#316](https://github.com/googleapis/nodejs-pubsub/pull/316))
- refactor(ts): convert to typescript ([#310](https://github.com/googleapis/nodejs-pubsub/pull/310))

### New Features
- feat: add expiration policy ([#287](https://github.com/googleapis/nodejs-pubsub/pull/287))

### Dependencies
- chore(deps): update dependency eslint-plugin-prettier to v3 ([#274](https://github.com/googleapis/nodejs-pubsub/pull/274))
- fix(deps): update dependency google-proto-files to ^0.17.0 ([#284](https://github.com/googleapis/nodejs-pubsub/pull/284))
- chore(deps): update dependency sinon to v7 ([#285](https://github.com/googleapis/nodejs-pubsub/pull/285))
- chore(deps): update dependency eslint-plugin-node to v8 ([#300](https://github.com/googleapis/nodejs-pubsub/pull/300))
- fix(deps): update dependency through2 to v3 ([#320](https://github.com/googleapis/nodejs-pubsub/pull/320))
- refactor: drop dependencies on google-proto-files and async ([#329](https://github.com/googleapis/nodejs-pubsub/pull/329))
- chore(deps): update dependency @google-cloud/nodejs-repo-tools to v3 ([#328](https://github.com/googleapis/nodejs-pubsub/pull/328))
- chore(deps): update dependency @types/is to v0.0.21 ([#323](https://github.com/googleapis/nodejs-pubsub/pull/323))
- fix(deps): update dependency google-gax to ^0.20.0 ([#252](https://github.com/googleapis/nodejs-pubsub/pull/252))

### Documentation
- fix quickstart tag in v0.20 docs ([#271](https://github.com/googleapis/nodejs-pubsub/pull/271))

### Samples
- Pub/Sub Synchronous Pull Example ([#259](https://github.com/googleapis/nodejs-pubsub/pull/259))
- Update sample topic and subscription names
-  Add Pub/Sub ack deadline example ([#315](https://github.com/googleapis/nodejs-pubsub/pull/315))
- docs(samples): update samples to use async/await ([#305](https://github.com/googleapis/nodejs-pubsub/pull/305))
- chore: adjust samples timeout ([#283](https://github.com/googleapis/nodejs-pubsub/pull/283))
- Fix the topic name in the samples ([#262](https://github.com/googleapis/nodejs-pubsub/pull/262))

### Internal / Testing Changes
- chore: update eslintignore config ([#332](https://github.com/googleapis/nodejs-pubsub/pull/332))
- chore(build): eslint all js files, and use js for all generated files ([#331](https://github.com/googleapis/nodejs-pubsub/pull/331))
- chore: drop contributors from multiple places ([#325](https://github.com/googleapis/nodejs-pubsub/pull/325))
- chore: use latest npm on Windows ([#322](https://github.com/googleapis/nodejs-pubsub/pull/322))
- chore: update CircleCI config ([#309](https://github.com/googleapis/nodejs-pubsub/pull/309))
- chore: include build in eslintignore ([#304](https://github.com/googleapis/nodejs-pubsub/pull/304))
- chore: update issue templates ([#299](https://github.com/googleapis/nodejs-pubsub/pull/299))
- chore: remove old issue template ([#297](https://github.com/googleapis/nodejs-pubsub/pull/297))
- build: run tests on node11 ([#296](https://github.com/googleapis/nodejs-pubsub/pull/296))
- chores(build): do not collect sponge.xml from windows builds ([#295](https://github.com/googleapis/nodejs-pubsub/pull/295))
- chores(build): run codecov on continuous builds ([#294](https://github.com/googleapis/nodejs-pubsub/pull/294))
- chore: update new issue template ([#293](https://github.com/googleapis/nodejs-pubsub/pull/293))
- build: fix codecov uploading on Kokoro ([#286](https://github.com/googleapis/nodejs-pubsub/pull/286))
- Update kokoro config ([#275](https://github.com/googleapis/nodejs-pubsub/pull/275))
- Update Kokoro configs ([#270](https://github.com/googleapis/nodejs-pubsub/pull/270))
- Update kokoro config ([#269](https://github.com/googleapis/nodejs-pubsub/pull/269))
- test: remove appveyor config ([#268](https://github.com/googleapis/nodejs-pubsub/pull/268))
- Update CI config ([#266](https://github.com/googleapis/nodejs-pubsub/pull/266))
- Run prettier on smoke tests ([#265](https://github.com/googleapis/nodejs-pubsub/pull/265))
- Fix the linter ([#261](https://github.com/googleapis/nodejs-pubsub/pull/261))
- Enable prefer-const in the eslint config ([#260](https://github.com/googleapis/nodejs-pubsub/pull/260))
- Enable no-var in eslint ([#257](https://github.com/googleapis/nodejs-pubsub/pull/257))

## v0.20.1

### Documentation
 - fix(docs): correct region tag for sample documentation (#272)

## v0.20.0

### Implementation Changes

*BREAKING CHANGE*: - fix: drop support for node.js 4.x and 9.x (#171)


**BREAKING CHANGE**
`@google-cloud/pubsub` now requires `new`.

Before:
```javascript
const PubSub = require('@google-cloud/pubsub');
const pubsub = PubSub();
```
Now:
```javascript
const PubSub = require('@google-cloud/pubsub');
const pubsub = new PubSub();
```

### New Features

- Re-generate library using /synth.py (#227)
   - some minor proto documentation changes

### Dependencies

- fix(deps): update dependency google-auth-library to v2 (#228)
- chore(deps): update dependency nyc to v13 (#225)
- fix(deps): update dependency google-gax to ^0.19.0 (#216)
- chore(deps): update dependency eslint-config-prettier to v3 (#213)
- chore: drop dependency on @google-cloud/common (#210)
- fix(deps): update dependency @google-cloud/common to ^0.21.0 (#206)
- chore(deps): lock file maintenance (#203)
- fix(deps): update dependency google-gax to ^0.18.0 (#197)
- chore(deps): lock file maintenance (#196)
- chore(deps): lock file maintenance (#188)
- chore(deps): update dependency eslint-plugin-node to v7 (#185)
- chore(deps): lock file maintenance (#182)
- chore(deps): lock file maintenance (#174)
- chore(deps): lock file maintenance (#173)
- chore(deps): lock file maintenance (#172)
- chore(deps): lock file maintenance (#168)
- chore(deps): lock file maintenance (#167)
- chore(deps): lock file maintenance (#166)
- fix(deps): update dependency delay to v3 (#165)
- fix(deps): update dependency @google-cloud/common to ^0.20.0 (#155)
- chore(deps): update dependency proxyquire to v2 (#160)
- chore(deps): update dependency nyc to v12 (#159)
- Update google-gax and add Synth.py (#158)
- chore(deps): update dependency sinon to v6 (#161)
- fix(deps): update dependency yargs to v12 (#164)
- fix(deps): update dependency yargs to v11 (#163)
- fix(deps): update dependency yargs to v10.1.2 (#157)
- chore(deps): update dependency ava to ^0.25.0 (#153)
- chore(deps): update dependency sinon to v4.5.0 (#154)

### Documentation

- fix docs (#229)
- test: fix import sample failures (#218)
- fix: correct the documentation (#117)
- fix: Fix sample region tag in JSDoc (#184)
- Fixes 179: Adds missing return statement in docs (#180)

### Internal / Testing Changes

- Update the CI config (#220)
- chore: make the CircleCI config consistent
- chore: use arrow functions (#215)
- chore: convert to es classes (#211)
- chore: do not use npm ci (#209)
- chore: use let and const (#204)
- chore: ignore package-lock.json (#207)
- chore: use split common modules (#200)
- chore: update renovate config (#199)
- chore: move mocha options to mocha.opts (#194)
- chore: require node 8 for samples (#195)
- chore: add node templates to synth.py (#191)
- chore: fix the eslint errors (#190)
- refactor: use google-auth-library (#189)
- Fixes 177: Prevents publishing attributes that have non-string values (#183)
- chore(build): use `npm ci` instead of `npm install` (#175)
- chore(package): update eslint to version 5.0.0 (#145)
- chore: update sample lockfiles (#149)
- test: use strictEqual in tests (#186)
- Configure Renovate (#144)
- refactor: drop repo-tool as an exec wrapper (#150)
- fix: update linking for samples (#146)

