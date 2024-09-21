import React, { useState } from "react";
import { FaFileWord } from "react-icons/fa6";
import axios from "axios";

function Home() {
  const [selectFile, setSelectFile] = useState(null);
  const [convert, setConvert] = useState("")
  const [downloadErr, setDownloadErr] = useState("")

  const handleFileChange = (e) => {
    // console.log(e.target.files[0]);
    // console.log(e.target.files[0].name);
    setSelectFile(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectFile) {
      console.log("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectFile);

    try {
      const response = await axios.post(
        "http://localhost:3000/convertFile",
        formData,
        { responseType: "blob" }
      );

      console.log(response.data);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      console.log(url);
      const a = document.createElement("a");
      console.log(a);
      a.href = url;
      console.log(a);
      a.setAttribute(
        "download",
        selectFile.name.replace(/\.[^/.]+$/, "") + ".pdf"
      );
      document.body.appendChild(a)
      a.click();
      a.parentNode.removeChild(a);

      setSelectFile(null);
      setDownloadErr("")
      setConvert("File Converted Successfully")

    } catch (error) {
      console.log(error);
      if(error.response && error.response.status === 400){
        setDownloadErr("Error occured",error.response.data.message)
      }else{
        setConvert("")
      }
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto container px-6 py-3 md:px-40">
      <div className="flex justify-center items-center h-screen">
        <div className="border-2 border-dashed px-4 py-2 md:px-8 md:py-6 border-indigo-400 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-4">
            Convert word to PDF
          </h1>
          <p className="text-sm text-center mb-5">
            {" "}
            Easily convert Word documents to PDF format online, without having
            to install any software.
          </p>
          <div className="flex flex-col items-center space-y-4">
            <input
              type="file"
              id="fileInpul"
              className="hidden"
              accept=".doc, .docx"
              onChange={handleFileChange}
            />
            <label
              htmlFor="fileInpul"
              className="w-full flex items-center justify-center px-4 py-6 bg-gray-100 text-gray-700 rounded-lg shadow-lg cursor-pointer border-blue-300 hover:bg-blue-700 duration-300 hover:text-white"
            >
              <FaFileWord className="text-3xl mr-3" />
              <span className="text-2xl mr-2">
                {selectFile ? selectFile.name : "Choose file"}
              </span>
            </label>
            <button
              disabled={!selectFile}
              className="text-white bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 disabled:pointer-events-none duration-300 font-bold px-4 py-2 rounded-lg"
              onClick={handleSubmit}
            >
              Convert
            </button>
            {convert && (
              <div className="text-green-500 text-center">{convert}</div>
            )}
            {downloadErr && (
              <div className="text-red-500 text-center">{downloadErr}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
