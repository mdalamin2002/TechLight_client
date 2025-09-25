
const WarrantyPolicy = () => {
  const sections = [
    {
      title: "Warranty Policy",
      content: `Before buying any product from TechLight Computers Limited it is important to pay attention 
      to the set of warranty policies mentioned below. Because the sale of any product means that the 
      buyer has made the purchase in consent to the terms and conditions mentioned below. The product 
      warranty that comes with a purchase is basically a "Manufacturing Warranty". It means the manufacturer 
      or the brand is responsible for the warranty issues. Each of the brands has a different warranty 
      policy, which is clearly mentioned on their respective websites. In this case, TechLight is only 
      responsible for selling the products to customers and helping manufacturers to implement the 
      terms and conditions of the warranty policy.`
    },
    {
      title: "General Terms and Conditions of Manufacturing Company",
      list: [
        "Not all products have a warranty. Only those products for which the warranty period has been declared in TechLight' bill/invoice will be covered under the warranty facility till the declared period...",
        "In the case of a Product Lifetime Warranty, it remains valid as long as the manufacturer continues the production...",
        "International warranty will be covered only for those products that have an international warranty written on the bill...",
        "Under the warranty policy, TechLight will, at its discretion, repair any defective product within the warranty period.",
        "We cannot specifically mention how much time is required to complete the repair for the product...",
        "We can't say precisely how many times you have to claim the warranty for a product...",
        "In case of an irreparable product, it will be replaced by another product of the same model.",
        "In case of unavailability of products of the same model, the product will be replaced by a product with an equal price...",
        "The customer will get a refund in case of irreparability and unavailability of products.",
        "TechLight Computers Limited will not take any responsibility for any loss of data or software during the servicing period...",
        "The warranty will not be valid for any damages caused by unwary usage, water, free fall, and fire...",
        "The internal liquid damage or leakage of any product will not be covered by the warranty.",
      
        "If a customer forgets their account ID and password on the device purchased from TechLight... not covered under warranty.",
        "Before submitting a product for warranty, it is essential to log out and deactivate all associated accounts...",
        "A Conditional Receipt indicates specific symptoms or reasons for which the manufacturing company may reject warranty claims...",
        "No warranty will be applicable for the mouse, headphones, or accessories provided with any laptop.",
        "TechLight Computers Limited will set the charges, in consent with the customer, for any services that are not covered by warranty.",
        "In the case of printer/photocopier warranty claims, the customer must submit the original ink/cartridge/toner/ribbon...",
        "Printer/photocopier cartridges, toners, heads, rollers, drums, element covers, maintenance boxes... will not be covered under warranty.",
        "If any internal components of the printer/photocopier such as ribbons, cables, ink pipes, circuit boards, etc., are damaged... not covered.",
        "Refill/usage of ink cartridges or toner cartridges not recommended by the manufacturer will void the warranty for Printers.",
        "The claimed printer or photocopier's toner, cartridge, and ink level can be decreased for testing purposes...",
        "Fungus or rust on the mainboard, graphics card, and RAM will void the warranty.",
        "The warranty does not cover graphics cards, which are used for data mining.",
        "A monitor or display with one to three dots is ineligible for warranty claims...",
        "Any scratches on the monitor or display of any devices will void the warranty.",
        "The warranty will not be valid for Motherboards and processors with damaged pins.",
        "The free cooling fans provided with the processors do not come with a warranty.",
        "If the serial/sticker of the product is partially or completely removed or damaged, it will no longer be able to claim a warranty.",
        "In case of damages to the mouse or keyboard purchased as Combo, the whole package must be presented...",
        "For routers that come with multiple units/devices and accessories, the warranty must be claimed with all items.",
        "Power adapters, remotes, microphones, and cables provided with printers, scanners, routers... do not come with a warranty.",
       
       
        "Any service related to hardware cleaning will not be considered a free service. (Added 25 September 2025)"
      ]
    }
  ];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md max-w-4xl mx-auto">
      {sections.map((section, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-xl font-bold mb-3">{section.title}</h2>
          {section.content && (
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
              {section.content}
            </p>
          )}
          {section.list && (
            <ul className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              {section.list.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600">
          For any opinion or complaint related to warranty, write us at:{" "}
          <a href="mailto:info@TechLight.com" className="text-blue-600 underline">
            info@techlight.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default WarrantyPolicy;
