'use babel';
'use strict';
/* jshint node: true */
/* jshint esversion: 6 */
/* global localStorage, console, atom, module */
const PebbleToolInterface = require('../pebbletool');
const OutputViewManager = require('../output-view-manager').OutputViewManager;

class PbRunScreenshotCommand {
    run() {
        let args = ['screenshot'];
        let options = {
            cwd: atom.project.getPaths()[0]
        };
        console.log(PebbleToolInterface);
        let view = OutputViewManager.new();
        PebbleToolInterface.cmd(args, options,
            data => {
                console.log(data);
                view.addLine(data);
                console.log(view);
            }
        ).then(() => {
            console.log('done');
            view.finish();
        }).catch((e) => {
            console.log('done err');
            view.finish();
            console.info('Pb-Run: caught', e);
        });
    }
}

module.exports = PbRunScreenshotCommand;
