const fs = require('fs');
const path = require('path');
const vm = require('vm');

const templateContext = vm.createContext({});

module.exports = function createTemplate(templatePath) {
  return vm.runInContext(
    `
      (function render() {
        return function(data) {
          with(data) {
            return \`${fs.readFileSync(templatePath, 'utf-8')}\`     
          }
        }
      })
    `,
    templateContext
  )(function (relativePath, data) {
    return createTemplate()(data);
  });
};
