import { Card } from "@/Components/ui/card";


const StatCard = ({ title, value, icon }) => (
  <Card className="p-4 flex bg-card text-card-foreground ">
    <div className="">{icon}</div>
    <div>
    <h2 className="text-xl font-bold">{value}</h2>
    <p>{title}</p>
    </div>
  </Card>
);

export default StatCard;
