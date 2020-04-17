const BUILD_ENV = process.env.BUILD_ENV || 'development'
const isProduction = BUILD_ENV === 'production'

module.exports = function (api) {
  api.cache(true);

  const plugins = [
    "@loadable/babel-plugin",
    [
      "@babel/plugin-transform-react-constant-elements",
      {
        "allowMutablePropsOnTags": [
          "FormattedMessage"
        ]
      }
    ],
    "@babel/plugin-proposal-class-properties"
  ]

  if (!isProduction) {
    plugins.push("react-hot-loader/babel")
  }

  if (isProduction) {
    plugins.push(
      [
        "babel-plugin-import",
        {
          "libraryName": "@material-ui/core",
          "libraryDirectory": "esm",
          "camel2DashComponentName": false
        },
        "core"
      ],
      [
        "babel-plugin-import",
        {
          "libraryName": "@material-ui/icons",
          "libraryDirectory": "esm",
          "camel2DashComponentName": false
        },
        "icons"
      ]
    )
  }

  return {
    "presets": [
      "@babel/react",
      [
        "@babel/typescript",
        {
          "allExtensions": true,
          "isTSX": true,
          "allowNamespaces": true
        }
      ],
      [
        "@babel/env",
        {
          "loose": true,
          "targets": {
            "esmodules": false,
            "browsers": ["last 2 versions"],
          },
          "useBuiltIns": "usage",
          "corejs": 3
        }
      ]
    ],
    plugins,
  }
}
