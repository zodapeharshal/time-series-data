import { Headers } from "../Constants/Headers";
import React, { useState, useffect, useEffect } from "react";
import { HeaderKeys } from "../Constants/HeaderKeys";
import CompanyDetails from "./CompanyDetails";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Route, Routes, Link } from "react-router-dom";
import Table from "./Table";

const CompanyList = ({ pageNum, setTotalPagesCallback }) => {
  const [data, setData] = useState(null);
  const grayBack = "border-b bg-gray-100 dark:bg-gray-800 dark:border-gray-700";
  const whiteBack = "bg-white border-b dark:bg-gray-900 dark:border-gray-700";

  const fetchData = () => {
    fetch(
      `https://dal.alphastream.ai/api/v1.0/AlphaStream/Ui/FindCompany?page=${pageNum}&companyName=&SortByCol=&SortDir=&product=Fundamentals`
    )
      .then((response) => response.json())
      .then((data) => setData(data.data))
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    fetch(
      `https://dal.alphastream.ai/api/v1.0/AlphaStream/Ui/FindCompany?page=1&companyName=&SortByCol=&SortDir=&product=Fundamentals`
    )
      .then((response) => response.json())
      .then((data) => setTotalPagesCallback(data.totalpages))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetchData();
  }, [pageNum]);


  return (
    <>
      <tbody>
        {data &&
          data.map((cmpdetail, idx) => {
            //   console.log(cmpdetail);
            return (
              <tr
                key={cmpdetail.companyid}
                className={idx % 2 === 0 ? whiteBack : grayBack}
              >
                {data &&
                  HeaderKeys.map((hkey) => {
                    return hkey === "companyname" ? (
                      <td className="text-base" key={cmpdetail.companyid + hkey}>
                        <Link
                          to={{ pathname: "/CompanyDetails" }}
                          target="_blank"
                        >
                          {cmpdetail[hkey]}
                        </Link>
                      </td>
                    ) : (
                      <td
                        key={cmpdetail.companyid + hkey}
                        className="text-base "
                      >
                        {cmpdetail[hkey]}
                      </td>
                    );
                  })}
                  <td className="flex justify-center"><MoreVertIcon/></td>
              </tr>
            );
          })}
      </tbody>
    </>
  );
};
export default CompanyList;
