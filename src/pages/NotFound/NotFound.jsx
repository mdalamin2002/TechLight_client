import { Link } from "react-router-dom";
import { Button } from "@/Components/ui/button";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div className="space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight">
          4<span className="text-primary">0</span>4
        </h1>
        <p className="text-xl text-muted-foreground max-w-xl">
          Oops! The page you are looking for doesn’t exist or has been moved.
        </p>
        <div className="flex items-center gap-3 justify-center pt-2">
          <Button asChild>
            <Link to="/">
              <Home className="w-4 h-4 mr-2" /> Back to Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/allProduct">
              <Search className="w-4 h-4 mr-2" /> Browse Products
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

 