
import { useSelector } from "react-redux";

const DocTab = () => {
    const hid = useSelector((state)=> state.companyDet.value.link.hid)
    const addHighLightInIframe = () => {
        let message = {
          token: "1aa5c69296eca2b5602b4706aa72d8ab035e0b9f7ed6452bb04d0ec68979d606",
          script: true,
          scriptdata: `
                       a = document.querySelector('[al_hash="${hid}"] ') ;
                       a.style.backgroundColor = "yellow";
                       a.scrollIntoView({block: "nearest",});
                      `,
        };
        document.getElementById("dociframe").contentWindow.postMessage(message, baseurl+cdnPath) ;
      };

    const cdnPath = useSelector((state)=> state.companyDet.cdnPath);
    const baseurl = "https://webapp.factstream.ai/web/";   
    console.log(cdnPath) ;
    return (
        <div>
            <span className="bg-yellow-500">*** THIS FEATURES ONLY SUPPORTS HTML DOCS AS OF NOW ***</span>
            <iframe src={`${baseurl+cdnPath}`} className="w-full h-[60rem]" id="dociframe" onLoad={()=>addHighLightInIframe()} />
        </div>
    ) ;
};
export default DocTab ;