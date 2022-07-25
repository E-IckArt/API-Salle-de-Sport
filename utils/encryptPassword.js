// Permet de générer le token (génération d'un nombre aléatoire)
const uid2 = require('uid2');

// Permettent de crypter le mot de passe
const SHA256 = require('crypto-js/sha256');
const encBase64 = require('crypto-js/enc-base64');

function encryptPassword(password) {
    const token = uid2(16);
    const salt = uid2(16); // Mélange le mot de passe avant cryptage
    const hash = SHA256(salt + password).toString(encBase64); //Mélange le mot de passe passé en paramètre et le salt
    return { token, salt, hash };
}

module.exports = encryptPassword;
