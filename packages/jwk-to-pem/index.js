"use strict";

const crypto = require("node:crypto");

/**
 * Convert a JWK to a PEM string.
 *
 * This package intentionally avoids `elliptic` to reduce supply-chain and CVE
 * surface area. Node.js supports importing JWKs natively.
 *
 * @param {object} jwk
 * @param {{ private?: boolean }=} opts
 * @returns {string}
 */
function jwkToPem(jwk, opts) {
  if (typeof jwk !== "object" || jwk === null) {
    throw new TypeError('Expected "jwk" to be an Object');
  }

  if (typeof jwk.kty !== "string") {
    throw new TypeError('Expected "jwk.kty" to be a String');
  }

  const isPrivate = opts?.private === true;

  let keyObject;
  if (isPrivate) {
    keyObject = crypto.createPrivateKey({ key: jwk, format: "jwk" });
  } else {
    try {
      keyObject = crypto.createPublicKey({ key: jwk, format: "jwk" });
    } catch {
      // Some JWKs may include private key material; fall back to deriving the public key.
      keyObject = crypto.createPublicKey(crypto.createPrivateKey({ key: jwk, format: "jwk" }));
    }
  }

  const exported = keyObject.export({
    format: "pem",
    type: isPrivate ? "pkcs8" : "spki",
  });

  const pem = typeof exported === "string" ? exported : exported.toString("utf8");
  return pem.endsWith("\n") ? pem : `${pem}\n`;
}

module.exports = jwkToPem;
