const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const configDir = path.join(__dirname, '..', '/config/');

function genKeyPair() {
  if (!fs.existsSync(configDir + 'id_rsa_pub.pem')) {
    const keyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096, // bits - standard for RSA keys
      publicKeyEncoding: {
        type: 'pkcs1', // "Public Key Cryptography Standards 1"
        format: 'pem', // Most common formatting choice
      },
      privateKeyEncoding: {
        type: 'pkcs1', // "Public Key Cryptography Standards 1"
        format: 'pem', // Most common formatting choice
      },
    });

    fs.writeFileSync(configDir + 'id_rsa_pub.pem', keyPair.publicKey);
    fs.writeFileSync(configDir + 'id_rsa_priv.pem', keyPair.privateKey);

    console.log('genKeyPair called');
  }
}

module.exports = genKeyPair;
