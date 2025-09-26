import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const faqs = [
  {
    question: "What is TechLight?",
    answer:
      "TechLight is an AI-powered electronics e-commerce platform offering devices like PCs, laptops, and gadgets. Our AI pricing engine ensures the best real-time deals by adjusting prices based on market trends.",
  },
  {
    question: "What kind of products do you sell?",
    answer:
      "We sell laptops, desktops, smartphones, accessories, smartwatches, audio devices, gaming consoles, and various computer peripherals.",
  },
  {
    question: "Can I track my order?",
    answer:
      "Yes. You can track your order through the 'Tracking' section in your dashboard. Statuses like Placed, Confirmed, Shipped, and Delivered will be available.",
  },
  {
    question: "Do you offer warranty and after-sales service?",
    answer:
      "Yes, we provide official brand warranty for all products and are committed to offering high-quality support, similar to providers like Star Tech and TechLand BD.",
  },
  {
    question: "Do you have physical stores?",
    answer:
      "Currently, TechLight is an online-only platform. Any physical store plans will be announced via our website or social media.",
  },
  {
    question: "How can I make a payment?",
    answer:
      "We plan to support multiple gateways, including credit cards and PayPal, based on demo integration in our admin panel.",
  },
];

const FAQ = () => {
  return (
    <Box
      sx={{
        background: "var(--color-primary)",
        borderRadius: 4,
        padding: 4,
        boxShadow: 3,
      }}
    >
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <HelpOutlineIcon
          fontSize="large"
          sx={{ color: "var(--color-accent)" }}
        />
        <Box>
          <Typography variant="h5" fontWeight={700} color="var(--color-text)">
            Frequently Asked Questions
          </Typography>
          <Typography variant="body2" color="var(--color-subtext)">
            TechLight customer support center
          </Typography>
        </Box>
      </Box>

      {faqs.map((faq, index) => (
        <Accordion
          key={index}
          sx={{
            backgroundColor: "var(--color-background)",
            color: "var(--color-text)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "none",
            "&:before": { display: "none" },
            "&.Mui-expanded": {
              margin: 0,
            },
          }}
        >
          <AccordionSummary
            expandIcon={
              <ExpandMoreIcon sx={{ color: "var(--color-accent)" }} />
            }
          >
            <Typography fontWeight={600}>{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="var(--color-subtext)">{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}

      <Box
        mt={4}
        p={2}
        borderRadius={2}
        sx={{
          backgroundColor: "rgba(255, 193, 7, 0.1)",
          border: "1px solid rgba(255, 193, 7, 0.3)",
        }}
      >
        <Typography variant="body2" color="warning.main">
          <strong>Need more help?</strong> Contact us at{" "}
          <a
            href="mailto:support@techlight.com"
            style={{
              color: "var(--color-link-hover-blue)",
              textDecoration: "underline",
            }}
          >
            support@techlight.com
          </a>{" "}
          or call +880 1234-567890.
        </Typography>
      </Box>
    </Box>
  );
};

export default FAQ;
