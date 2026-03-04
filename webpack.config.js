const Encore = require('@symfony/webpack-encore');

if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    .setOutputPath('public/build/')
    .setPublicPath('/build')
    
    .addEntry('app', './assets/js/app.js')
    .addEntry('admin', './assets/js/admin.jsx')
    
    .enableStimulusBridge('./assets/controllers.json')
    
    .splitEntryChunks()

    // enables the Symfony UX Stimulus bridge (used in assets/stimulus_bootstrap.js)
    .enableStimulusBridge('./assets/controllers.json')
    .enableSingleRuntimeChunk()
    
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
    
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = '3.39';
    })
    
    .enableReactPreset()
    
    .enableSassLoader()
    
    .enableIntegrityHashes(Encore.isProduction())
;

module.exports = Encore.getWebpackConfig();
