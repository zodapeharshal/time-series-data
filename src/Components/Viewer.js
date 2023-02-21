import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { showDetails } from "../reducers/companySlice";

const Viewer = ({ listOfDocuments }) => {
  console.log("list of DOCS", listOfDocuments);
  var hash = {};
  const dispatch = useDispatch();
  const baseurl = "https://webapp.factstream.ai/web/";
  const reqdoc = useSelector((state) => {
    console.log(state);
    return state.companyDet.value;
  });

  const addIframeToDocList = async (documentId, endpoint) => {
    const allPdfContainer = document.getElementById("all-doc");
    const newIframe = document.createElement("iframe");
    newIframe.width = "100%";
    newIframe.height = "100%";
    newIframe.key = documentId;
    newIframe.src = baseurl + endpoint;
    allPdfContainer.appendChild(newIframe);
  };

  // const fetchData = async (endpoint) => {
  //   await addPdfToList(45240, endpoint);
  // };

  // useEffect(() => {
  //   fetchData("10241/2021/10241_2021Q3_QR_SEC_HTML_NH_NW.html");
  // }, []);

  useEffect(() => {
    console.log("from viewer");
    console.log("reqdoc", reqdoc);
    dispatch(showDetails());
  }, []);

  useEffect(() => {
    if (listOfDocuments.length === 0) {
      const container = document.getElementById("all-doc");
      const newDiv = document.createElement("div");
      const newContent = document.createTextNode("Hi there and greetings!");
      newDiv.appendChild(newContent);
      container.appendChild(newDiv);
    } else if (listOfDocuments[reqdoc.docId].fileFormatName == "HTML") {
      console.log()
      addIframeToDocList(reqdoc.docId, listOfDocuments[reqdoc.docId].cdnPath);
    } else if (listOfDocuments[reqdoc.docId].fileFormatName == "PDF") {
      console.log("File format pdf yet to implement");
    } else {
      console.log("file format other.");
      console.log(
        "file format : ",
        listOfDocuments[reqdoc.docId].fileFormatName
      );
    }
  }, [reqdoc]);

  return (
    <div className="bg-white-200">
      <div> Showing PDF</div>
      <ul className="flex text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        {/* {loadedPDF &&  loadedPDF.map((file) => {
          return (
            <li
              key={file.id}
              className="mr-2"
           
            >
              <a
                href="#"
                // className={
                //   periodYear == file.period ? activeClass : inActiveClass
                // }
              >
                {file.period}
              </a>
            </li>
          );
        })} */}
      </ul>
      <div id="all-doc" className="h-screen"></div>
    </div>
  );
};

export default Viewer;
