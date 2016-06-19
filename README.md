# Transpilation-based sandboxing

Simple demo of transpilation-based sandboxing.

Demonstrates using a simple Babel visitor to create a sand box which prevents the user code from passing between its
variables values with "four-letter-f-words" - matching the regex `/(^|\W)(f\w{3})(\W|$)/`.

The visitor is implemented in `src/plugin.js`.
The validator invoked by the transpiled code is in `src/validator.js`.

# Install

To run the playground web app:

```bash
git clone git@github.com:tobich/watch-your-language.git
npm install
npm start
```

