#!/usr/bin/env node
// above line is quite important. It tells the following script should be interpreted by node, otherwise it will be interpreted as shell script


const inquirer = require('inquirer');
const fs = require('fs');

const CHOICES = fs.readdirSync(`${__dirname}/templates`);

const QUESTIONS = [
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
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else if (!input) return true;
      else return 'folder name may only include letters, numbers, underscores and hashes.';
    }
  }
];

const CURR_DIR = process.cwd();

inquirer.prompt(QUESTIONS)
  .then(answers => {
    const projectChoice = answers['template-choice'];
    const rootFolderName = answers['folder-name'];
    const templatePath = `${__dirname}/templates/${projectChoice}/template`;
    const modelPath = `${__dirname}/templates/${projectChoice}/model.json`;

    // make folder if not exist
    if (!fs.existsSync(`${CURR_DIR}/${rootFolderName}`))
      fs.mkdirSync(`${CURR_DIR}/${rootFolderName}`);

    // read model json and convert to object
    var modeljson = JSON.parse(fs.readFileSync(modelPath, 'utf8'));

    // extract data
    let modelKey = modeljson['@name'] || '@model'; // @name is not provided choose default @model 
    let models = modeljson.models;
    const keyvalues = modeljson.keyvalues;

    models.forEach((model) => {
      let modelName;
      let modelKeyValues;

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

  const filesOrFoldersToCreate = fs.readdirSync(templatePath);

  let keys = Object.keys(keyvalues);

  filesOrFoldersToCreate.forEach(fileOrFolder => {
    const srcFilePath = `${templatePath}/${fileOrFolder}`;

    // get stats about the current file
    const stats = fs.statSync(srcFilePath);

    if (stats.isFile()) // file 
    {
      const destFileName = fileOrFolder.replace(modelKey, modelName);
      const writePath = `${CURR_DIR}/${targetPath}/${destFileName}`;

      // if (!fs.existsSync(writePath)) {
      if (true) {
        let contents = fs.readFileSync(srcFilePath, 'utf8');
        keys.forEach(key => {
          let value = keyvalues[key];
          contents = replaceAll(contents, key, value);
        });

        contents = replaceAll(contents, modelKey, modelName);

        // Rename
        if (fileOrFolder === '.npmignore') fileOrFolder = '.gitignore';

        fs.writeFileSync(writePath, contents, 'utf8');
      }
    }
    else if (stats.isDirectory()) // folder
    {
      if (!fs.existsSync(`${CURR_DIR}/${targetPath}/${fileOrFolder}`)) {
        fs.mkdirSync(`${CURR_DIR}/${targetPath}/${fileOrFolder}`);
      }
      // recursive call
      createDirectoryContents(`${templatePath}/${fileOrFolder}`, `${targetPath}/${fileOrFolder}`, modelKey, modelName, keyvalues);
    }
  });
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

