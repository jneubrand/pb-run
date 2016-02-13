'use babel';
'use strict';
/* jshint node: true */
/* jshint esversion: 6 */
/* global localStorage, console, atom, module */

const BufferedProcess = require('atom').BufferedProcess;

let PebbleToolInterface;

module.exports = PebbleToolInterface = {
    cmd(args, options, dataCallback) {
        return new Promise(function (resolve, reject) {
            try {
                new BufferedProcess({
                    command: atom.config.get('pb-run.pebblePath') ?
                             atom.config.get('pb-run.pebblePath') :
                             'pebble',
                    args: args,
                    stdout: dataCallback,
                    stderr: dataCallback,
                    options: options,
                    exit: (code) => {
                        if (code === 0) {
                            resolve();
                        } else {
                            reject(code);
                        }
                    }
                });
            } catch (e) {
                console.error(e);
            }
        });
    }
};
