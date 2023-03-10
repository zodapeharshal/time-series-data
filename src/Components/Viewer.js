import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showLoading } from "../reducers/companySlice";
import { updateCdnPath } from "../reducers/companySlice";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import { Link } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist";
import PDFJSWorker from "pdfjs-dist/legacy/build/pdf.worker.entry";
pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJSWorker;

const Viewer = ({ listOfDocuments, cmpid }) => {
  const baseurl = "https://webapp.factstream.ai/web/";
  const reqdoc = useSelector((state) => state.companyDet.value);
  const [loadedPDF, setLoadedPDF] = useState([]);
  const isLoading = useSelector((state) => state.companyDet.isLoading);
  const dispatch = useDispatch();
  const [activeHeader, setActiveHeader] = useState(0);
  var activeClass =
    "flex inline-block p-1 text-blue-500 mx-1 text-lg bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500";
  var inActiveClass =
    "flex inline-block p-1 rounded-t-lg mx-1 text-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300";

  const showActiveHeaderDoc = () => {
    Object.entries(listOfDocuments).map(([key, value]) => {
      if (value.periodName === activeHeader) {
        showOnlyActiveDiv(value.documentId, value.fileFormatName);
      }
    });
  };

  useEffect(() => {
    showActiveHeaderDoc();
  }, [activeHeader]);

  const showOnlyActiveDiv = (docid, type) => {
    const container = document.getElementById("all-doc");
    if (type === "PDF") {
      const children = container.children;
      for (var i = 0; i < children.length; i++) {
        children[i].style.display = "none";
      }
      document.getElementById("div-pdf-" + docid).style.display = "inline";
    } else if (type === "HTML") {
      const children = container.children;
      for (var i = 0; i < children.length; i++) {
        if (String(children[i].id) !== String("div-iframe-" + docid))
          children[i].style.display = "none";
        else children[i].style.display = "inline";
      }
    } else {
      const children = container.children;
      for (var i = 0; i < children.length; i++) {
        if (children[i].id !== "greet") children[i].style.display = "none";
        else children[i].style.display = "inline";
      }
    }
  };

  const addIframeToDocListViewer = async (documentId, endpoint) => {
    const allPdfContainer = document.getElementById("all-doc");
    const newIframeDiv = document.createElement("div");
    newIframeDiv.id = "div-iframe-" + documentId;
    newIframeDiv.className = "h-[64rem] ";
    const newIframe = document.createElement("iframe");
    newIframe.width = "100%";
    newIframe.height = "100%";
    newIframe.key = documentId;
    newIframe.id = "iframe-" + documentId;
    newIframe.src = baseurl + endpoint;

    newIframeDiv.appendChild(newIframe);
    allPdfContainer.appendChild(newIframeDiv);
  };

  const addDocToHeaders = () => {
    if (
      loadedPDF.includes(listOfDocuments[reqdoc.docID].periodName) === false
    ) {
      setLoadedPDF((loadedPDF) => [
        ...loadedPDF,
        listOfDocuments[reqdoc.docID].periodName,
      ]);
    }
  };

  const addHighLightInIframe = () => {
    let message = {
      token: "1aa5c69296eca2b5602b4706aa72d8ab035e0b9f7ed6452bb04d0ec68979d606",
      script: true,
      scriptdata: `
                   a = document.querySelector('[al_hash="${reqdoc.link.hid}"] ') ;
                   a.style.backgroundColor = "yellow";
                   a.scrollIntoView({block: "nearest",});
                  `,
    };
    if (loadedPDF.includes(listOfDocuments[reqdoc.docID].periodName)) {
      const selectedIframe = document.getElementById("iframe-" + reqdoc.docID);
      selectedIframe.contentWindow.postMessage(
        message,
        baseurl + listOfDocuments[reqdoc.docID].cdnPath
      );
    } else {
      const selectedIframe = document.getElementById("iframe-" + reqdoc.docID);

      selectedIframe.onload = () => {
        selectedIframe.contentWindow.postMessage(
          message,
          baseurl + listOfDocuments[reqdoc.docID].cdnPath
        );
        console.log("posted message");
      };
    }
  };

  const renderPage = async (pdfDoc, pageNumber, canvas) => {
    return await pdfDoc.getPage(pageNumber).then(async (page) => {
      const viewport = page.getViewport({ scale: 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const context = canvas.getContext("2d");
      context.willReadFrequently = true;
      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;
      return canvas;
    });
  };
  const addHighLightInPdf = (documentId) => {
    const activeCanvas = document.getElementById(
      `${documentId}-canvas-${reqdoc.link.pagenumber}`
    );

    const cord = reqdoc.link.BB;
    const context = activeCanvas.getContext("2d");
    context.fillStyle = "rgba(0,255,0,0.5)";
    const scale = 1.5;
    context.globalAlpha = 0.9;

    var x0 = Number(cord[0]) || 0;
    var x1 = Number(cord[1]) || 0;
    var x2 = Number(cord[2]) || 0;
    var x3 = Number(cord[3]) || 0;
    console.log("Coordinates", x0, x1, x2, x3);
    context.fillRect(
      x0 * scale,
      x1 * scale,
      (x2 - x0) * scale,
      (x3 - x1) * scale
    );

    activeCanvas.scrollIntoView();
  };
  const addPdfToDocListViewer = async (documentId, endpoint) => {
    if (loadedPDF.includes(listOfDocuments[reqdoc.docID].periodName) === true) {
      showOnlyActiveDiv(documentId, "PDF");
      addHighLightInPdf(documentId);
      return;
    }
    const url = baseurl + endpoint;

    await pdfjsLib.getDocument(url).promise.then(async (pdfDoc) => {
      const container = document.getElementById("all-doc");
      const newPdfDiv = document.createElement("div");
      newPdfDiv.id = "div-pdf-" + documentId;
      newPdfDiv.className = "h-[64rem] overflow-y-scroll";
      for (let page = 1; page <= pdfDoc.numPages; page++) {
        const canvas = document.createElement("canvas");
        canvas.id = `${documentId}-canvas-${page}`;
        newPdfDiv.appendChild(canvas);
        await renderPage(pdfDoc, page, canvas);
      }
      console.log("tyeing to render wait ");
      container.appendChild(newPdfDiv);
    });
    showOnlyActiveDiv(documentId, "PDF");
    addDocToHeaders();
    addHighLightInPdf(documentId);
  };

  const handleReqDoc = async () => {
    if (listOfDocuments.length == 0) {
      // EMPTY LIST OF DOCUMENTS
      const container = document.getElementById("all-doc");
      const newDiv = document.createElement("div");
      const newContent = document.createTextNode("Hi there and greetings!");
      newDiv.id = "greet";
      newDiv.appendChild(newContent);
      container.appendChild(newDiv);
    } else if (
      // RENDER HTML
      listOfDocuments[parseInt(reqdoc.docID)].fileFormatName == "HTML"
    ) {
      addDocToHeaders();
      setActiveHeader(listOfDocuments[reqdoc.docID].periodName);
      if (
        loadedPDF.includes(listOfDocuments[reqdoc.docID].periodName) === false
      ) {
        await addIframeToDocListViewer(
          reqdoc.docID,
          listOfDocuments[reqdoc.docID].cdnPath
        );
      }
      showOnlyActiveDiv(reqdoc.docID, "HTML");
      addHighLightInIframe();
    } else if (listOfDocuments[reqdoc.docID].fileFormatName == "PDF") {
      // RENDER PDF
      console.log("File format pdf work ongoing");

      await addPdfToDocListViewer(
        reqdoc.docID,
        listOfDocuments[reqdoc.docID].cdnPath
      );
      setActiveHeader(listOfDocuments[reqdoc.docID].periodName);
    } else {
      // SHOW ERROR
      console.log(
        "file format other=>",
        listOfDocuments[reqdoc.docId].fileFormatName
      );
    }
  };

  useEffect(() => {
    handleReqDoc().then(() => {
      dispatch(showLoading(false));
      dispatch(updateCdnPath(listOfDocuments[reqdoc.docID].cdnPath))
    });
  }, [reqdoc]);

  return (
    <div className={`bg-white-200 p-1 ml-2 mr-2 border`} id="viewer">
      <div className="font-semibold flex mb-2">
        <p className="ml-[15rem] underline">Document</p>
        {/* <button
          className="bg-blue-500 text-sm hover:bg-blue-700 text-white font-bold px-2 rounded-full ml-[14rem]"
          onClick={() => {}}
        >
          Close
        </button> */}
      </div>
      <ul className="flex text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        {loadedPDF.map((file) => {
          return (
            <div
              className={file === activeHeader ? activeClass : inActiveClass}
            >
              <li
                key={file}
                // className={file === activeHeader ? activeClass : inActiveClass}
                onClick={() => {
                  console.log("clicked");
                
                  setActiveHeader(file);
                  showActiveHeaderDoc();
            
                }}
              >
                <a href="#">{file}</a>
              </li>
              <Link
                to={`/Document/${listOfDocuments[reqdoc.docID].documentId}`}
                target="_blank"
              >
                 <ArrowCircleUpIcon />
              </Link>
              {/* <button
                onClick={() => {
                  console.log("he touched me!!!");
                }}
              >
               
              </button> */}
            </div>
          );
        })}
      </ul>
      {isLoading ? (
        <button
          disabled
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
        >
          <svg
            aria-hidden="true"
            role="status"
            className="inline w-4 h-4 mr-3 text-white animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#E5E7EB"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            />
          </svg>
          Loading...
        </button>
      ) : (
        ""
      )}
      <div id="all-doc" className="h-[50rem] w-full overflow-auto"></div>
    </div>
  );
};

export default Viewer;
