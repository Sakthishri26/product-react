import { useState } from "react";

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300";

function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-6 text-center text-3xl font-bold">Contact Us</h1>

      {sent ? (
        <p className="rounded-lg bg-green-100 p-6 text-center text-xl text-green-800">
          Thanks! We will get back to you soon.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 rounded-lg bg-white p-6 shadow-md"
        >
          <label className="flex flex-col gap-1 font-medium">
            Name
            <input type="text" required placeholder="Your name" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 font-medium">
            Email
            <input type="email" required placeholder="Your email" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 font-medium">
            Message
            <textarea required rows="4" placeholder="Your message" className={inputClass} />
          </label>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-white transition hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      )}
    </section>
  );
}

export default Contact;