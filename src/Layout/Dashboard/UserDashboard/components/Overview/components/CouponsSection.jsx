import { Badge } from "@/components/ui/badge";

const CouponsSection = ({ coupons }) => {
  return (
    <section className="bg-card text-card-foreground rounded-xl p-6 shadow-sm h-full">
      <h2 className="text-xl font-semibold mb-4">Available Coupons</h2>
      <div className="flex flex-wrap gap-2">
        {coupons.map((code) => (
          <Badge key={code} variant="default">
            {code}
          </Badge>
        ))}
      </div>
    </section>
  );
};

export default CouponsSection;
