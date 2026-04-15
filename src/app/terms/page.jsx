export const metadata = {
  title: "Terms & Conditions | EliteReviews",
  description: "Terms and Conditions of using EliteReviews.",
};

export default function TermsPage() {
  return (
    <div className="py-16 bg-dark-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h1 className="text-4xl font-extrabold mb-4 premium-gradient">Terms & Conditions</h1>
          <p className="text-gray-400 text-lg">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="prose prose-invert prose-elite max-w-none text-gray-300">
          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">1. Introduction</h2>
          <p>
            Welcome to EliteReviews. These Terms and Conditions outline the rules and regulations for the use of the EliteReviews Website.
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use EliteReviews if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">2. Intellectual Property Rights</h2>
          <p>
            Other than the content you own, under these Terms, EliteReviews and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">3. Restrictions</h2>
          <p>You are specifically restricted from all of the following:</p>
          <ul>
            <li>Publishing any Website material in any other media without prior credit;</li>
            <li>Selling, sublicensing and/or otherwise commercializing any Website material;</li>
            <li>Using this Website in any way that is or may be damaging to this Website;</li>
            <li>Using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">4. Affiliate Disclaimer</h2>
          <p>
            EliteReviews is a participant in various affiliate advertising programs designed to provide a means for sites to earn advertising fees by advertising and linking to partner websites. When you click on product links on our site, we may receive a commission at no extra cost to you. This does not impact our reviews and comparisons.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">5. No Warranties</h2>
          <p>
            This Website is provided "as is," with all faults, and EliteReviews express no representations or warranties, of any kind related to this Website or the materials contained on this Website.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">6. Limitation of Liability</h2>
          <p>
            In no event shall EliteReviews, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this Website.
          </p>
        </div>
      </div>
    </div>
  );
}
