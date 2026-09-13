import "./HowItWorks.css";

function HowItWorks() {
  return (
    <section id="how-it-works" className="how-it-works">

      <div className="section-title">
        <h4>HOW IT WORKS</h4>
        <h2>Donate in Just 4 Easy Steps</h2>
        <p>
          Helping others has never been easier. Follow these simple steps to
          donate your unused items and make a difference.
        </p>
      </div>

      <div className="steps">

        <div className="step-card">
          <div className="step-icon">📦</div>
          <h3>Choose Items</h3>
          <p>
            Select clothes, books, food, electronics or any reusable items.
          </p>
        </div>

        <div className="step-card">
          <div className="step-icon">📝</div>
          <h3>Submit Donation</h3>
          <p>
            Fill in the donation form with item details and pickup address.
          </p>
        </div>

        <div className="step-card">
          <div className="step-icon">🚚</div>
          <h3>Pickup Scheduled</h3>
          <p>
            Our verified NGO schedules a pickup at your preferred location.
          </p>
        </div>

        <div className="step-card">
          <div className="step-icon">❤️</div>
          <h3>Help Someone</h3>
          <p>
            Your donation reaches people in need and creates a positive impact.
          </p>
        </div>

      </div>

    </section>
  );
}

export default HowItWorks;