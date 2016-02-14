'use babel';
'use strict';
/* jshint node: true */
/* jshint esversion: 6 */
/* global localStorage, console, atom, module, document */

const commandProvider = require('./commands');
const CompositeDisposable = require('atom').CompositeDisposable;
const OutputViewManager = require('./output-view-manager').OutputViewManager;

module.exports = {
    config: {
        messageTimeout: {
            'type': 'integer',
            'default': 5,
            'description': 'How long command output should be shown'
        }
    },
    injectCommands() {
        for (let command in this.commands) {
            let commandFunc = new this.commands[command]().run;
            this.registeredCommands.add(
                atom.commands.add('atom-text-editor', command, commandFunc));
        }
    },
    activate() {
        this.commands = commandProvider.getCommands();
        this.registeredCommands = new CompositeDisposable();
        this.injectCommands();
    },
    clearOwnCommands() {
        this.registeredCommands.dispose();
    },
    showStatusBarItem() {
        if (this.statusBarItem) {
            this.statusBarItem.show();
        }
    },
    hideStatusBarItem() {
        if (this.statusBarItem) {
            this.statusBarItem.hide();
        }
    },
    consumeStatusBar(statusBar) {
        this.statusBarItem = document.createElement('div');
        this.statusBarItem.classList.add('inline-block', 'pb-run-watch');

        let link = document.createElement('a');
        link.onclick = (e => {OutputViewManager.getView().toggle();});
        link.title = "Toggle Pb-Run Output Console";
        this.statusBarItem.appendChild(link);

        let icon = document.createElement('span');
        icon.classList.add('icon', 'icon-clock');
        link.appendChild(icon);

        let statusBarTile = statusBar.addRightTile({item: this.statusBarItem, priority: 0});
    }
};
