import { Query } from 'mongoose';
import { createClient } from 'redis';
import { promisify } from 'util';

const client = createClient(process.env.REDIS_URL);
client.hget = promisify(client.hget);
const { exec } = Query.prototype;

Query.prototype.cache = (options = {}) => {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');
  return this;
};

Query.prototype.exec = async (...args) => {
  if (!this.useCache) {
    return exec.apply(this, args);
  }
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    }),
  );
  // See if we have a value for 'key' in redis
  const cacheValue = await client.hget(this.hashKey, key);
  // If we do, return that
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);
    return Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.model(doc);
  }

  // Otherwise, issue the query and store the result in redis
  const result = await exec.apply(this, ...args);

  client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10);

  return result;
};

export default function clearHash(hashKey) {
  client.del(JSON.stringify(hashKey));
}
