import Card from "../../components/homepage/Card";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold text-white">Featured Laptops</h1>
      </div>
      <div className="flex my-5">
        <Link to="/laptopdetail" className="flex-1">
          <Card />
        </Link>
        <Link to="/laptopdetail" className="flex-1">
          <Card />
        </Link>
        <Link to="/laptopdetail" className="flex-1">
          <Card />
        </Link>
        <Link to="/laptopdetail" className="flex-1">
          <Card />
        </Link>
      </div>
      <div className="flex justify-center my-10">
        <button
          className="rounded-full bg-white py-2 px-4 text-center text-sm text-black transition-all shadow-md hover:shadow-lg hover:text-white hover:bg-red-600 focus:bg-red-600 focus:shadow-none active:bg-red-700 disabled:pointer-events-none disabled:opacity-50"
          type="button"
        >
          Explore laptop sales page
        </button>
      </div>
      <div>
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Laptop for borrow
          </h1>
        </div>
        <div className="flex my-5">
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
        <div className="flex justify-center my-10">
          <button
            className="rounded-full bg-white py-2 px-4 text-center text-sm text-black transition-all shadow-md hover:shadow-lg hover:text-white hover:bg-red-600 focus:bg-red-600 focus:shadow-none active:bg-red-700 disabled:pointer-events-none disabled:opacity-50"
            type="button"
          >
            Explore borrow laptop page
          </button>
        </div>
      </div>
    </div>
  );
}
