import { useState } from "react";
import { toast } from "react-toastify";

const usePinataUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadToPinata = async (file) => {
    if (!file) {
      toast.error("No file selected for upload");
      return null;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "pinataMetadata",
        JSON.stringify({ name: file.name || "Uploaded File" })
      );
      formData.append("pinataOptions", JSON.stringify({ cidVersion: 0 }));

      const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload to Pinata");
      }

      const resData = await res.json();
      toast.success("Upload Successful", { position: "top-center" });

      return {
        ipfsUrl: `ipfs://${resData.IpfsHash}`,
        hash: resData.IpfsHash,
        response: resData,
      };
    } catch (error) {
      console.error("Pinata Upload Error:", error);
      toast.error(`Upload failed: ${error.message}`, { position: "top-center" });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadToPinata, isUploading };
};

export default usePinataUpload;
