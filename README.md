## Getting Started

Run a `yarn install` in the root directory.

## Get your Env right

You'll need to add the environment vars listed in `.envrc.sample`. If you install [direnv](You'll need https://direnv.net/). You can duplicate the `.envrc.sample` file and rename it to `.envrc` then fill in the variables appropriately.

## Running

You'll need to install Netlify Cli

```bash
npm i -g netlify-cli
```

Then you can start the project by going to the root folder and running

```bash
netlify dev
```

### IMPORTANT NOTES

There is [currently a bug](https://github.com/netlify/netlify-redirect-parser/issues/1) with the netlify local redirect parser that causes some strange behaviour locally.

To get around this you'll need to go to `netlify.toml` and comment out the following lines:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

_IMPORTANT_ you need to uncomment them before deploying or the site will not work.
