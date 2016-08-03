var Elixir = require('laravel-elixir');
var config = Elixir.config;

loadConfig();

function prepGulpPaths(src, buildPath) {
    src = Array.isArray(src) ? src : [src];

    return new Elixir.GulpPaths()
        .src(src, config.publicPath)
        .output(buildPath || config.get('public.versioning.buildFolder'));
}

function getTemplateVariables(src, variables) {
    var defaults = {
        css: 'assets/css/app.css',
        js:  'assets/js/app.js'
    };

    variables = variables || {};

    var paths = prepGulpPaths(src);
    var manifest = paths.output.baseDir + '/rev-manifest.json';

    if (fs.statSync(manifest)) {
        manifest = JSON.parse(fs.readFileSync(manifest));

        for (var key in defaults) {
            var val = defaults[key];

            if (manifest.hasOwnProperty(val)) {
                variables[key] = config.versioning.buildFolder + '/' + manifest[val];
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
    var manifest = paths.output.baseDir + '/rev-manifest.json';

    watchSrc = src.concat(manifest);

    new Elixir.Task('template', function() {

        variables = getTemplateVariables(src, variables);

        return gulp.src(src)
            .pipe(Elixir.Plugins.template(variables))
            .pipe($.if(config.template.minify, Elixir.Plugins.htmlmin(config.template.options)))
            .pipe(gulp.dest(dest))
            .pipe(new Elixir.Notification('Template compiled!'));
    })
    .watch(watchSrc)
    .ignore(dest);
});