'use babel';
'use strict';
/* jshint node: true */
/* jshint esversion: 6 */
/* global localStorage, console, atom, module */
import fs from 'fs';

export function getCommands() {
    // if (!fs.existsSync(`${atom.project.getPaths()[0]}/appinfo.json`)) {
    //     // appinfo.json missing
    //     return {};
    // }
    return {
        'pb-run:clean': require('./commands/clean'),
        'pb-run:screenshot': require('./commands/screenshot'),
        'pb-run:run': require('./commands/run'),
        'pb-run:ping': require('./commands/ping')
    };
}
