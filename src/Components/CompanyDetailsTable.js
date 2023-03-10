import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateCmpDetails, showLoading } from "../reducers/companySlice";
const CompanyDetailsTable = ({ lineItems, headers }) => {

  const dispatch = useDispatch();

  return (
    <div  >
      <table className=" text-2xl text-left text-gray-500 dark:text-gray-400">
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
        <tbody>
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
                            if (line["facts"][head.cId]["a"]) {
                              dispatch(
                                updateCmpDetails({
                                  docID: line["facts"][head.cId]["documentId"],
                                  link: line["facts"][head.cId]["a"],
                                })
                              );
                              dispatch(showLoading(true));
                            }
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
