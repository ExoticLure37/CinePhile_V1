const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: 'doi8ujrcr',
    api_key: '459178121384571',
    api_secret: 'h6E7uVEMOGgBxbh-F0q6VQVhh0o'
});

const uploadOnCloundinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        }

        const res = await cloudinary.uploader
            .upload(
                localFilePath, {
                resource_type: "auto"
            }
            );
        fs.unlinkSync(localFilePath);
        return res;
    } catch (err) {

        return null;
    }
};

module.exports = uploadOnCloundinary ;
