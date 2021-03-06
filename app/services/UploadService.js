const randomToken = require('random-token');
const sharp = require('sharp');
const s3 = require("../config/bucket.js");

module.exports = (account, bucket) => {
    const convertPicture = (buffer, fileFormat, width, height) => new Promise((resolve, reject) => {
        sharp(buffer)
            .resize(width, height, {
                kernel: sharp.kernel.lanczos2,
                interpolator: sharp.interpolator.nohalo
            })
            .background('black')
            .embed()
            .toBuffer((err, imgBuffer) => {
                if (err) {
                    console.error(err);

                    return reject(err);
                }
                
                return resolve(imgBuffer);
            });
    });
  
    return {
        uploadToBucket: uploadToBucket
    };

    function uploadToBucket (rawBuffer, namespace, fileFormat, width, height, callback) {
        convertPicture(rawBuffer, fileFormat, width, height)
            .then(buffer => {
                    const key = `${namespace}/${randomToken(32)}.jpeg`;
                    const params = {
                        Bucket: bucket,
                        Body: buffer,
                        Key: key,
                        ContentType: `image/jpeg`
                    };

                    s3.upload(params, (err, pres) => {
                        return callback(err, pres.Location);
                    });
            });
    }
};
