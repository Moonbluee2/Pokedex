import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.pokedex',
  appName: 'pokedex-app',
  webDir: 'www',
  server: { cleartext: true } // opcional para desarrollo
};

export default config;
