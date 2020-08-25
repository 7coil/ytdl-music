const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
}, {
  test: /\.s[ac]ss$/,
  use: [
    { loader: 'style-loader' },
    { loader: 'css-loader' },
    { loader: 'sass-loader' },
  ],
  exclude: /\.module\.s[ac]ss$/
}, {
  test: /\.s[ac]ss$/,
  use: [
    { loader: 'style-loader' },
    {
      loader: 'css-loader', options: {
        importLoaders: 1,
        modules: true
      }
    },
    { loader: 'sass-loader' },
  ],
  include: /\.module\.s[ac]ss$/
}, {
  test: /\.(png|jpe?g|gif|ttf|woff2?|eot)$/i,
  use: [
    {
      loader: 'file-loader',
    },
  ],
});

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css']
  },
};
