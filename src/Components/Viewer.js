import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as pdfjsLib from "pdfjs-dist";
import PDFJSWorker from "pdfjs-dist/legacy/build/pdf.worker.entry";
pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJSWorker;

const Viewer = ({ listOfDocuments }) => {
  const baseurl = "https://webapp.factstream.ai/web/";
  const reqdoc = useSelector((state) => state.companyDet.value);
  const [loadedPDF, setLoadedPDF] = useState([]);
  // const [activeDoc, setActiveDoc] = useState(0);

  const showOnlyActiveDiv = (docid, type) => {
    console.log("docid", docid);
    const container = document.getElementById("all-doc");
    if (type === "PDF") {
      const children = container.children;
      console.log("div-pdf-" + docid);
      for (var i = 0; i < children.length; i++) {
        children[i].style.display = "none";
      }
      document.getElementById("div-pdf-"+docid).style.display = "inline" ;
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

  // useEffect(() => {
  //   showOnlyActiveDiv(reqdoc.docID, "PDF");
  // }, [reqdoc]);

  const addIframeToDocListViewer = async (documentId, endpoint) => {
    console.log(listOfDocuments[reqdoc.docID].periodName);
    const allPdfContainer = document.getElementById("all-doc");
    const newIframeDiv = document.createElement("div");
    newIframeDiv.id = "div-iframe-" + documentId;
    // allPdfContainer.replaceChildren();
    const newIframe = document.createElement("iframe");
    newIframe.width = "100%";
    newIframe.height = "100%";
    newIframe.key = documentId;
    newIframe.id = "iframe-" + documentId;
    newIframe.src = baseurl + endpoint;
    console.log(baseurl + endpoint);
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
    // console.log("from postmessage",${reqdoc.link.hid});
    console.log("hid", reqdoc.link.hid);
    let message = {
      token: "1aa5c69296eca2b5602b4706aa72d8ab035e0b9f7ed6452bb04d0ec68979d606",
      script: true,
      scriptdata: `
                   a = document.querySelector('[al_hash="${reqdoc.link.hid}"] ') ;
                   console.log(a) ;
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
      console.log("url", baseurl + listOfDocuments[reqdoc.docID].cdnPath);
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
    console.log("rendering page", pageNumber);
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

  const addPdfToDocListViewer = async (documentId, endpoint) => {
    if (loadedPDF.includes(listOfDocuments[reqdoc.docID].periodName) === true) {
      showOnlyActiveDiv(documentId, "PDF");
      return;
    }
    const url = baseurl + endpoint;
    console.log(url);
    await pdfjsLib.getDocument(url).promise.then(async (pdfDoc) => {
      const container = document.getElementById("all-doc");
      const newPdfDiv = document.createElement("div");
      newPdfDiv.id = "div-pdf-" + documentId;
      newPdfDiv.className = "h-[64rem] flex-1 overflow-y-scroll";
      for (let page = 1; page <= pdfDoc.numPages; page++) {
        const canvas = document.createElement("canvas");
        canvas.id = `canvas-${page}`;
        newPdfDiv.appendChild(canvas);
        await renderPage(pdfDoc, page, canvas);
      }
      console.log("tyeing to render wait ");
      container.appendChild(newPdfDiv);
    });
    showOnlyActiveDiv(documentId, "PDF") ;
    addDocToHeaders();
  };

  const handleReqDoc = async () => {
    console.log("listofDoc", listOfDocuments);
    console.log("reqdoc", reqdoc);
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
      if (
        loadedPDF.includes(listOfDocuments[reqdoc.docID].periodName) === false
      ) {
        await addIframeToDocListViewer(
          reqdoc.docID,
          listOfDocuments[reqdoc.docID].cdnPath
        );
      } else {
        showOnlyActiveDiv(reqdoc.docID,"HTML");
      }
      addHighLightInIframe();
    } else if (listOfDocuments[reqdoc.docID].fileFormatName == "PDF") {
      // RENDER PDF
      console.log("File format pdf work ongoing");
      await addPdfToDocListViewer(
        reqdoc.docID,
        listOfDocuments[reqdoc.docID].cdnPath
      );
    } else {
      // SHOW ERROR
      console.log(
        "file format other=>",
        listOfDocuments[reqdoc.docId].fileFormatName
      );
    }
  };

  useEffect(() => {
    handleReqDoc();
  }, [reqdoc]);

  return (
    <div className="bg-white-200 p-1 ml-2 mr-2 border">
      <div className="font-semibold"> Document </div>
      <ul className="flex text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        {loadedPDF.map((file) => {
          return (
            <li
              key={file.id}
              className="mr-2"
              onClick={() => console.log("clicked")}
            >
              <a href="#">{file}</a>
            </li>
          );
        })}
      </ul>
      <div id="all-doc" className="h-screen"></div>
    </div>
  );
};

export default Viewer;
