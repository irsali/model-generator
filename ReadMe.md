# Model Generator or File Generator

### Purpose
This project is intended to generate files that are repetitive. Provide one template with replaceable variables and variations that should be genereated. Run the project and Voilla!!! Your files would be generated from a template. Ofcourse, this project will ask to choose the templates. 

# It could generate a project template or any kind of files with repition.
### Explore some of the templates to get an idea, how to create template and configure generation

### Steps to explore:
- Download the project
- Run `npm install`
- Run `npm start`

### Steps to Generate files of your choice
- Put the code you may want to generate in templates folder.
- Replace variable with placeholder in templates.
- In model.json file tell what should go for placeholder when output is generated.
- Run the project and check generated output.

### If you are interested in making this generator globally available (To run this project from any location). Use this command to install this project globally in your system
npm install -g

- Keep in mind when you install this project globally, you have to update templates in globally installed location
- Example of global location for windows: `C:\Users\{user}\AppData\Roaming\npm\node_modules`
-  See in package.json the key of 'bin' key would be command to run this project. Its value is configured to find generated index.js
```json
"bin": {
        "img": "./dist/index.js"
    },
```


