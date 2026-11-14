import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { keycloak } from './app/keycloak';
keycloak
  .init({ onLoad: 'login-required', pkceMethod: 'S256', checkLoginIframe: false})
  .then(()=>{
    setInterval(() => keycloak.updateToken(70), 60000);

    bootstrapApplication(App, appConfig).catch((err) => console.error(err));
  })
  .catch((err)=>console.error('Đăng nhập thất bại', err));


