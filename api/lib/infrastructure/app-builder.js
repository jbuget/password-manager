const fastify = require('fastify');
const helmet = require('fastify-helmet');

const IocContainer = require('./ioc-container');
const AccountRepositorySql = require('./repositories/AccountRepositorySql');
const ItemRepositorySql = require('./repositories/ItemRepositorySql');
const VaultRepositorySql = require('./repositories/VaultRepositorySql');
const BcryptEncryption = require('./security/BcryptEncryption');

function build(opts = {}) {

  // See https://nodejs.org/api/net.html#net_server_listen_options_callback
  const app = fastify(opts);

  // https://github.com/fastify/fastify-helmet
  app.register(helmet);

  const container = new IocContainer();
  container.register('accountRepository', new AccountRepositorySql());
  container.register('itemRepository', new ItemRepositorySql());
  container.register('vaultRepository', new VaultRepositorySql());
  container.register('encryption', new BcryptEncryption());
  app.decorate('container', container);

  app.register(function(instance, opts, done) {

    function registerRoute(routeOptions) {
      instance.route(routeOptions);
    }

    require('./routes/v1/root').forEach(registerRoute);
    require('./routes/v1/vaults').forEach(registerRoute);
    require('./routes/v1/accounts').forEach(registerRoute);
    require('./routes/v1/items').forEach(registerRoute);
    done();
  }, { prefix: '/api/v1' });

  return app;
}

module.exports = build;
