const Encore = Webpack Encore;

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
    .enableSingleRuntimeChunk()
    
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
    
    .configureBabel((config) => {
        config.plugins.push('@babel/plugin-proposal-class-properties');
    })
    
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = '3.39';
    })
    
    .enableReactPreset()
    
    .enableSassLoader()
    
    .enableIntegrityHashes(Encore.isProduction())
;

module.exports = Encore.getWebpackConfig();
