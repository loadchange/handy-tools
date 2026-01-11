import { pki } from 'node-forge';

export async function generateKeyPair(config: { bits?: number } = {}) {
  const { bits = 2048 } = config;

  return new Promise((resolve, reject) => {
    pki.rsa.generateKeyPair({ bits }, (err, keyPair) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const publicKeyPem = pki.publicKeyToPem(keyPair.publicKey);
        const privateKeyPem = pki.privateKeyToPem(keyPair.privateKey);

        resolve({
          publicKeyPem,
          privateKeyPem,
        });
      } catch (error) {
        reject(error);
      }
    });
  });
}