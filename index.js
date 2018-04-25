"use strict";

const electron = require("electron");
const app = electron.app;
const dialog = electron.dialog;
const shell = electron.shell;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;

const notifier = require("node-notifier");

let mainWindow = null;
let splashWindow = null;

app.on("window-all-closed",() => {
    app.quit();
});

app.on("ready",() => {
	splashWindow = new BrowserWindow(
		{
			width:450,
			height:250,
			useContentSize:true,
			resizable:false,
			transparent:true,
			frame:false,
			alwaysOnTop:true,
			skipTaskbar:true
		}
	);
	splashWindow.loadURL('file://'+__dirname+'/splash.html');
    mainWindow = new BrowserWindow(
        {
            width:1024,
            height:576,
            useContentSize:true,
            minWidth:1024,
            minHeight:576,
            title:'Iris',
			show:false,
			backgroundColor:'#000'
        }
    );
    mainWindow.loadURL('file://'+__dirname+'/index.html');
    mainWindow.on("closed",() => {
        mainWindow = null;
    });
    mainWindow.once("ready-to-show",() => {
        mainWindow.show();
	});
	setTimeout(() => {
		splashWindow.destroy();
		notifier.notify(
			{
				title:'おかえりなさい！',
				message:'アイドルたちが待っていますよ！',
				sound:true
			}
		);
    }, 5000);
});

//# MENU #//

const templateMenu = [
	{
		label: '&Iris',
		submenu: [
			{
				label: '終了',
				accelerator: 'Alt+F4',
				click() { app.quit(); }
			}
		]
	},
	{
		label: '表示(&V)',
		submenu: [
			/*{
				label: '戻る(&B)',
				accelerator: 'F4',
				click(item, focusedWindow) {
					if (focusedWindow) {
						focusedWindow.webContents.send('jump', 'back');
					}
				}
			},
			{
				label: '更新(&R)',
				accelerator: 'F5',
				click(item, focusedWindow) {
					if (focusedWindow) {
						focusedWindow.webContents.send('jump', 'reload');
					}
				}
			},
			{
				label: '進む(&F)',
				accelerator: 'F6',
				click(item, focusedWindow) {
					if (focusedWindow) {
						focusedWindow.webContents.send('jump', 'forward');
					}
				}
			},
			{
				type: 'separator'
            },*/
            {
				label: 'フルスクリーン表示(&S)',
				type: 'checkbox',
                accelerator: 'F11',
                click(item, focusedWindow) {
                    if(focusedWindow){
                        if(focusedWindow.isFullScreen()){
							focusedWindow.setFullScreen(false);
							focusedWindow.setMenuBarVisibility(true);
                        }else{
							focusedWindow.setFullScreen(true);
							focusedWindow.setMenuBarVisibility(false);
                        }
                    }
                }
            },
			{
				label: '最前面表示(&T)',
				type: 'checkbox',
				accelerator: 'CmdOrCtrl+T',
				click(item, focusedWindow) {
					if (focusedWindow) {
						if (focusedWindow.isAlwaysOnTop()) {
							focusedWindow.setAlwaysOnTop(false);
						} else {
							focusedWindow.setAlwaysOnTop(true);
						}
					}
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'アプリケーションのリセット',
				accelerator: 'CmdOrCtrl+R',
				click(item, focusedWindow) {
					if (focusedWindow){
						focusedWindow.loadURL('file://' + __dirname + '/index.html');
					}
				}
			},
			{
				label: '開発者ツール',
				click(item, focusedWindow) {
					dialog.showMessageBox(
						{
							type:'warning',
							title:'Developer Tools',
							buttons:['Developer Tools [&App]','Developer Tools [&Webview]','Cancel'],
							message:'開発者ツールについて',
							detail:'このツールは開発者向けに用意されているものです。ゲームをプレイするだけであればこのツールを開く必要はありません。\n他人から教えられたコードやテキストを実行すると、個人情報を騙し取られるなどの被害を受ける恐れがあります。\nあなたがこれから行おうとしていることを理解していないのであれば、このツールを使わないでください。'
						},
						(key) => {
							if(key === 0 && focusedWindow){
								focusedWindow.webContents.toggleDevTools();
							}
							if(key === 1 && focusedWindow){
								focusedWindow.webContents.send('devtool');
							}
						}
					);
				}
			}
		]
	},
	{
		label: 'ヘルプ(&H)',
		submenu: [
			/*{
				label: 'GitHub Wiki(&W)',
				accelerator: 'F1',
				click() { shell.openExternal('https://github.com/miyacorata/Aschenputtel/wiki'); }
			},
			{
				label: '更新の確認(&C)',
				click() {
					dialog.showMessageBox(
						{
							type: 'question',
							buttons: ['Yes', 'No'],
							title: 'Question',
							message: 'ブラウザを開いて更新を確認します',
							detail: 'はいをクリックするとブラウザでGitHubのリリースページを開きます\n更新があれば最新版をダウンロードしてください\n\n現在のバージョン : ' + app.getVersion()
						},
						(key) => {
							if (key === 0) {
								shell.openExternal('https://github.com/miyacorata/Aschenputtel/releases');
							}
						}
					);
				}
			},*/
			{
				label: 'Irisについて(&A)',
				click() {
					//splashWindow.show();
					dialog.showMessageBox(
						BrowserWindow.getFocusedWindow(),
						{
							title: 'About Iris',
							type: 'info',
							buttons: ['OK'],
							message: 'Iris',
							detail: 'Gaming Browser for THE IDOLM@STER SHINY COLORS\nDevelop : @miyacorata\nVersion : ' + app.getVersion()
						}
					);
				}
			}
		]
	}
];
const menu = Menu.buildFromTemplate(templateMenu);
Menu.setApplicationMenu(menu);