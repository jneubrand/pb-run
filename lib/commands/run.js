'use babel';
'use strict';
/* jshint node: true */
/* jshint esversion: 6 */
/* global localStorage, console, atom, module, document */

const View = require('atom-space-pen-views').View;
const TextEditorView = require('atom-space-pen-views').TextEditorView;
const CompositeDisposable = require('atom').CompositeDisposable;
const PebbleToolInterface = require('../pebbletool');
const OutputViewManager = require('../output-view-manager').OutputViewManager;

class RunCommandView extends View {
    constructor(projectFolder) {
        super();
        this.projectFolder = projectFolder;
        this.disposables = new CompositeDisposable();
        this.currentPane = atom.workspace.getActivePane();
        if (this.panel === undefined || this.panel === null) {
            this.panel = atom.workspace.addModalPanel({item: this});
        }
        this.panel.show();
        this.commandEditor.focus();
        this.disposables.add(atom.commands.add(
            'atom-text-editor', {
                'core:cancel': () => {
                    if (this.panel !== undefined && this.panel !== null) {
                        this.panel.destroy();
                    }
                    this.currentPane.activate();
                    this.disposables.dispose();
                }
            }
        ));
        this.disposables.add(atom.commands.add(
            'atom-text-editor', {
                'core:confirm': () => {
                    let args = this.commandEditor.getText().split(' ');
                    if (this.panel !== undefined && this.panel !== null) {
                        this.panel.destroy();
                    }
                    this.currentPane.activate();
                    this.disposables.dispose();
                    let options = {
                        cwd: atom.project.getPaths()[0]
                    };
                    let view = OutputViewManager.new();
                    PebbleToolInterface.cmd(args, options,
                        data => {
                            view.addLine(data);
                        }
                    ).then(() => {
                        view.finish();
                    }).catch((e) => {
                        view.finish();
                        console.info('Pb-Run: exit code', e);
                    });
                }
            }
        ));
    }
}

RunCommandView.content = function() {
    return this.div({class: 'pb-run pb-run-modal'}, () => {
        this.subview('commandEditor', new TextEditorView({
            mini: true,
            placeHolderText: 'Git command and arguments'
        }));
    });
};

class PbRunRunCommand {
    run(projectFolder) {
        document.querySelector('status-bar .pb-run-watch')
            .setAttribute('enabled', 'true');
        new RunCommandView(projectFolder);
    }
}

module.exports = PbRunRunCommand;
