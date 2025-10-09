import React from "react";

const ReturnsRefunds = () => {
  return (
    <section className="">
      <div className="bg-card shadow-md rounded-lg p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Returns & Refunds</h1>
        <p className="text-muted-foreground mb-6">
          We want you to be completely satisfied with your purchase. If you're not happy, we're here to help.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Return Policy</h3>
            <p>
              Items can be returned within <strong>30 days</strong> of delivery. The items must be in original condition
              and packaging. Return shipping costs may apply.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Refunds</h3>
            <p>
              Once we receive your returned item, we will inspect it and notify you on the status of your refund. If
              approved, the refund will be processed to your original payment method within 7 business days.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Exceptions</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Digital products cannot be refunded after download.</li>
              <li>Clearance or final sale items are non-returnable.</li>
            </ul>
          </div>

          <div className="bg-muted p-4 rounded-md border border-border mt-8">
            <p className="text-sm">
                For return requests, please contact our support team at{" "}
              <a
                href="mailto:support@example.com"
                className="text-primary underline hover:text-primary-foreground"
              >
                support@example.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReturnsRefunds;
