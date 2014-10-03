# Flickr Photo Search

Find your favorite photos using the JavaScript [Flickr][] API.

[Flickr]: https://www.flickr.com/

## Dependencies

1. [node.js][] for installation

[node.js]: http://nodejs.org/

## Installation

1. Clone the repository and install the Flickr API using [NPM][]:

```
git clone git@github.com:akalicki/flickr-search.git
cd flickr-search
npm install --production
```

2. Visit the [developer site][] and request a Flickr API key.
3. Replace `YOUR_APP_KEY` on [line 10 of main.js][main.js] with the key you
receive.
4. You're all set! Open `index.html` in your favorite browser to get
started.

[NPM]: https://www.npmjs.org/
[developer site]: https://www.flickr.com/services/apps/create/
[main.js]: https://github.com/akalicki/flickr-search/blob/master/assets/js/main.js#L10

## License

This project is released under the [MIT License][].

[MIT License]: https://github.com/akalicki/flickr-search/blob/master/LICENSE