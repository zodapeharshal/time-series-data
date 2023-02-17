import React, { useEffect, useState, useMemo } from "react";

const PdfViewer = ({ docId }) => {

  var hash = {};

  const baseurl = "https://webapp.factstream.ai/web/";

  
  const addPdfToList = async (documentId, endpoint) =>{
    const allPdfContainer = document.getElementById("all-pdf") ;
    const newIframe = document.createElement("iframe") ;
    console.log(baseurl + endpoint + "#page2") ;
    newIframe.width = "100%" ;
    newIframe.height = "100%" ;
    newIframe.key = documentId ;
    newIframe.src  = baseurl + endpoint ; 
    // console.log(newIframe.contentWindow.document)
    await allPdfContainer.appendChild(newIframe) ;  
    console.log(allPdfContainer.getElementsByTagName('iframe')[0])
    const content = newIframe.contentWindow.document ;
  } 

  const fetchData = async (endpoint) => {
    // fetch(baseurl + endpoint, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // })
    //   .then((response) => response.json())
    //   .then((data) => {

    //   })
    //   .catch((error) => console.log(error));
    await addPdfToList(45240, endpoint) ;
  };
  const loadedPDF = useMemo(() => {
    if (!hash.docId) {
      hash[docId] = "1";
    }
  }, [docId]);
  useEffect(() => {
    console.log("rendered 1 time");
    fetchData("10241/2021/10241_2021Q3_QR_SEC_HTML_NH_NW.html") ;
  }, []);


  return (
    <div className="bg-white-200">
      <div> Showing PDF</div>
      <ul className="flex text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        {loadedPDF &&  loadedPDF.map((file) => {
          return (
            <li
              key={file.id}
              className="mr-2"
              onClick={() => {
                // dispatch(updatePeriod(file.period));
                // loadSpecificFile(file.source.fileURL, 0);
              }}
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
        })}
      </ul>
      <div id="all-pdf" className="h-[64rem] overflow-y-scroll"></div>
      {/* <div id="pdf-viewer" className="h-[64rem] overflow-y-scroll"></div> */}
    </div>
  );
};

export default PdfViewer;
