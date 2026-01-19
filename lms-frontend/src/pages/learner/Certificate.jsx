import { useParams } from "react-router-dom";
import { getCertificate } from "../../api/learnerApi";
import { motion } from "framer-motion";

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
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#E0E2DB" }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="p-10 rounded-3xl shadow-2xl text-center"
        style={{ backgroundColor: "#F9FAF8" }}
      >
        <h1 className="text-4xl font-bold mb-4" style={{ color: "#4E6F88" }}>
          🎉 Congratulations!
        </h1>

        <p className="mb-8">
          You have successfully completed this course.
        </p>

        <button
          onClick={download}
          className="px-8 py-4 rounded-full text-white font-semibold"
          style={{ backgroundColor: "#6F8F9B" }}
        >
          Download Certificate
        </button>
      </motion.div>
    </div>
  );
}
