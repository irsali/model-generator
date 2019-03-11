"use strict";
// #!/usr/bin/env node
// above line is quite important. It tells the following script should be interpreted by node, otherwise it will be interpreted as shell script
Object.defineProperty(exports, "__esModule", { value: true });
var utility_1 = require("./utility");
var inquirer = require("inquirer");
var fs = require("fs");
var CHOICES = fs.readdirSync("" + __dirname + "/../templates");
var QUESTIONS = [
    {
        name: 'template-choice',
        type: 'list',
        message: 'What template would you like to generate?',
        choices: CHOICES
    },
    {
        name: 'folder-name',
        type: 'input',
        message: 'folder name (If folder not required, press Enter):',
        validate: function (input) {
            if (/^([A-Za-z\-\_\d])+$/.test(input))
                return true;
            else if (!input)
                return true;
            else
                return 'folder name may only include letters, numbers, underscores and hashes.';
        }
    }
];
var CURR_DIR = process.cwd();
inquirer.prompt(QUESTIONS)
    .then(function (answers) {
    var projectChoice = answers['template-choice'];
    var rootFolderName = answers['folder-name'];
    var templatePath = "" + __dirname + ("/../templates/" + projectChoice + "/template");
    var modelPath = "" + __dirname + ("/../templates/" + projectChoice + "/model.json");
    // make folder if not exist
    if (!fs.existsSync(CURR_DIR + "/" + rootFolderName))
        fs.mkdirSync(CURR_DIR + "/" + rootFolderName);
    // read model json and convert to object
    var modeljson = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
    // extract data
    var modelKey = modeljson['@name'] || '@model'; // @name is not provided choose default @model 
    var models = modeljson.models;
    var keyvalues = modeljson.keyvalues;
    models.forEach(function (model) {
        var modelName;
        var modelKeyValues;
        if (typeof model == 'string') {
            modelName = model;
            modelKeyValues = Object.assign({}, keyvalues);
        }
        else {
            modelName = model['@name'];
            modelKeyValues = Object.assign({}, keyvalues, model);
        }
        createDirectoryContents(templatePath, rootFolderName, modelKey, modelName, modelKeyValues);
    });
});
function createDirectoryContents(templatePath, targetPath, modelKey, modelName, keyvalues) {
    var filesOrFoldersToCreate = fs.readdirSync(templatePath);
    var keys = Object.keys(keyvalues);
    filesOrFoldersToCreate.forEach(function (fileOrFolder) {
        var srcFilePath = templatePath + "/" + fileOrFolder;
        // get stats about the current file
        var stats = fs.statSync(srcFilePath);
        if (stats.isFile()) // file 
         {
            var destFileName = fileOrFolder.replace(modelKey, modelName);
            var writePath = CURR_DIR + "/" + targetPath + "/" + destFileName;
            // if (!fs.existsSync(writePath)) {
            if (true) {
                var contents_1 = fs.readFileSync(srcFilePath, 'utf8');
                keys.forEach(function (key) {
                    var value = keyvalues[key];
                    contents_1 = utility_1.replaceAll(contents_1, key, value);
                });
                contents_1 = utility_1.replaceAll(contents_1, modelKey, modelName);
                // Rename
                if (fileOrFolder === '.npmignore')
                    fileOrFolder = '.gitignore';
                fs.writeFileSync(writePath, contents_1, 'utf8');
            }
        }
        else if (stats.isDirectory()) // folder
         {
            if (!fs.existsSync(CURR_DIR + "/" + targetPath + "/" + fileOrFolder)) {
                fs.mkdirSync(CURR_DIR + "/" + targetPath + "/" + fileOrFolder);
            }
            // recursive call
            createDirectoryContents(templatePath + "/" + fileOrFolder, targetPath + "/" + fileOrFolder, modelKey, modelName, keyvalues);
        }
    });
}
//# sourceMappingURL=index.js.map