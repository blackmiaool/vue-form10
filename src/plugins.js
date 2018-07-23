const localRequire = require.context("./plugins", true, /\.vue$/);

function getPluginsFromContext(context) {
    return context
        .keys()
        .map(context)
        .map(a => a.default);
}
const plugins = getPluginsFromContext(localRequire);

module.exports = plugins;
