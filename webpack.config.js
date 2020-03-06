const packageJson = require('./package.json');
const version = packageJson.version;
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {

    const conf = {
        mode: 'development',
        devServer: {
            open: true,
            openPage: 'index.html',
            contentBase: path.join(__dirname, 'public'),
            watchContentBase: true,
            port: 8080,
            host: argv.mode === 'production' ? `localhost` : `localhost`,// 0.0.0.0
            disableHostCheck: true,
        },
        entry: {
            "file-choice": ['./src/index.js'],
        },
        output: {
            path: path.join(__dirname, 'lib'),
            publicPath: '/js/',
            filename: argv.mode === 'production' ? `[name].js` : `[name].js`,
            library: 'FileChoice',
            libraryExport: 'default',
            libraryTarget: 'umd',
            globalObject: 'this',
        },
        optimization: {
            minimizer: [new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true,
                    },
                }

            })],
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        {
                            loader: 'babel-loader',
                        }
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        {loader: 'style-loader'},
                        {loader: 'css-loader'},
                        {loader: 'sass-loader'},
                    ]
                },
            ],

        },
        resolve: {
            alias: {}
        },
        plugins: [
            new webpack.BannerPlugin(`[name] v${version} Copyright (c) 2020 Tom Misawa(riversun.org@gmail.com)`),
        ],

    };

    if (argv.mode !== 'production') {
        conf.devtool = 'inline-source-map';
    }

    return conf;

};