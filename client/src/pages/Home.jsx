import Hero from "../components/Hero";
import About from "../components/About";
import HowItWorks from "../components/HowItWorks";
import Categories from "../components/Categories";
import FeaturedNGOs from "../components/FeaturedNGOs";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Hero />
      <About />
      <HowItWorks />
      <Categories />
      <FeaturedNGOs />
      <Footer />
    </>
  );
}

export default Home;