# Laravel Elixir Template

This is a simple wrapper around [gulp-template] and [gulp-htmlmin] to substitute variables into a static HTML template using Laravel's Elixir.

My main usage for this is when developing VueJS apps and I just want to serve up a standard HTML file, rather than passing the request through to Laravel just because I want to use the versioned assets and thus needing the `elixir()` function in the blade templates. This gives you the ability to serve just the HTML file, without taking the performance hit by passing the request into PHP, and still make use of Elixir's versioned assets.

## Installation

To install you just need to require the module

```javascript
var elixir = require('laravel-elixir');

require('laravel-elixir-template');

elixir(function(mix) {
    mix.template('template/*.html');
});
```

## Usage

The most basic usage would just be to substitute the versioned asset paths into your template. By default it reads the `manifest.json` found within your build folder when versioning assets.

```javascript
elixir(function(mix) {
    mix.scss('app.scss')
        .webpack('app.js')
        .version(['app.css', 'app.js'])
        .template('template/*.html');
});
```

```html
<!doctype html>
<html lang="en">
    <head>
        <link rel="stylesheet" href="<%= css %>">
    </head>
    <body>
        <script src="<%= js %>"></script>
    </body>
</html>
```

You may also supply an output path, by default your public path is used. This example below will transfer your templates into `web` rather than your usual public folder.

```javascript
elixir(function(mix) {
    mix.scss('app.scss')
        .webpack('app.js')
        .version(['app.css', 'app.js'])
        .template('template/*.html', 'web');
});
```

Extra variables may also be passed into the template function, and you don't have to version assets if you don't wish to. 

```javascript
elixir(function(mix) {
    mix.template('template/*.html', 'public', {heroTitle: 'Hello World'});
});
```

```html
<!doctype html>
<html lang="en">
    <body>
        <div class="hero">
            <h1 class="hero-title"><%= heroTitle %></h1>
        </div>
    </body>
</html>
```

## Options

#### HTML Minification

By default HTML will be minified if gulp is run with the `--production` argument.

```javascript
Elixir.config.template.minify = false
```

Further options can be passed to the `gulp-htmlmin` plugin itself by settings variables on the `options` property of the template config. See the `gulp-htmlmin` for all the options you may pass here https://github.com/kangax/html-minifier#options-quick-reference

```javascript
Elixir.config.template.options = {
    removeComments: true,
    collapseWhitespace: true
};
```

## License

Copyright (c) 2016 Wade Urry
Licensed under the [MIT license].

[gulp-template]:https://www.npmjs.com/package/gulp-template
[gulp-htmlmin]:https://www.npmjs.com/package/gulp-htmlmin
[MIT license]:https://opensource.org/licenses/MIT
