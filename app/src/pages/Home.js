import { Link } from "react-router-dom";
const Home = () => {
  return (
    <main
      className="min-h-screen bg-cover bg-top sm:bg-top"
      style={{
        backgroundImage:
          'url("https://i2.wp.com/hipertextual.com/wp-content/uploads/2021/01/The-Mandalorian-portada-scaled.jpeg?fit=1200%2C675&ssl=1")',
      }}
    >
        {/* <div className="flex">
            <p className="justify-center text-5xl font-extrabold text-white">Mando</p>
        </div> */}
        
      <div className="max-w-9xl mx-auto px-4 py-16 text-left sm:px-6 sm:py-24 lg:px-8 lg:py-48">
        <Link to={"/profile"}>
          <button className="mt-4 text-4xl font-extrabold hover:bg-gray-800 bg-gray-900 mt-10 px-3 py-3 text-white tracking-tight sm:text-5xl">
            This is where the fun begins
          </button>
        </Link>

        <div className="">
          <Link to={"/starwars"}>
            <button className="mt-20 text-4xl font-extrabold hover:bg-gray-800 bg-gray-900 mt-10 px-3 py-3 text-white tracking-tight sm:text-5xl">
              Ive got a bad feeling about this
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Home;
