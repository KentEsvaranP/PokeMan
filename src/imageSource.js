import React, { useState, useEffect } from "react";

const ImageSource = ({ imgApi, imageName }) => {
  const [imageSrc, setImageSrc] = useState("");
  const restApi = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data ? data?.sprites?.other["official-artwork"]?.front_default : "";
  };
  useEffect(() => {
    restApi(imgApi).then(async (result) => {
      setImageSrc(result);
    });
  }, [imgApi]);
  return <img src={imageSrc} alt={imageName} />;
};
export default ImageSource;
