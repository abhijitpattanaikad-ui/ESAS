import React from "react";

export const metadata = {
  title: "Privacy Policy | XeSports",
  description: "Privacy Policy for XeSports Platform",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="relative py-12 md:py-20 bg-woodsmoke-950 px-4 bg-[image:--features-bg] bg-cover bg-center bg-no-repeat min-h-screen pt-24 md:pt-32">
      {/* Dark Overlays for premium look */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.8)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[40%] bg-linear-to-b from-woodsmoke-950 via-woodsmoke-950/60 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-linear-to-t from-woodsmoke-950 via-woodsmoke-950/60 to-transparent pointer-events-none" />

      <div className="container mx-auto z-10 relative max-w-4xl">
        {/* Page Title with Gradient */}
        <div className="mb-10 md:mb-16 text-center">
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold heading-font uppercase px-4">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 via-jaffa-500 to-red-600">
              PRIVACY POLICY
            </span>
          </h1>
          <p className="text-white/40 mt-4 text-sm md:text-base font-medium mx-auto uppercase tracking-widest">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-[#0c0a11]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 md:p-10 shadow-2xl text-gray-300 space-y-8">

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">1. Who We Are</h2>
            <p className="leading-relaxed">
              This privacy policy applies to Virgin Gaming Fiesta powered by XeSports, operated by TechXhub DMCC and VSTAR MULTIMEDIA LLC (Virgin Megastore), registered in Dubai Multi Commodities Centre, United Arab Emirates. For privacy concerns, contact: <a href="mailto:support@xesports.pro" className="text-jaffa-500 hover:text-jaffa-400">support@xesports.pro</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">2. What Personal Data We Collect</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li>Name, email, phone, and IGN (for registration and verification)</li>
              <li>Gaming username, tournament records, and team information</li>
              <li>Payment and prize distribution data</li>
              <li>Device data (IP address, browser info), usage analytics, and location (city/country, not precise GPS)</li>
              <li>Communications (support tickets, feedback, social handles)</li>
              <li>With parental/guardian consent for users under 18</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">3. Purpose of Data Collection</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li>To manage tournament registration, eligibility, scores, and prize disbursement</li>
              <li>To maintain user accounts and provide support</li>
              <li>For fraud prevention, anti-cheat, and platform security</li>
              <li>For legal and regulatory compliance with UAE law, including tax and anti-money-laundering</li>
              <li>For sending event updates, marketing (with your opt-in consent), and service improvement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">4. Legal Basis & Consent</h2>
            <p className="leading-relaxed">
              Personal data is processed based on your registration (contractual basis), legitimate business interests, and to comply with UAE law. Marketing and analytics tracking is only performed with your explicit consent. You may withdraw consent at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">5. Data Sharing</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li>Shared with tournament sponsors, partners (Virgin Megastore), payment providers, and regulatory authorities as required by law (e.g. prize fulfillment and legal compliance)</li>
              <li>Limited data shared with game publishers for ranking and eligibility checks</li>
              <li>No selling or sharing of personal data for unrelated third-party commercial purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">6. Security and Data Retention</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li>Data is protected with industry-standard encryption and access controls</li>
              <li>Retained only as long as legally required (competition data for up to 5 years, financial for 7 years)</li>
              <li>Secured against unauthorized access, and promptly deleted/anonymized when no longer needed</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">7. Your Rights</h2>
            <p className="leading-relaxed mb-4">
              Under UAE PDPL, you may request:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-400 mb-4">
              <li>Access to your data and a portable copy</li>
              <li>Correction or deletion (unless retention is required by law)</li>
              <li>Restriction or objection to certain uses (e.g. marketing)</li>
              <li>Withdrawal of consent at any time</li>
            </ul>
            <p className="leading-relaxed">
              Requests: <a href="mailto:support@xesports.pro" className="text-jaffa-500 hover:text-jaffa-400">support@xesports.pro</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">8. Cookies and Tracking</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li>Essential cookies are used for website function</li>
              <li>Non-essential cookies (analytics/marketing) used only with your consent; manage via browser settings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">9. Children’s Data</h2>
            <p className="leading-relaxed">
              No collection of data from children under 16 without verified parental consent. Parents can contact us to delete their child’s data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">10. Policy Changes</h2>
            <p className="leading-relaxed">
              Material changes will be notified via website/email. Continued use of services means consent to the updated policy.
            </p>
          </section>

        </div>
      </div>
    </section>
  );
}
