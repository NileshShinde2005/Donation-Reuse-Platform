import "./Categories.css";

function Categories() {
  return (
    <section id="categories" className="categories">

      <div className="section-title">
        <h4>DONATION CATEGORIES</h4>
        <h2>What Can You Donate?</h2>
        <p>
          Every donation makes a difference. Donate items that are no longer
          useful to you and help someone build a better tomorrow.
        </p>
      </div>

      <div className="category-grid">

        <div className="category-card">
          <div className="category-icon">👕</div>
          <h3>Clothes</h3>
          <p>Donate wearable clothes for children and adults.</p>
        </div>

        <div className="category-card">
          <div className="category-icon">📚</div>
          <h3>Books</h3>
          <p>Educational books, novels and study materials.</p>
        </div>

        <div className="category-card">
          <div className="category-icon">🧸</div>
          <h3>Toys</h3>
          <p>Share toys that can bring smiles to children.</p>
        </div>

        <div className="category-card">
          <div className="category-icon">🍱</div>
          <h3>Food</h3>
          <p>Donate packaged and non-perishable food items.</p>
        </div>

        <div className="category-card">
          <div className="category-icon">💻</div>
          <h3>Electronics</h3>
          <p>Working laptops, mobiles and electronic devices.</p>
        </div>

        <div className="category-card">
          <div className="category-icon">🪑</div>
          <h3>Furniture</h3>
          <p>Tables, chairs, beds and household essentials.</p>
        </div>

      </div>

    </section>
  );
}

export default Categories;