const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/cuspid.js',
  output: {
    filename: './static/bundle.js'
  },
  resolve: {
    alias: {
      'three/EffectComposer': path.join(__dirname, 'node_modules/three/examples/js/postprocessing/EffectComposer.js'),
      'three/ShaderPass': path.join(__dirname, 'node_modules/three/examples/js/postprocessing/ShaderPass.js'),
      'three/TexturePass': path.join(__dirname, 'node_modules/three/examples/js/postprocessing/TexturePass.js'),
      'three/CopyShader': path.join(__dirname, 'node_modules/three/examples/js/shaders/CopyShader.js'),
      'three/DotScreenShader': path.join(__dirname, 'node_modules/three/examples/js/shaders/DotScreenShader.js'),
      'three/DotScreenPass': path.join(__dirname, 'node_modules/three/examples/js/postprocessing/DotScreenPass.js'),
      'three/RenderPass': path.join(__dirname, 'node_modules/three/examples/js/postprocessing/RenderPass.js'),
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      'THREE': 'three'
    })
  ]
};
