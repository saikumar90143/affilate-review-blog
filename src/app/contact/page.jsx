import { Mail, MapPin } from "lucide-react";

export const metadata = {
  title: "Contact Us | EliteReviews",
  description: "Get in touch with the EliteReviews team.",
};

export default function ContactPage() {
  return (
    <div className="py-16 bg-dark-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold mb-4 premium-gradient">Contact Us</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Have a question, partnership proposal, or feedback? Drop us a line.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-dark-card p-8 rounded-2xl border border-border">
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input type="text" required className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input type="email" required className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                <textarea required rows="4" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-primary-500 outline-none"></textarea>
              </div>
              <button type="button" className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-lg transition-colors mt-2">
                Submit Request
              </button>
            </form>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="flex items-start">
              <div className="bg-primary-900/30 p-4 rounded-xl text-primary-400 mr-4">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Email Us</h3>
                <p className="text-gray-400">saikumar@elitereviews.in</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-primary-900/30 p-4 rounded-xl text-primary-400 mr-4">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Our Office</h3>
                <p className="text-gray-400">jangaon, Telangana<br />telangana 506167</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-primary-900/30 p-4 rounded-xl text-primary-400 mr-4 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Instagram</h3>
                <a href="https://www.instagram.com/elitereviews.in" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors">
                  @elitereviews.in
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
