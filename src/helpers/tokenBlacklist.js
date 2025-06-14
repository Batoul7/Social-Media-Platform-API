
const blacklistedTokens = new Set();

module.exports = {
    // Adds a given token to the blacklist.
    addToBlacklist: (token) => {
        blacklistedTokens.add(token);
    },
    // Checks if a given token is present in the blacklist.
    isBlacklisted: (token) => {
        return blacklistedTokens.has(token);
    }
};