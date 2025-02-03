const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {withNativeWind} = require('nativewind/metro');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = mergeConfig(getDefaultConfig(__dirname), {
  /* your config */
});

module.exports = wrapWithReanimatedMetroConfig(
  withNativeWind(config, {input: './app/styles/global.css'}),
);
