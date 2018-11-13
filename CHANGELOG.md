# Changelog

[npm history][1]

[1]: https://www.npmjs.com/package/nodejs-pubsub?activeTab=versions

## v0.21.0

11-12-2018 17:25 PST

### Implementation Changes
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

