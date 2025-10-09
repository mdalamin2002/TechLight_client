import { Card } from "@/components/ui/card";

const StatCard = ({ title, value, icon, className }) => (
  <Card className={`p-4 flex flex-col items-start gap-2 ${className}`}>
    <div className="text-primary text-3xl">{icon}</div>
    <h2 className="text-xl font-bold leading-tight">{value}</h2>
    <p className="text-sm text-muted-foreground">{title}</p>
  </Card>
);

export default StatCard;
