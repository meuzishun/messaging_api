const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = path.join(__dirname, '..');

function genKeyPair() {
  const publicKeyPath = path.join(rootDir, 'id_rsa_pub.pem');
  const privateKeyPath = path.join(rootDir, 'id_rsa_priv.pem');

  if (!fs.existsSync(publicKeyPath)) {
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

    fs.writeFileSync(publicKeyPath, keyPair.publicKey);
    fs.writeFileSync(privateKeyPath, keyPair.privateKey);

    console.log('genKeyPair called');
  }
}

module.exports = genKeyPair;
