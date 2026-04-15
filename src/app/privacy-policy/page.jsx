export const metadata = {
  title: "Privacy Policy | EliteReviews",
  description: "Our Privacy Policy and Data Handling procedures.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-16 bg-dark-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h1 className="text-4xl font-extrabold mb-4 premium-gradient">Privacy Policy</h1>
          <p className="text-gray-400 text-lg">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="prose prose-invert prose-elite max-w-none text-gray-300">
          <p>
            At EliteReviews, accessible from elitereviews.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by EliteReviews and how we use it.
          </p>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Log Files</h2>
          <p>
            EliteReviews follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Cookies and Web Beacons</h2>
          <p>
            Like any other website, EliteReviews uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Google DoubleClick DART Cookie</h2>
          <p>
            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Our Advertising Partners</h2>
          <p>
            Some of advertisers on our site may use cookies and web beacons. Our advertising partners include Google AdSense and various Affiliate Networks (e.g., Amazon Associates). Each of our advertising partners has their own Privacy Policy for their policies on user data.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Children's Information</h2>
          <p>
            Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
          </p>
          <p>
            EliteReviews does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
          </p>
        </div>
      </div>
    </div>
  );
}
