import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CompanyDetailsTable from "./CompanyDetailsTable";
import Viewer from "./Viewer";


const CompanyDetails = () => {
  const [sections, setSections] = useState(null);
  const { cmpid } = useParams();
  const [tableId, setTableId] = useState("1");
  const [lineItems, setLineItems] = useState(null);
  const [headers, setHeaders] = useState(null);
  const [listOfDocuments, setListOfDocuments] = useState([]) ;
  const tablePayload = {
    inputdata: {
      // companyId: cmpid,
      companyId: 12334,
      documentId: "0",
      tableId: parseInt(tableId),
      IsClient: false,
      clientId: "0",
      userId: "aneesh.n@almug.ai",
    },
    requestToken: 1676446484,
  };
  const sectionPayload = {
    inputdata: {
      companyId: cmpid,
      documentId: 0,
      sectionName: "TS",
      IsClient: false,
    },
    requestToken: 1676446484,
  };
  const fetchSections = () => {
    fetch(`https://dal.alphastream.ai/api/v1.0/AlphaStream/Ui/GetSections`, {
      method: "POST",
      body: JSON.stringify(sectionPayload),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSections(data.data.sections);
      })
      .catch((error) => console.log(error));
  };
  const fetchTimeSeriesData = () => {
    fetch(
      `https://dal.alphastream.ai/api/v1.0/AlphaStream/Ui/GetTimeSeriesData`,
      {
        method: "POST",
        body: JSON.stringify(tablePayload),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log("Headers", data.data.periods);
        setLineItems(data.data.lineItmes);
        setHeaders(data.data.periods);
        var docHash = {} ; 
        data.data.listOfDocuments.map((doc)=>{
          docHash[parseInt(doc.documentId)] = doc ;
        })
        setListOfDocuments(docHash) ;
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    fetchSections();
    fetchTimeSeriesData();
  }, []);
  useEffect(()=>{fetchTimeSeriesData();},[tableId])
  var activeClass =
    "inline-block p-1 text-blue-500  text-lg bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500";
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
          <CompanyDetailsTable
          lineItems={lineItems}
          headers={headers}
          ></CompanyDetailsTable>
        </div>
        <div className="w-[35%]">
          <Viewer listOfDocuments={listOfDocuments}></Viewer>
        </div>
      </div>
    </div>
  );
};
export default CompanyDetails;
