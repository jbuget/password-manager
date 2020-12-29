const useCases = require('../../../application');
const vaultSerializer = require('../../serializers/vault-serializer');

module.exports = function(fastify, options, done) {

  fastify.route({
    method: 'GET',
    url: '/vaults',
    handler: async function(request, reply) {
      const ownerId = request.user.id;
      const listOfVaultSummaries = await useCases.listVaults({ ownerId }, this.container);
      const response = vaultSerializer.serialize(listOfVaultSummaries);
      return reply.code(200).send(response);
    },
  });

  fastify.route({
    method: 'POST',
    url: '/vaults',
    handler: async function(request, reply) {
      const ownerId = request.user.id;
      const params = { accountId: ownerId, name: request.body.name };
      const vault = await useCases.createVault(params, this.container);
      reply.code(201).send(vault);
    },
  });

  fastify.register((instance, opts, done) => {

    instance.addHook('preValidation', async (request, reply) => {
      const vaultId = parseInt(request.params.id);
      const ownerId = request.user.id;
      const vaultRepository = fastify.container.get('vaultRepository');
      const isExisting = await vaultRepository.existsByIdAndAccountId(vaultId, ownerId);
      if (!isExisting) {
        reply.code(404).send({
          "statusCode": 404,
          "code": "404",
          "error": "Resource not found",
        });
      }
    });

    instance.route({
      method: 'GET',
      url: '/',
      handler: async function(request, reply) {
        const ownerId = request.user.id;
        const params = { id: parseInt(request.params.id), accountId: ownerId };
        return await useCases.getVault(params, this.container);
      },
    });

    instance.route({
      method: 'PATCH',
      url: '/',
      handler: async function(request, reply) {
        const params = Object.assign({}, request.body, { id: parseInt(request.params.id) });
        const vault = await useCases.updateVault(params, this.container);
        reply.code(200).send(vault);
      },
    });

    instance.route({
      method: 'DELETE',
      url: '/',
      handler: async function(request, reply) {
        const params = { id: parseInt(request.params.id) };
        await useCases.deleteVault(params, this.container);
        reply.code(204).send(null);
      },
    });

    instance.route({
      method: 'GET',
      url: '/items',
      handler: async function(request, reply) {
        const params = { vaultId: parseInt(request.params.id) };
        const items = await useCases.getVaultItems(params, this.container);
        reply.code(200).send(items);
      },
    });

    instance.route({
      method: 'POST',
      url: '/items',
      handler: async function(request, reply) {
        const params = Object.assign({}, request.body, { vaultId: parseInt(request.params.id) });
        const item = await useCases.createItem(params, this.container);
        reply.code(201).send(item);
      },
    });

    done();
  }, { prefix: '/vaults/:id' });

  done();
};
