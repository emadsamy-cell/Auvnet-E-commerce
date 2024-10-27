exports.generateOTP = () => {
    const value = Math.floor(100000 + Math.random() * 900000);
    //expires in 5 minutes
    const expiresAt = Date.now() + 5 * 60 * 1000;
    return { value, expiresAt };
};