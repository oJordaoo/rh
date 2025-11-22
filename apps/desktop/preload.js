const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('peopleos', {
  version: '0.0.1',
});
