const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = path.join(__dirname, '..');

function genKeyPair() {
  if (!fs.existsSync(rootDir, 'id_rsa_pub.pem')) {
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

    fs.writeFileSync(rootDir, 'id_rsa_pub.pem', keyPair.publicKey);
    fs.writeFileSync(rootDir, 'id_rsa_priv.pem', keyPair.privateKey);

    console.log('genKeyPair called');
  }
}

module.exports = genKeyPair;
