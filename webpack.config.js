var path = require("path");

var HTMLWebpackPlugin = require("html-webpack-plugin");
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: __dirname + "/client/source/index.html",
  filename: "index.html",
  inject: "body"
});

module.exports = {
  entry: path.join(__dirname, "./client/source/app.js"),
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        loader: "style!css"
      },
      {
        test: /\.svg$/,
        loader: "svg-inline"
      },
      {
        test: /\.(png|jpg)$/,
        loader: "url-loader"
      }
    ]
  },
  output: {
    path: path.join(__dirname, "./client/build"),
    filename: "bundle.js"
  },
  plugins: [HTMLWebpackPluginConfig],
  externals: {
    Config: JSON.stringify(
      typeof process.env.LIBRARY_TITLE != "undefined"
        ? {
            title: process.env.LIBRARY_TITLE
          }
        : {
            title: "My Library"
          }
    ),
    Config2: JSON.stringify(
      typeof process.env.FOOTER != "undefined"
        ? {
            footer: process.env.FOOTER
          }
        : {
            footer: "Personal Library - Code: https://github.com/sydro/bookcase"
          }
    )
  }
};
