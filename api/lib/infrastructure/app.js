const fastify = require('fastify');
const IocContainer = require('./ioc-container');
const PassRepositorySql = require('./repositories/PassRepositorySql');

function build(opts={}) {

  // See https://nodejs.org/api/net.html#net_server_listen_options_callback
  const app = fastify(opts);

  const container = new IocContainer();
  container.register('PassRepository', new PassRepositorySql());
  app.decorate('container', container);

  const rootRoutes = require('./routes/root');

  rootRoutes.forEach(route => {
    app.route(route);
  });

  return app;
}

module.exports = build;
