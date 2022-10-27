# About TypeScript samples

In order to provide better samples for our TypeScript users, new samples going forward will be written in TypeScript, in this directory. `npm run compile` will take care of all the steps needed to merge the existing JavaScript samples into `build/` along with the compiled TypeScript samples. The system sample tests will then use `build/` for its testing.

When you are ready to submit a PR for the updated sample, OwlBot will take care of regenerating any `*.js` files from the `*.ts` files.
