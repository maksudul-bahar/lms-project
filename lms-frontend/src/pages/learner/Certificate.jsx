import { useParams } from "react-router-dom";
import { getCertificate } from "../../api/learnerApi";

export default function Certificate() {
  const { id } = useParams();

  const download = async () => {
    const res = await getCertificate(id);
    const url = window.URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "certificate.pdf";
    a.click();
  };

  return (
    <div>
      <h2>Certificate</h2>
      <button onClick={download}>Download</button>
    </div>
  );
}
