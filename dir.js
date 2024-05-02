
const fs = require('fs');


if (!fs.existsSync('new-directory')) {
    fs.mkdir('new-directory', (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Directory created successfully!');
    });
}
// Create a new directory




