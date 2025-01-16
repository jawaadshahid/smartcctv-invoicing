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
 - FEATURE: add jobs page (see below for spec)
 - FEATURE: limit autocomplete results to 10, use db take to reduce query size
 - FEATURE: should the search input be present if there's only 1 page of results?
 - FEATURE: can heroku send alerts when an error occurs with a snapshot of the console? if so, set it up, if not, create a custom solution to do this
 - FEATURE: homepage widgets:
    - map of customer locations
    - customer record count
    - product record count
    - quote record count
    - quote totals in past month(s)
    - invoice record count
    - invoice totals in past month(s)
 - MAINTENANCE: cleanup dupilcate customers, (can be handled by editor)
 - MAINTENANCE: cleanup styles, move repeated styles to definition file, need a better method than styleClasses.ts (SPIKE)
 - MAINTENANCE: create subdirs for components, conains type file (for type cleanup)
 - MAINTENANCE: cleanup types, move inline types to single file

### FEATURE: jobs
```sh
jobs = {
    job_id: int* (unique key)
    job_title: varchar
    customer_id: int* (associated with customers entry, many jobs to one customer)
    job_event_id: int* (associated with job_events, many job_events to one job)
    invoice_id: int (associated invoice_id, one job to one invoice)
}
```
```sh
job_events = {
    job_event_id: int* (unique key)
    job_event_title: varchar
    start_date: date
    end_date: date
    quote_id: int (associated quote_id, many job_events to many quotes)
}
```

since invoice is generated after job completion, it is associated to the whole job. Whereas, the quote can be generated during a job, if the scope of a job changes, so its associated with the job_event (data relationship TBD)

so that, a single invoice can be generated from a job that contains 1 or more quotes by compiling all items from said quotes 
