# Client
## Denver To Remember 

This project is live at (https://www.denvertoremember.com).

A Denver to Remember is an app targeted at tourists, the curious and the bored. It allows one to quickly find events happening around the Denver area, their location, description, time and price. We have two avenues within the app with which this could be done. As a guest, one could find and filter events based on type.

As a member, the experience becomes more personalized. Not only can one filter events by type, but also view event summaries inside the app without having to redirect to the host website. The in-app event summaries include full descriptions, address, time, and price information, and the source event link.

The application utilizes request and cheerio.js to scrape data from several event-hosting-websites, as well as Google OAuth to enable member authentication/authorization features. 

### Installing
NOTE: You will need to clone both this client repo and the server repo at (https://github.com/stackOfAllTrades/Server)

* Fork and clone this repo
* `$ cd` into the folder and `$ npm install`
* Create a PSQL database named `denver-events`
* Run `$ knex migrate:latest` and `$ knex seed:run`
* See the `example.env` file for needed Environment variables
  * Don't forget to create your own `.env` file with your project's specific Environment variables
* Create a Google OAuth account for authorization
* Launch nodemon on the server with `$ nodemon` from the root of the sever repo
* Launch an http-server with `$ http-server` from the root of the client repo
* When this is all ready, visit http://localhost:8080 from your browser to launch the landing page
