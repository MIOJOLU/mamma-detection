const {app, BrowserWindow} = require('electron');

const createWindow = async () => {
    const win = new BrowserWindow({
        width: 900,
        height: 600
    });
    await win.loadFile('src/pages/send-image/index.html');
}

app.whenReady().then(() => {
    createWindow();
});
