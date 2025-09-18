import React from "react";

export const ContactUs = () => {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center px-4 py-10">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
      <p className="text-base-content/80 max-w-xl text-center mb-10">
        Have questions or need help? Reach out to us through the form below or
        use any of the contact methods provided.
      </p>

      <div className="grid lg:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Contact Form */}
        <div className="card bg-blue-950 shadow-xl p-6 rounded-xl text-white">
          <h2 className="text-2xl font-bold mb-4 border-b border-white/30 pb-2">
            Send Message
          </h2>
          <form className="space-y-4">
            {/* Support Category */}
            <div>
              <label className="label">
                <span className="label-text text-white">Category</span>
              </label>
              <select className="select select-bordered w-full bg-white text-gray-500 rounded-lg p-1">
                <option disabled selected>
                  Select a category
                </option>
                <option>Order Issues</option>
                <option>Returns & Refunds</option>
                <option>Payment Support</option>
                <option>General Queries</option>
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="label">
                <span className="label-text text-white">Name</span>
              </label>
              <input
                type="text"
                placeholder="Your Name"
                className="input input-bordered w-full bg-white text-gray-900 py-1 px-2 rounded-lg"
              />
            </div>

            {/* Email */}
            <div>
              <label className="label">
                <span className="label-text text-white">Email</span>
              </label>
              <input
                type="email"
                placeholder="Your Email"
                className="input input-bordered w-full bg-white text-gray-900 py-1 px-2 rounded-lg"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="label">
                <span className="label-text text-white">Subject</span>
              </label>
              <input
                type="text"
                placeholder="Subject"
                className="input input-bordered w-full bg-white text-gray-900 py-1 px-2 rounded-lg"
              />
            </div>

            {/* Message */}
            <div>
              <label className="label">
                <span className="label-text text-white">Message</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full bg-white text-gray-900 py-1 px-2 rounded-lg"
                rows="4"
                placeholder="Write your message..."
              ></textarea>
            </div>

            {/* Submit */}
            <button className="bg-white text-blue-950 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition mx-auto block cursor-pointer">
              Submit
            </button>

            <p className="text-sm text-center text-green-400 hidden">
              Thank you, we’ll get back to you soon.
            </p>
          </form>
        </div>

        {/* Direct Info / Map / Links */}
        <div className="flex flex-col justify-between gap-5">
          {/* Contact Info */}
          <div className="card  bg-blue-950 shadow-xl p-6 text-white rounded-xl">
            <h2 className="text-2xl font-bold mb-4 border-b border-white/30 pb-2">
              Direct Contact
            </h2>
            <p className="mb-2">
              <span className="font-semibold">Email:</span>{" "}
              sabrinaboby786@gmail.com
            </p>
            <p className="mb-2">
              <span className="font-semibold">Phone/WhatsApp:</span> +880 1234
              567890
            </p>
            <p className="mb-2">
              <span className="font-semibold">Address:</span> 123 Main Street,
              Dhaka
            </p>
            
          </div>

          {/* Map */}
          <div className="card bg-base-200 overflow-hidden rounded-xl shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.8458121738366!2d90.39156347415207!3d23.750876378692525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8942a2b6e17%3A0x5f2d8c74c329fac5!2sDhaka!5e0!3m2!1sen!2sbd!4v1694882956781!5m2!1sen!2sbd"
              width="100%"
              height="340"
              allowFullScreen=""
              loading="lazy"
              title="Google Map"
            ></iframe>
          </div>
        </div>
      </div>

      {/* FAQ Shortcut & Privacy */}
      <div className="max-w-6xl mt-10 text-center">
        <p>
          Have more questions? Check our{" "}
          <a href="/faq" className="link link-primary">
            FAQ page
          </a>
          .
        </p>
        <p className="text-sm text-base-content/70 mt-2">
          We respect your privacy. Your details are safe with us.
        </p>

        {/* CTA */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <a
            href="mailto:support@yourstore.com"
            className="px-6 py-2 rounded-lg font-semibold text-blue-950 border-2 hover:text-white hover:bg-blue-950 transition shadow-md"
          >
            Email Us
          </a>
          <a
            href="tel:+8801234567890"
            className="px-6 py-2 rounded-lg font-semibold text-blue-950 border-2 hover:text-white hover:bg-blue-950 transition shadow-md"
          >
            Call Us
          </a>
          <a
            href="#"
            className="px-6 py-2 rounded-lg font-semibold text-blue-950 border-2 hover:text-white hover:bg-blue-950 transition shadow-md"
          >
            Chat Now
          </a>
        </div>
      </div>
    </div>
  );
};
