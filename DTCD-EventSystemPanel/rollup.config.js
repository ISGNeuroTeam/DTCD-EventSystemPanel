import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import vue from 'rollup-plugin-vue';
import replace from '@rollup/plugin-replace';
import styles from 'rollup-plugin-styles';
import json from '@rollup/plugin-json';
import { babel } from '@rollup/plugin-babel';
import { version } from './package.json';

const watch = Boolean(process.env.ROLLUP_WATCH);

const pluginName = 'EventSystemPanel';
const fileDest = watch
  ? `./../../DTCD/server/plugins/DTCD-${pluginName}_${version}/${pluginName}.js`
  : `./build/${pluginName}.js`;

const plugins = [
  json(),
  vue({
    preprocessStyles: true,
  }),
  commonjs(),
  resolve({
    jsnext: true,
    preferBuiltins: true,
    browser: true,
    dedupe: ['vue'],
    extensions: ['.mjs', '.js', '.json', '.node', '.vue'],
  }),
  styles({
    mode: 'inject',
    modules: true,
  }),
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env.VUE_ENV': JSON.stringify('browser'),
  }),
  babel({
    babelHelpers: 'bundled',
    plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-private-methods'],
  }),
];

export default {
  plugins,
  input: `src/${pluginName}.js`,
  output: {
    file: fileDest,
    format: 'esm',
    sourcemap: false,
  },
  watch: {
    include: ['./src/**'],
  },
};
