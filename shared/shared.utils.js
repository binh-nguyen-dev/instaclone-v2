const cloudinary = require("cloudinary").v2;
import DatauriParser from "datauri/parser";
import path from "path";

export const uploadPhotos = async (userId, { photos, folderName }) => {
  const processedPhotos = await Promise.all(
    photos.map(async (photo) => {
      const processedPhoto = await processPhoto(userId, {
        photo,
        folderName,
      });

      return processedPhoto;
    })
  );

  const uploadedPhotos = await Promise.all(
    processedPhotos.map(async ({ datauri, public_id }) => {
      const uploadedPhoto = await cloudinary.uploader.upload(datauri, {
        public_id,
      });

      return uploadedPhoto;
    })
  );

  return uploadedPhotos;
};

export const uploadPhoto = async (userId, { photo, folderName }) => {
  const processedPhoto = await processPhoto(userId, {
    photo,
    folderName,
  });

  const { datauri, public_id } = processedPhoto;
  const uploadedPhoto = await cloudinary.uploader.upload(datauri, {
    public_id,
  });

  return uploadedPhoto;
};

async function processPhoto(userId, { photo, folderName }) {
  const { filename, createReadStream } = await photo;

  const newFilename = `${userId}-${Date.now()}-${filename}`;
  const public_id = `${folderName}/${newFilename}`;

  const readStream = createReadStream();
  const buffer = await convertStreamToBuffer(readStream);
  const datauri = convertBufferToDatauri(filename, buffer);

  return { datauri, public_id };
}

async function convertStreamToBuffer(readable) {
  const chunks = [];
  for await (let chunk of readable) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

const parser = new DatauriParser();
function convertBufferToDatauri(filename, buffer) {
  return parser.format(path.extname(filename).toString(), buffer).content;
}

export const deletePhotos = async (resourcesForDelete) => {
  if (resourcesForDelete)
    await cloudinary.api.delete_resources(resourcesForDelete);
};
