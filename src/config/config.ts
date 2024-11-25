interface IConfig {
  url_provet: string;
  url_provet_api: string;
}

export const currentEnv = process.env.REACT_APP_BUILD_MODE || 'production';

let config: IConfig;

switch (currentEnv) {
  case 'production':
    config = require('./production');
    break;
  default:
    config = require('./development');
}

export default config;
