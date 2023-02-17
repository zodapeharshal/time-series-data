import React, { useEffect, useState } from "react";
import CompanyDetailsTable from "./CompanyDetailsTable";
import PdfViewer from "./PdfViewer";
const CompanyDetails = () => {
  const [sections, setSections] = useState(null);
  // const [activeSec, setActiveSec] = useState(1) ;
  const [tableId, setTableId] = useState("1");
  const payload = {
    inputdata: {
      companyId: "10241",
      documentId: 0,
      sectionName: "TS",
      IsClient: false,
    },
    requestToken: 1676446484,
  };
  const fetchData = () => {
    fetch(`https://dal.alphastream.ai/api/v1.0/AlphaStream/Ui/GetSections`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("sections",data.data.sections);
        setSections(data.data.sections);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    fetchData();
    // headers && console.log(headers) ;
  }, []);
  var activeClass =
    "inline-block p-1 text-blue-600  text-lg bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500";
  var inActiveClass =
    "inline-block p-1 rounded-t-lg text-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300";
  const [isActive, setIsActive] = useState(0);
  return (
    <div>
      <div className="font-medium leading-tight text-4xl mt-0 mb-2 text-cyan-600 underline">
        Time-Series-Data
      </div>
      <div className="m-2">
        <ul className="flex   text-xs font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
          {/* {headers &&  Object.entries(headers).map(([key, value]) => {console.log(`${key}: ${value}`); })}  */}
          {sections &&
            sections.map((sec, idx) => {
              return (
                <li
                  onClick={() => {
                    setTableId(sec.tag);
                  }}
                  className="mr-3 text-5xl"
                  key={sec.tag}
                >
                  <a
                    href="#"
                    className={
                      tableId === sec.tag ? activeClass : inActiveClass
                    }
                  >
                    {sec.title}
                  </a>
                </li>
              );
            })}
        </ul>
      </div>
      <div className="flex">
        <div className="overflow-x-scroll">
        <CompanyDetailsTable reqTableId={tableId}></CompanyDetailsTable>

        </div>
        <div className="w-[50%]">
          <PdfViewer docId={45240}></PdfViewer>
        </div>
      </div>
    </div>
  );
};
export default CompanyDetails;
