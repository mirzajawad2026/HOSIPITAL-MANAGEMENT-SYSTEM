# HMS Electron Setup

This folder wraps your existing React HMS frontend in Electron.

## Expected structure

Hospital-Management-System/
- client/
- server/
- electron/

## Install
```bash
cd electron
npm install
```

## Run development

Start your Node/Express backend using its normal command.

Start React:
```bash
cd client
npm run dev
```

Then:
```bash
cd electron
npm start
```

The default React/Vite URL is:
`http://localhost:5173`

If your frontend uses another port:

Windows CMD:
```cmd
set ELECTRON_RENDERER_URL=http://localhost:3000
npm start
```

PowerShell:
```powershell
$env:ELECTRON_RENDERER_URL="http://localhost:3000"
npm start
```

## Build Windows installer

First:
```bash
cd client
npm run build
```

Then:
```bash
cd ../electron
npm run dist
```

Installer will be in:
`electron/release/`

## Printing

From React:
```js
window.electronAPI?.printPage();
```

MongoDB should remain behind your Node/Express API. Electron should not connect directly to MongoDB.
