const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@components': path.resolve(__dirname, 'src/components'),
        },
        onfigure: (webpackConfig) => {
            const cssRule = webpackConfig.module.rules.find(rule =>
                rule.test && rule.test.toString().includes('css')
            );

            let use = [];
            if (cssRule?.oneOf) {
                use = cssRule.oneOf.flatMap(o => o.use).filter(Boolean);
            } else if (Array.isArray(cssRule?.use)) {
                use = cssRule.use;
            }


            const sassRule = {
                test: /\.module\.scss$/,
                use: [
                    ...use,
                    {
                        loader: require.resolve('sass-loader'),
                        options: {
                            implementation: require.resolve('sass'),
                        }
                    }
                ],
            };

            webpackConfig.module.rules.push(sassRule);

            return webpackConfig;
        },
    },
};