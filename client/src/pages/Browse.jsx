import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Browse.css";

const Browse = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/donations")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch donations");
        }

        return response.json();
      })
      .then((data) => {
        setDonations(data);
      })
      .catch((error) => {
        console.error("Donation Fetch Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredDonations = donations.filter((item) => {
    const matchesSearch =
      item.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      item.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="browse-page">

      <div className="browse-header">
        <h1>Browse Donations ❤️</h1>

        <p>
          Find items donated by generous people.
        </p>
      </div>

      <div className="filters">

        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          <option value="All">All</option>
          <option value="Clothes">Clothes</option>
          <option value="Books">Books</option>
          <option value="Electronics">
            Electronics
          </option>
          <option value="Furniture">
            Furniture
          </option>
          <option value="Toys">Toys</option>
          <option value="Others">Others</option>
        </select>

      </div>

      {loading ? (

        <h2 className="empty">
          Loading donations...
        </h2>

      ) : (

        <div className="donation-grid">

          {filteredDonations.length === 0 ? (

            <h2 className="empty">
              No Donations Found 😔
            </h2>

          ) : (

            filteredDonations.map((item) => (

              <div
                className="card"
                key={item.id}
              >

                <img
                  src={item.image}
                  alt={item.title}
                />

                <div className="card-body">

                  <h2>{item.title}</h2>

                  <p>
                    <strong>Category:</strong>{" "}
                    {item.category}
                  </p>

                  <p>
                    <strong>Condition:</strong>{" "}
                    {item.itemCondition}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {item.location}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {item.status}
                  </p>

                  <button
                    onClick={() =>
                      navigate(
                        `/donation/${item.id}`
                      )
                    }
                  >
                    View Details
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      )}

    </div>
  );
};

export default Browse;