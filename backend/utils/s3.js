const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
require('dotenv').config();

const s3Client = new S3Client({
  region: 'us-east-1',
  endpoint: `http://${process.env.MINIO_ENDPOINT || 'minio:9000'}`,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || 'erp_admin',
    secretAccessKey: process.env.MINIO_SECRET_KEY || 'erp_strong_password',
  },
});

const uploadToMinio = async (file, bucketName = 'erp-files') => {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: bucketName,
      Key: `${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    },
  });

  const result = await upload.done();
  return result.Location || `http://localhost:9000/${bucketName}/${result.Key}`;
};

module.exports = { s3Client, uploadToMinio };
