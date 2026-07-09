const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
  scrape:     url       => ipcRenderer.invoke('scrape', url),
  dbGet:      k         => ipcRenderer.invoke('db:get', k),
  dbSet:      (k,v)     => ipcRenderer.invoke('db:set', k, v),
  openUrl:    url       => ipcRenderer.invoke('shell:open', url),
  pngSave:    (d,n)     => ipcRenderer.invoke('png:save', d, n),
  pngCopy:    d         => ipcRenderer.invoke('png:copy', d),
  jsonExport: ()        => ipcRenderer.invoke('json:export'),
  jsonImport: ()        => ipcRenderer.invoke('json:import'),
});
