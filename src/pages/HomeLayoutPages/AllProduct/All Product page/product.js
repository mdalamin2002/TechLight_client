export const toNumber = (val) => {
  if (typeof val === "number") return val;
  if (typeof val === "string")
    return parseInt(val.replace(/[^\d]/g, ""), 10) || 0;
  return 0;
};

export const priceLabel = (val) => {
  const n = toNumber(val);
  return `৳${n.toLocaleString()}`;
};

// normalize backend product -> UI friendly
export const normalizeProduct = (p = {}) => {
  // Normalize status to lowercase for consistency
  let status = p.status;
  if (typeof status === 'string') {
    status = status.toLowerCase();
  }

  // Normalize stock to lowercase for consistency
  let stock = p.stock;
  if (typeof stock === 'string') {
    stock = stock.toLowerCase();
  }

  return {
    id: p._id || p.id,
    category: p.category,
    subcategory: p.subcategory,
    name: p.name,
    brand: p.brand,
    model: p.model,
    price: toNumber(p.price),
    regularPrice: toNumber(p.regularPrice),
    status: status || "pending",
    stock: stock || "out of stock",
    productCode: p.productCode,
    keyFeatures: Array.isArray(p.keyFeatures) ? p.keyFeatures : [],
    specifications: p.specifications || {},
    image:
      p.images?.main ||
      p.image ||
      "https://via.placeholder.com/500?text=No+Image",
    images: p.images,
    description: p.description,
    rating: typeof p.rating === "number" ? p.rating : 0,
  };
};
