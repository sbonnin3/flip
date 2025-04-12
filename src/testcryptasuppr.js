const bcrypt = require('bcrypt');

async function testBcrypt() {
    const plainPassword = "administrateur";
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plainPassword, salt);

    console.log("NOUVEAU HASH:", hash);

    const match = await bcrypt.compare(plainPassword, hash);
    console.log("COMPARAISON:", match); // Doit être true
}

testBcrypt();