const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    getInfo: () => ipcRenderer.invoke('get-info')
});
