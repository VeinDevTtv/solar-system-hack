// config-overrides.js
const { override } = require('customize-cra');

const disableSourceMapLoaderForNodeModules = () => (config) => {
  if (!config.module) return config;

  config.module.rules = config.module.rules.map((rule) => {
    if (!rule.oneOf) return rule;

    rule.oneOf = rule.oneOf.map((oneOfRule) => {
      if (
        oneOfRule.loader &&
        oneOfRule.loader.includes('source-map-loader') &&
        oneOfRule.enforce === 'pre'
      ) {
        return {
          ...oneOfRule,
          exclude: /node_modules/,
        };
      }
      return oneOfRule;
    });
    return rule;
  });
  return config;
};

module.exports = override(disableSourceMapLoaderForNodeModules());
