export const uploadFile = (file, cloudinaryUrl, cloudinaryPreset) => {
  const obj = {};
  const url = cloudinaryUrl;
  const xhr = new XMLHttpRequest();
  const fd = new FormData();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.onreadystatechange = (e) => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      const response = JSON.parse(xhr.responseText);
      obj.url = response.secure_url;
      obj.size = response.bytes;
      obj.filename = response.original_filename;
    }
  };
  fd.append("upload_preset", cloudinaryPreset);
  fd.append("tags", "browser_upload");
  fd.append("file", file);
  xhr.send(fd);
  return obj;
};
