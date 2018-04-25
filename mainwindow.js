"use strict";
const electron = require("electron");
const ipcRenderer = electron.ipcRenderer;
const dialog = electron.remote.dialog;
const shell = electron.remote.shell;

const notifier = require("node-notifier");

document.addEventListener('DOMContentLoaded',() => {
    const webview = document.getElementById('webview');

    //pageload-failed
    webview.addEventListener("did-fail-load",(e) =>{
        dialog.showMessageBox(
            {
                type: 'error',
                buttons: ['OK'],
                title: 'Failed to load',
                message: '読み込みに失敗しました',
                detail: 'ネットワーク接続などを確認してください' + '\n\nCode : ' + e.errorCode + '\nDetail : ' + e.errorDescription
            }
        );
    });

    //newwindow
    webview.addEventListener("new-window",(e) => {
        dialog.showMessageBox(
            {
                type: 'question',
                buttons: ['Yes', 'No'],
                title: 'Question',
                message: '新しいウィンドウを開きますか？',
                detail: 'はいをクリックするとデフォルトのブラウザでリンクを開きます'
            },
            (key) => {
                if (key === 0) {
                    shell.openExternal(e.url);
                }
            }
        );
    });

    //gotooutofgame
    webview.addEventListener("will-navigate",(e) => {
        if(!e.url.match(/^https?:\/\/shinycolors\.enza\.fun\/(|[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/)){
            dialog.showMessageBox(
                {
                    type: 'warning',
                    buttons: ['Back','OK'],
                    title: 'Iris',
                    message: 'ゲーム外へのナビゲーション検知',
                    detail: 'ゲーム外へ移動しました\n移動先URL : '+e.url+'\n[Back]で前のページへ戻ります'
                },
                (key) => {
                    if(key === 0){
                        webview.executeJavaScript('history.back();');
                    }
                }
            );
        }else{
            /*dialog.showMessageBox(
                {
                    type: 'info',
                    buttons: ['OK'],
                    title: 'Iris',
                    message: 'おかえりなさい',
                    detail: 'ゲーム内へ移動します\n不具合が発生する場合は[アプリケーションのリセット(Ctrl+R)]をお試しください'
                }
            );*/
            notifier.notify(
                {
                    title:'ゲームに復帰しました',
                    message:'動作が安定しない場合はアプリケーションのリセット(Ctrl+R)をお試しください。',
                    sound:true
                }
            );
        }
    })
});

//shortcutkeys
ipcRenderer.on('devtool',() => {
    document.getElementById('webview').openDevTools();
});

ipcRenderer.on('link',(item,url) => {
    if(!url.match(/^https?(:\/\/shinycolors\.enza\.fun\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/)){
        dialog.showMessageBox(
            {
                type: 'warning',
                buttons: ['OK'],
                title: 'Warning',
                message: 'ゲーム外に移動しました',
                detail: 'ゲームに戻る場合はアプリケーションのリセット(Ctrl+R)を利用してください'
            }
        );
        webview.loadURL(url);
    }
});
