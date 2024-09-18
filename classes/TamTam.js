const { Kubik } = require('rubik-main');
const FormData = require('form-data');
const fetch = require('node-fetch');
const isObject = require('lodash/isObject');
const set = require('lodash/set');

const methods = require('./TamTam/methods');

const TamTamError = require('../errors/TamTam');

const DEFAULT_HOST = 'https://botapi.tamtam.chat/';

/**
 * Кубик для запросов к API ботов TamTam
 * @class
 * @prop {String} [token] токен для доступа к API
 * @prop {String} [host=DEFAULT_HOST] адрес API TamTam
 */
class TamTam extends Kubik {
  constructor(token, host) {
    super(...arguments);
    this.token = token || null;
    this.host = host || null;

    this.generateMethods();
  }

  /**
   * Поднять кубик
   * @param  {Object} dependencies зависимости
   */
  up({ config }) {
    this.config = config;

    const options = this.config.get(this.name);

    this.token = this.token || options.token || null;
    this.host = this.host || options.host || DEFAULT_HOST;
  }

  getUrl(urlPath, token, host) {
    if (!token) token = this.token;
    if (!host) host = this.host;

    if (!token) throw new TypeError('token is not defined');
    if (!host) throw new TypeError('host is not defined');

    return `${host}${urlPath}?access_token=${token}`;
  }

  /**
   * Сделать запрос к API Ботов TamTam
   * @param  {String} name  имя метода
   * @param  {Object|String} body тело запроса
   * @param  {String} [token=this.token] токен для запроса
   * @param  {String} [host=this.host] хост API TamTam
   * @return {Promise<Object>} ответ от TamTam
   */
  async request({ path, body, method, token, host }) {
    const headers = {};

    if (body) {
      if (body instanceof FormData) {
        Object.assign(headers, body.getHeaders());
      } else if (isObject(body)) {
        body = JSON.stringify(body);
        headers['Content-Type'] = 'application/json';
      }
      if (!method) method = 'POST';
    } else {
      if (!method) method = 'GET';
    }

    const url = this.getUrl(path, token, host);
    const request = await fetch(url, { method, body, headers });

    let result = await request.text();
    try {
      result = JSON.parse(result);
    } catch (err) {
      throw new TamTamError(`invalid response body: ${result}`);
    }

    return result;
  }

  generateMethods() {
    methods.forEach(({ method, path }) => {
      const methodFunction = (options) => {
        if (!options) options = {};
        const { body, pathParams, token, host, method } = options;
        let urlPath = path;
        if (path instanceof Function) {
          urlPath = path(pathParams);
        }

        return this.request({ path: urlPath, body, method, token, host });
      };

      set(this, method, methodFunction);
    });
  }
}

TamTam.prototype.dependencies = Object.freeze(['config']);
TamTam.prototype.name = 'tamtam';

module.exports = TamTam;
