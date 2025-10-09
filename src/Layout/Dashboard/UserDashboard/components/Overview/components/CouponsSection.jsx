import { Badge } from "@/components/ui/badge";

const CouponsSection = ({ coupons }) => {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Available Coupons</h2>
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
