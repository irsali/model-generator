### This project is intended to generate files that are repetitive. Provide one template with replaceable variables and variations that should be genereated. Run the project and Voilla!!! Your files would be generated from a template. Ofcourse, this project will ask to choose the templates. 

# It could be a project template or any kind of files with repition.

- Put the code you may want to generate in templates folder.
- Replace variable with placeholder in templates.
- In model.json file tell what should go for placeholder when output is generated.
- Run the project and check generated output.

# If you are interested in making this generator globally available. Use this command to install this project globally in your system
npm install -g

- Keep in mind when you install this project globally, you have to update templates in globally installed location
- Example of global location for windows: 

## To run this project form any location. See in package.json the key of 'bin' key would be command to run this project. Its value is configured to find generated index.js
```json
"bin": {
        "img": "./dist/index.js"
    },
```


