const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const outputPath = "dist";

module.exports = merge(common, {
  devtool: "source-maps",

  devServer: {
    // enable HMR on the server
    hot: true,
    // match the output path
    contentBase: path.resolve(__dirname, outputPath),
    // match the output `publicPath`
    publicPath: "/",
    historyApiFallback: true
  }
});
