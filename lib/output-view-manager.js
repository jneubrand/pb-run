'use babel';
'use strict';
/* jshint node: true */
/* jshint esversion: 6 */
/* global localStorage, console, atom, module */

const ScrollView = require('atom-space-pen-views').ScrollView;

let defaultMessage = '[Loading...]';

class OutputView extends ScrollView {
    constructor() {
        super();
        this.message = '';
    }
    addLine(line) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        if (this.message == defaultMessage) {
            this.message = '';
        }
        this.message += line;
        this.find('.output').text(this.message);
        return this;
    }
    reset() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.message = defaultMessage;
        this.find('.output').text(this.message);
    }
    finish() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        let timeoutLen = atom.config.get('messageTimeout') * 1000;
        timeoutLen = timeoutLen ? timeoutLen : 5000;
        this.find('.output').text(this.message);
        this.show();
        this.timeout = setTimeout(
            () => {
                this.toggle();
            }, timeoutLen
        );
    }
    toggle() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        ScrollView.prototype.toggle.call(this);
    }
}

OutputView.content = function() {
    return this.div({class: 'pb-run output-view'}, () => {
        this.pre({class: 'output'}, defaultMessage);
    });
};

module.exports.OutputView = OutputView;

let activeView = null;
class OutputViewManager {
    constructor() {
        this.view = null;
    }
    new() {
        if (activeView) {
            activeView.reset();
        }
        return this.getView();
    }
    getView() {
        if (!activeView) {
            activeView = new module.exports.OutputView();
            atom.workspace.addBottomPanel({item: activeView});
            // activeView.hide();
        }
        return activeView;
    }
}

let manager = new OutputViewManager();

module.exports.OutputViewManager = manager;
