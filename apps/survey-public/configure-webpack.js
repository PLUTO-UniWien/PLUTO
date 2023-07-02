const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/*
 * Modify the webpack config by exporting an Object or Function.
 *
 * If the value is an Object, it will be merged into the final
 * config using `webpack-merge`.
 *
 * If the value is a function, it will receive the resolved config
 * as the argument. The function can either mutate the config and
 * return nothing, OR return a cloned or merged version of the config.
 *
 * https://cli.vuejs.org/config/#configurewebpack
 */

/**
 * @typedef {import('webpack').Configuration} WebpackOptions
 */

/**
 * @param {WebpackOptions} config
 * @returns {WebpackOptions}
 */
module.exports = (config) => {
  const nodeEnv = process.env.NODE_ENV || 'development';

  /*** @type {HtmlWebpackPlugin} */
  const htmlWebpackPlugin = config.plugins.find(
    (plugin) => plugin instanceof HtmlWebpackPlugin
  );
  htmlWebpackPlugin.userOptions.title = 'PLUTO Survey';

  return {
    plugins: [
      new Dotenv({
        path: `apps/survey-public/.env.${nodeEnv}`,
      }),
    ],
  };
};
