import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>FinSight</h1>
      <p>Select user type</p>

      <button onClick={() => navigate("/upload/individual")}>
        Individual
      </button>

      <button onClick={() => navigate("/upload/sme")}>
        SME
      </button>
    </div>
  );
}

export default Home;
