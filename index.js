var Elixir = require('laravel-elixir');
var fs = require('fs');
var extend = require('extend');
var config = Elixir.config;
var template = require('gulp-template');
var htmlmin = require('gulp-htmlmin');
var path = require('path');

loadConfig();

function prepGulpPaths(src, buildPath) {
    src = Array.isArray(src) ? src : [src];

    return new Elixir.GulpPaths()
        .src(src, config.assetsPath)
        .output(buildPath || config.publicPath);
}

function getTemplateVariables(variables) {
    var defaults = {
        css: 'css/app.css',
        js:  'js/app.js'
    };

    variables = variables || {};

    var manifest = path.join(config.publicPath, config.versioning.buildFolder, '/rev-manifest.json');

    if (fs.statSync(manifest)) {
        manifest = JSON.parse(fs.readFileSync(manifest));

        for (var key in defaults) {
            var val = defaults[key];

            if (manifest.hasOwnProperty(val)) {
                variables[key] = path.join(config.versioning.buildFolder, manifest[val]);
            }
        }
    }

    return extend(true, defaults, variables);
}

function loadConfig() {
    config.template = {
        minify: Elixir.inProduction,
        options: {
            removeComments: true,
            collapseWhitespace: true
        }
    }
}

Elixir.extend('template', function(src, dest, variables) {
    src = Array.isArray(src) ? src : [src];

    var paths = prepGulpPaths(src);

    var manifest = path.join(paths.output.baseDir, '/rev-manifest.json');

    new Elixir.Task('template', function($, config) {

        variables = getTemplateVariables(variables);

        console.log(paths.output);

        return gulp.src(paths.src.path)
            .pipe(template(variables))
            .pipe($.if(config.template.minify, htmlmin(config.template.options)))
            .pipe(gulp.dest(paths.output.path))
            .pipe(new Elixir.Notification('Template compiled!'));
    })
        .watch(src.concat(manifest))
        .ignore(dest);
});