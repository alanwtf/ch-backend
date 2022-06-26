const FileContainer = require("../containers/FileContainer");

class productsDaoFiles extends FileContainer {
    constructor() {
        super(`products.json`);
    }
}

module.exports = productsDaoFiles;
