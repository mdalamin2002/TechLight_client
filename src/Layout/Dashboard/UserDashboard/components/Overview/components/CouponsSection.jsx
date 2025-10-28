import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Skeleton } from "@/Components/ui/skeleton";
import { Tag, Copy, CheckCircle2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const CouponsSection = ({ coupons, loading }) => {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success(`Coupon code "${code}" copied!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Available Coupons</h2>
        </div>
        {coupons && coupons.length > 3 && (
          <Badge variant="secondary">{coupons.length}</Badge>
        )}
      </div>

      <div className="space-y-3 flex-1">
        {coupons && coupons.length > 0 ? (
          coupons.slice(0, 5).map((coupon) => (
            <div
              key={coupon.id}
              className="p-4 border border-border rounded-lg bg-gradient-to-r from-primary/5 to-transparent hover:border-primary/50 transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="font-mono font-bold text-sm text-primary bg-primary/10 px-2 py-1 rounded">
                      {coupon.code}
                    </code>
                    <Badge variant="outline" className="text-xs">
                      {coupon.type === 'percentage' ? `${coupon.discount}% OFF` : `$${coupon.discount} OFF`}
                    </Badge>
                  </div>
                  {coupon.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {coupon.description}
                    </p>
                  )}
                  {coupon.expiryDate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="shrink-0"
                  onClick={() => handleCopy(coupon.code, coupon.id)}
                >
                  {copiedId === coupon.id ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Tag className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-2">No coupons available</p>
            <p className="text-xs text-muted-foreground">Check back later for exclusive offers</p>
          </div>
        )}
      </div>

      {coupons && coupons.length > 5 && (
        <div className="mt-4 pt-4 border-t">
          <Link to="/allProduct">
            <Button variant="outline" size="sm" className="w-full gap-2">
              View All Coupons
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
};

export default CouponsSection;
