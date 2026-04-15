import Image from "next/image";

export const metadata = {
  title: "About Us | EliteReviews",
  description: "Learn about the team behind EliteReviews.",
};

export default function AboutPage() {
  return (
    <div className="py-16 bg-dark-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
           <h1 className="text-4xl font-extrabold mb-4 premium-gradient">About EliteReviews</h1>
           <p className="text-gray-400 text-lg">Uncovering the truth behind every product, so you can buy with absolute confidence.</p>
        </div>

        <div className="bg-dark-card border border-border p-8 rounded-2xl mb-12 flex flex-col md:flex-row gap-8 items-center">
           <div className="w-full md:w-1/2 relative h-64 rounded-xl overflow-hidden shadow-2xl">
              <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000" alt="Team working" fill className="object-cover" />
           </div>
           <div className="w-full md:w-1/2 space-y-4">
              <h2 className="text-2xl font-bold">Our Mission</h2>
              <p className="text-gray-400 leading-relaxed">
                The internet is filled with biased reviews and paid endorsements. We founded EliteReviews to provide a secure, hacker-proof, and deeply analytical environment where users get raw, tested data about products in Tech, Fitness, and Farming.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Our editorial integrity is our highest priority. We buy our own testing units whenever possible, and any affiliate relationships strictly never influence our final ratings.
              </p>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
           <div className="p-6 glass rounded-2xl border border-primary-900/30">
              <h3 className="text-4xl font-black text-primary-500 mb-2">5+</h3>
              <p className="font-semibold text-gray-300">Years Experience</p>
           </div>
           <div className="p-6 glass rounded-2xl border border-primary-900/30">
              <h3 className="text-4xl font-black text-primary-500 mb-2">1.2M</h3>
              <p className="font-semibold text-gray-300">Monthly Readers</p>
           </div>
           <div className="p-6 glass rounded-2xl border border-primary-900/30">
              <h3 className="text-4xl font-black text-primary-500 mb-2">500+</h3>
              <p className="font-semibold text-gray-300">Products Tested</p>
           </div>
        </div>
      </div>
    </div>
  );
}
