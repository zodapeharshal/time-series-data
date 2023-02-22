import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateCmpDetails, showDetails } from "../reducers/companySlice";
const CompanyDetailsTable = ({ lineItems, headers }) => {
  // const [lineItems, setLineItems] = useState(null);
  // const [headers, setHeaders] = useState(null);
  const dispatch = useDispatch();
  // const payload = {
  //   inputdata: {
  //     companyId: cmpid,
  //     documentId: "0",
  //     tableId: parseInt(reqTableId),
  //     IsClient: false,
  //     clientId: "0",
  //     userId: "aneesh.n@almug.ai",
  //   },
  //   requestToken: 1676446484,
  // };
  // const fetchData = () => {
  //   fetch(
  //     `https://dal.alphastream.ai/api/v1.0/AlphaStream/Ui/GetTimeSeriesData`,
  //     {
  //       method: "POST",
  //       body: JSON.stringify(payload),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // console.log("Headers", data.data.periods);
  //       setLineItems(data.data.lineItmes);
  //       setHeaders(data.data.periods);
  //     })
  //     .catch((error) => console.log(error));
  // };
  // useEffect(() => {
  //   fetchData();
  //   // console.log("reqTableId", reqTableId)
  // }, [reqTableId]);

  return (
    <div>
      <table className="w-full text-2xl text-left text-gray-500 dark:text-gray-400">
        <thead className="text-base shadow-md  text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="border border-gray-400">Name</th>
            {headers &&
              headers.map((head, idx) => {
                return (
                  <th className="border border-gray-400 p-1" key={`th-${idx}`}>
                    {head.period}
                  </th>
                );
              })}
          </tr>
        </thead>
        <tbody >
          {headers &&
            lineItems &&
            lineItems.map((line) => {
              return (
                <tr className="text-sm">
                  <td className="w-1/5 border pl-2 font-semibold bg-cyan-100">
                    {line.name}
                  </td>
                  {headers.map((head) => {
                    if (parseInt(head.cId) === parseInt(-1)) {
                      // console.log("block") ;
                      return (
                        <td className="border pl-2 ">{line["blockName"]}</td>
                      );
                    } else if (parseInt(head.cId) === parseInt(0)) {
                      return <td className="border pl-2 ">{line["tag"]}</td>;
                    } else {
                      // console.log("headCID",head.cId) ;
                      return (
                        <td
                          onClick={() => {
                            dispatch(
                              updateCmpDetails({
                                docID: line["facts"][head.cId]["documentId"],
                                link: line["facts"][head.cId]["a"],
                              })
                            );
                          }}
                          className="border pl-2"
                        >
                          {line["facts"][head.cId]["v"]}
                        </td>
                      );
                    }
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
export default CompanyDetailsTable;
