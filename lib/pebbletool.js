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
                let cmd = atom.config.get('pb-run.pebblePath') ?
                    atom.config.get('pb-run.pebblePath') :
                    'pebble';
                let child = require('cross-spawn-async').spawn(
                    cmd,
                    args,
                    {}
                );

                child.stdout.on('data', (buffer) => {
                    dataCallback(buffer);
                });
                child.stderr.on('data', (buffer) => {
                    dataCallback(buffer);
                });
                child.on('error', (err) => {
                    reject('Error running ' + cmd + ' ' + args + '.');
                });
                child.on('close', (code) => {
                    if (code === 0) {
                        resolve();
                    } else {
                        reject('Exit code: ' + code);
                    }
                });
            } catch (e) {
                console.error(e);
            }
        });
    }
};
