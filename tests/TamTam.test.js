/* global describe test expect */
const path = require('path');
const { Kubiks: { Config } } = require('rubik-main');

const { createApp, createKubik } = require('rubik-main/tests/helpers/creators');

const TamTam = require('../classes/TamTam.js');

const CONFIG_VOLUMES = [
  path.join(__dirname, '../default/'),
  path.join(__dirname, '../config/')
];

const getApp = () => {
  const app = createApp();
  app.add(new Config(CONFIG_VOLUMES));

  return app;
};

describe('Кубик для работы с TamTam', () => {
  test('Создается без проблем и добавляется в App', () => {
    const app = getApp();
    const kubik = createKubik(TamTam, app);
    expect(app.tamtam).toBe(kubik);
    expect(app.get('tamtam')).toBe(kubik);
  });

  test('Делает тестовый запрос к тамтам (не забудьте добавить токен в настройки)', async () => {
    const app = getApp();
    const kubik = createKubik(TamTam, app);
    await app.up();
    const response = await kubik.me({});
    expect(response.name).toBeDefined();
    await app.down();
  });

  test('Отправляет запрос с кастомным токеном', async () => {
    const app = getApp();
    const config = app.config;
    const kubik = createKubik(TamTam, app);
    const token = config.get(kubik.name).token;
    config.get(kubik.name).token = null;
    await app.up();
    const response = await kubik.me({ token });
    expect(response.name).toBeDefined();
    await app.down();
  });

  test('Запрос с невалидным токеном падает', async () => {
    const app = getApp();
    const kubik = createKubik(TamTam, app);
    await app.up();
    await expect(kubik.me({ token: '12345' })).rejects.toThrow();
    await app.down();
  });
});
