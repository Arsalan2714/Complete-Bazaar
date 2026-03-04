export const fileFilter = (req, file, cb) => {
  const isValidFile = ["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype);
  if(isValidFile){
    cb(null, true);
  }else{
    cb(new Error("Invalid file type"), false);
  }
}