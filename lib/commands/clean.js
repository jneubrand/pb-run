'use babel';
'use strict';
/* jshint node: true */
/* jshint esversion: 6 */
/* global localStorage, console, atom, module */
const PebbleToolInterface = require('../pebbletool');
const OutputViewManager = require('../output-view-manager').OutputViewManager;

class PbRunCleanCommand {
    run() {
        let args = ['clean'];
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

module.exports = PbRunCleanCommand;
