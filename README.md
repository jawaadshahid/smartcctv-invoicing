# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

### Using a Template

When you ran `npx create-remix@latest` there were a few choices for hosting. You can run that again to create a new project, then copy over your `app/` folder to the new project that's pre-configured for your target server.

```sh
cd ..
# create a new project, and pick a pre-configured host
npx create-remix@latest
cd my-new-remix-app
# remove the new project's app (not the old one!)
rm -rf app
# copy your app over
cp -R ../my-old-remix-app/app app
```

## TO-DO
 - BUG: only show spinner on clicked button OR replace button spinners with global one
 - FEATURE: add basic search on results pages, implement full-text search prisma, ensure user defined query is sanitised, search input with onChange search call, db call sets flag (in controller) and only performs search when flag is unset, splits string on ' ' (words) and searches string based colums for each
 - FEATURE: add pagination on results pages, db level, implement and style component (daisyui), replace select fields with autocomplete input (dependent on search feature)
 - MAINTENANCE: refactor actions to controllers
 - MAINTENANCE: refactor type error objs, move to controller
 - MAINTENANCE: cleanup dupilcate customers, (can be handled by editor)
 - MAINTENANCE: cleanup styles, move repeated styles to definition file, need a better method than styleClasses.ts (SPIKE)
 - MAINTENANCE: cleanup types, move inline types to single file
