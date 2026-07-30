import React from "react";

export const metadata = {
  title: "Terms & Conditions | XeSports",
  description: "Terms and Conditions for XeSports Platform",
};

export default function TermsConditionsPage() {
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
              TERMS & CONDITIONS
            </span>
          </h1>
          <p className="text-white/40 mt-4 text-sm md:text-base font-medium mx-auto uppercase tracking-widest">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-[#0c0a11]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 md:p-10 shadow-2xl text-gray-300 space-y-8">
          
          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">Introduction</h2>
            <p className="leading-relaxed mb-4">
              These Terms and Conditions (&quot;Terms&quot;) govern participation in the GamingFiesta esports tournament (&quot;Tournament&quot;) organized and operated by TechXhub DMCC (trading as &quot;XeSports&quot;), a company duly registered in Dubai Multi Commodities Centre, United Arab Emirates (&quot;Organizer&quot;), in collaboration with VSTAR MULTIMEDIA LLC (trading as &quot;Virgin Megastore&quot;) (&quot;Collaborating Partner&quot;).
            </p>
            <p className="leading-relaxed">
              By registering for or participating in the Tournament, all participants (&quot;Participants&quot;) unconditionally agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">1. Eligibility and Registration</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li><strong className="text-gray-300">1.1</strong> Participants must be at least sixteen (16) years of age at the time of registration.</li>
              <li><strong className="text-gray-300">1.2</strong> Participants under eighteen (18) years of age must obtain parental or legal guardian consent prior to registration.</li>
              <li><strong className="text-gray-300">1.3</strong> Participants must provide accurate, complete, and current registration information, including but not limited to full legal name, date of birth, contact details, and gaming credentials.</li>
              <li><strong className="text-gray-300">1.4</strong> The Organizer reserves the absolute right to verify the identity and eligibility of any Participant and to disqualify any Participant who fails to provide satisfactory documentation upon request.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">2. Tournament Rules and Conduct</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li><strong className="text-gray-300">2.1</strong> Participants must comply with all Tournament rules, game-specific regulations, and instructions from Tournament administrators at all times.</li>
              <li><strong className="text-gray-300">2.2</strong> Participants are strictly prohibited from engaging in cheating, hacking, exploiting game bugs, collusion, match-fixing, or any other form of fraudulent or unfair conduct.</li>
              <li><strong className="text-gray-300">2.3</strong> Participants shall not use language or conduct that is obscene, abusive, hateful, discriminatory, threatening, defamatory, or otherwise objectionable during any Tournament activity.</li>
              <li><strong className="text-gray-300">2.4</strong> Betting or wagering on Tournament matches by Participants, team members, or any person associated with participating teams is strictly prohibited.</li>
              <li><strong className="text-gray-300">2.5</strong> Violation of conduct rules may result in immediate disqualification, forfeiture of prizes, and potential legal action.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">3. Data Collection, Processing, and Sharing</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li><strong className="text-gray-300">3.1 Definitions.</strong> For purposes of this section, &quot;Personal Data&quot; means any information relating to an identified or identifiable Participant, including but not limited to name, contact information, identification documents, gameplay data, photographs, and video recordings.</li>
              <li><strong className="text-gray-300">3.2 Data Collection.</strong> By participating in the Tournament, Participants expressly consent to the collection and processing of their Personal Data by both the Organizer and the Collaborating Partner for purposes including but not limited to Tournament administration, prize distribution, marketing, promotional activities, and compliance with applicable laws.</li>
              <li><strong className="text-gray-300">3.3 Data Sharing Between Parties.</strong> Participants acknowledge and consent that Personal Data collected during the Tournament will be shared between TechXhub DMCC (XeSports) and VSTAR MULTIMEDIA LLC (Virgin Megastore) for the purposes specified herein.</li>
              <li><strong className="text-gray-300">3.4 Data Protection Compliance.</strong> Both the Organizer and Collaborating Partner undertake to process all Personal Data in accordance with UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data and all applicable data protection regulations, including those specific to DMCC free zone.</li>
              <li><strong className="text-gray-300">3.5 Data Security.</strong> Reasonable technical and organizational measures shall be implemented to protect Personal Data against unauthorized access, disclosure, alteration, or destruction.</li>
              <li><strong className="text-gray-300">3.6 Third-Party Disclosure.</strong> Personal Data may be disclosed to third parties including sponsors, service providers, regulatory authorities, and law enforcement agencies where required for Tournament operations or by applicable law.</li>
              <li><strong className="text-gray-300">3.7 Participant Rights.</strong> Participants have the right to access, correct, or request deletion of their Personal Data, subject to legal and operational requirements, by contacting the Organizer at the address specified in Section 11 herein.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">4. Intellectual Property Rights</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li><strong className="text-gray-300">4.1</strong> All intellectual property rights in and to the Tournament, including but not limited to trademarks, logos, tournament names, broadcast content, photographs, video recordings, and promotional materials, shall be the sole and exclusive property of the Organizer and/or the Collaborating Partner.</li>
              <li><strong className="text-gray-300">4.2</strong> Participants grant the Organizer and Collaborating Partner a perpetual, irrevocable, worldwide, royalty-free license to use, reproduce, modify, distribute, and display their name, likeness, voice, gameplay footage, and any content created during the Tournament for promotional, marketing, and commercial purposes.</li>
              <li><strong className="text-gray-300">4.3</strong> Participants represent and warrant that their participation does not infringe upon any third-party intellectual property rights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">5. Prizes and Awards</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li><strong className="text-gray-300">5.1</strong> Prize structure, amounts, and distribution methods shall be determined solely by the Organizer and communicated to Participants prior to Tournament commencement.</li>
              <li><strong className="text-gray-300">5.2</strong> Winners must provide all required documentation, including valid identification, tax information, and signed prize acceptance forms, within the timeframe specified by the Organizer.</li>
              <li><strong className="text-gray-300">5.3</strong> Failure to provide required documentation or respond to prize notification within the specified timeframe may result in forfeiture of prizes, and alternate winners may be selected at the Organizer&apos;s sole discretion.</li>
              <li><strong className="text-gray-300">5.4</strong> All applicable taxes, duties, and charges relating to prize receipt are the sole responsibility of the Participant.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">6. Liability and Indemnification</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li><strong className="text-gray-300">6.1 Limitation of Liability.</strong> TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, NEITHER THE ORGANIZER NOR THE COLLABORATING PARTNER SHALL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, LOSS OF DATA, OR BUSINESS INTERRUPTION, ARISING OUT OF OR RELATING TO PARTICIPATION IN THE TOURNAMENT, REGARDLESS OF THE THEORY OF LIABILITY.</li>
              <li><strong className="text-gray-300">6.2 Assumption of Risk.</strong> Participants acknowledge and assume all risks associated with Tournament participation, including risks of personal injury, equipment damage, and financial loss.</li>
              <li><strong className="text-gray-300">6.3 Indemnification.</strong> Participants agree to indemnify, defend, and hold harmless the Organizer, Collaborating Partner, their affiliates, officers, directors, employees, agents, and sponsors from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable legal fees) arising from or relating to the Participant&apos;s breach of these Terms, violation of applicable laws, or infringement of third-party rights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">7. Modifications and Cancellation</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li><strong className="text-gray-300">7.1</strong> The Organizer reserves the absolute right to modify, postpone, suspend, or cancel the Tournament, in whole or in part, at any time and for any reason, including but not limited to technical difficulties, regulatory requirements, force majeure events, or insufficient participation.</li>
              <li><strong className="text-gray-300">7.2</strong> The Organizer may amend these Terms at any time by posting revised Terms on the official Tournament platform, and continued participation shall constitute acceptance of such amendments.</li>
              <li><strong className="text-gray-300">7.3</strong> In the event of Tournament cancellation, the Organizer shall have no liability beyond refund of any entry fees actually paid by Participants, if applicable.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">8. Governing Law and Dispute Resolution</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li><strong className="text-gray-300">8.1 Governing Law.</strong> These Terms shall be governed by and construed in accordance with the laws of the United Arab Emirates and the regulations applicable within the Dubai Multi Commodities Centre (DMCC).</li>
              <li><strong className="text-gray-300">8.2 Dispute Resolution.</strong> Any dispute, controversy, or claim arising out of or relating to these Terms or the Tournament, including the validity, interpretation, performance, breach, or termination thereof, shall be referred to and finally resolved by arbitration in accordance with the arbitration rules of the Dubai International Arbitration Centre (DIAC).</li>
              <li><strong className="text-gray-300">8.3 Arbitration Seat.</strong> The seat of arbitration shall be Dubai, United Arab Emirates, and proceedings shall be conducted in the English language.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">9. Confidentiality</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li><strong className="text-gray-300">9.1</strong> Participants shall maintain strict confidentiality regarding any non-public information disclosed by the Organizer or Collaborating Partner in connection with the Tournament, including but not limited to Tournament strategies, technical specifications, and business information.</li>
              <li><strong className="text-gray-300">9.2</strong> This confidentiality obligation shall survive termination or completion of the Tournament and shall continue for a period of two (2) years thereafter.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">10. Regulatory Compliance</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li><strong className="text-gray-300">10.1</strong> The Tournament is conducted in compliance with all applicable laws and regulations of the United Arab Emirates, including those pertaining to commercial gaming activities as regulated by the General Commercial Gaming Regulatory Authority (GCGRA) where applicable.</li>
              <li><strong className="text-gray-300">10.2</strong> The Tournament is skill-based and does not constitute gambling, betting, or any chance-based activity prohibited under UAE law.</li>
              <li><strong className="text-gray-300">10.3</strong> Participants must comply with all applicable anti-money laundering and counter-terrorism financing regulations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">11. Notices and Communications</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-400 mb-4">
              <li><strong className="text-gray-300">11.1</strong> All notices, communications, and official Tournament announcements shall be provided through the official Tournament platform, email, or other electronic means designated by the Organizer.</li>
              <li><strong className="text-gray-300">11.2</strong> Participants are responsible for monitoring official communication channels and ensuring their contact information remains current and accurate.</li>
              <li><strong className="text-gray-300">11.3</strong> For inquiries or concerns regarding these Terms or the Tournament, Participants may contact:</li>
            </ul>
            <div className="pl-5 text-gray-300 bg-white/5 p-4 rounded-lg border border-white/10">
              <p>TechXhub DMCC (XeSports)</p>
              <p>Dubai Multi Commodities Centre</p>
              <p>Dubai, United Arab Emirates</p>
              <p>Email: <a href="mailto:support@xesports.com" className="text-jaffa-500 hover:text-jaffa-400">support@xesports.com</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">12. General Provisions</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li><strong className="text-gray-300">12.1 Severability.</strong> If any provision of these Terms is determined to be invalid, unlawful, or unenforceable to any extent, such provision shall be severed, and the remaining provisions shall continue in full force and effect to the maximum extent permitted by law.</li>
              <li><strong className="text-gray-300">12.2 Waiver.</strong> No waiver of any provision of these Terms shall be deemed or shall constitute a waiver of any other provision, nor shall any waiver constitute a continuing waiver unless expressly provided in writing.</li>
              <li><strong className="text-gray-300">12.3 Entire Agreement.</strong> These Terms, together with any supplementary rules or regulations published by the Organizer, constitute the entire agreement between the parties concerning the subject matter hereof and supersede all prior agreements, understandings, negotiations, and discussions.</li>
              <li><strong className="text-gray-300">12.4 No Third-Party Rights.</strong> These Terms do not confer any rights or remedies upon any person or entity other than the parties hereto and their respective successors and permitted assigns.</li>
              <li><strong className="text-gray-300">12.5 Assignment.</strong> Participants may not assign or transfer any rights or obligations under these Terms without the prior written consent of the Organizer.</li>
              <li><strong className="text-gray-300">12.6 Independent Contractor.</strong> The relationship between Participants and the Organizer is that of independent contractors, and nothing in these Terms shall be construed to create an employment, agency, partnership, or joint venture relationship.</li>
            </ul>
          </section>

        </div>
      </div>
    </section>
  );
}
