# Changelog

[npm history][1]

[1]: https://www.npmjs.com/package/nodejs-pubsub?activeTab=versions

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

