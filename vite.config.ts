import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5';

import { createRequire } from 'node:module';
const require = createRequire( import.meta.url );

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.xlsx'],
  plugins: [react(),  ckeditor5( { theme: require.resolve( '@ckeditor/ckeditor5-theme-lark' ) } )],
});
