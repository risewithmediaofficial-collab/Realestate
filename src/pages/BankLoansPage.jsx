import { useState } from "react";
import { ArrowRightIcon, CheckCircleIcon } from "../components/AppIcons";
import SeoHead from "../components/SeoHead";
import LoanCalculator from "../components/LoanCalculator";
import { bankLoans } from "../constants/bankLoans";

const BankLoansPage = () => {
  const [selectedBank, setSelectedBank] = useState(bankLoans[0]);

  return (
    <>
      <SeoHead
        title="Bank Home Loans - Compare Rates & Calculate EMI"
        description="Compare home loan rates from SBI, PNB, HDFC, LIC, IDBI, Can Fin Homes, and Aditya Birla Capital. Use our EMI calculator to review monthly payments and total interest."
        keywords="home loans, bank loans, EMI calculator, loan rates, SBI, PNB, HDFC, LIC, IDBI, Can Fin Homes, Aditya Birla Capital"
      />

      {/* Static Hero Section */}
      <section className="px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-[1440px]">
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl text-navy">Bank Home Loans</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 sm:text-base text-slate-600">
            Compare Interest Rates & Calculate Your EMI
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="px-5 py-12 sm:px-8 sm:py-14 lg:px-10 bg-white">
        <div className="mx-auto max-w-[1440px] space-y-16">

          {/* Bank Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:grid-cols-3">
            {bankLoans.map((bank) => (
              <div
                key={bank.id}
                onClick={() => setSelectedBank(bank)}
                className={`group cursor-pointer rounded-2xl border p-6 transition-all duration-300 ${
                  selectedBank.id === bank.id
                    ? "bg-white border-navy shadow-lg ring-1 ring-navy"
                    : "bg-white border-slate-200 hover:shadow-xl hover:border-slate-300"
                }`}
              >
                <div className="text-4xl mb-3">{bank.logo}</div>
                <h3 className="text-lg font-bold mb-2 text-slate-900">
                  {bank.shortName}
                </h3>
                <p className="text-sm mb-3 text-slate-600">
                  {bank.description}
                </p>
                <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-navy/10 text-navy">
                  {bank.minRate}% - {bank.maxRate}%
                </div>
              </div>
            ))}
          </div>

          {/* Loan Calculator */}
          <div className="border border-slate-200 rounded-2xl p-1 bg-white">
            <LoanCalculator bank={selectedBank} onBankChange={setSelectedBank} />
          </div>

          {/* Detailed Bank Information */}
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Bank Details & Features</h2>
            {bankLoans.map((bank) => (
              <div
                key={bank.id}
                className={`rounded-2xl p-8 transition-all duration-300 border ${
                  selectedBank.id === bank.id
                    ? "border-navy bg-white shadow-lg ring-1 ring-navy"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6">
                  <div className="text-5xl">{bank.logo}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 text-slate-900">
                      {bank.name}
                    </h3>
                    <p className="text-slate-600">
                      {bank.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-lg bg-white border border-slate-200">
                    <p className="text-sm font-medium mb-2 text-slate-600">
                      Interest Rate
                    </p>
                    <p className="text-2xl font-bold text-navy">
                      {bank.minRate}% - {bank.maxRate}%
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-white border border-slate-200">
                    <p className="text-sm font-medium mb-2 text-slate-600">
                      Processing Fee
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {bank.processingFee}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-white border border-slate-200">
                    <p className="text-sm font-medium mb-2 text-slate-600">
                      Max Loan Amount
                    </p>
                    <p className="text-2xl font-bold text-purple-700">
                      {bank.maxLoanAmount}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Why Choose a Bank Loan?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Competitive Rates", description: "Get the best interest rates starting from 6.7% per annum with flexible terms." },
                { title: "Quick Approval", description: "Fast loan processing with minimal documentation and quick disbursement." },
                { title: "Flexible Tenure", description: "Choose from 5 to 20 years tenure based on your repayment capacity." },
                { title: "Easy EMI Calculator", description: "Use our advanced calculator to plan your finances effectively." },
                { title: "Tax Benefits", description: "Claim tax deductions on principal and interest under Section 80C." },
                { title: "Expert Support", description: "Get guidance from our experts throughout the loan process." },
              ].map((benefit, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="w-6 h-6 text-navy mt-1" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                    <p className="text-slate-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calculator Tips */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">How to Use the Calculator?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: 1, title: "Select Your Bank", description: "Choose from SBI, PNB, HDFC, LIC, IDBI, Can Fin Homes, or Aditya Birla Capital. Each lender has different rates and terms." },
                { step: 2, title: "Enter Loan Amount", description: "Slide to select your desired loan amount between ₹5 Lakhs and ₹100 Lakhs." },
                { step: 3, title: "Adjust Interest Rate", description: "Set the interest rate within the bank's range. Higher rates mean higher EMI and vice versa." },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-orange text-white rounded-full font-bold text-2xl mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-slate-200 space-y-3">
              <h4 className="font-semibold text-slate-900">Additional Tips:</h4>
              <ul className="space-y-2 text-slate-600">
                <li>• Consider your income and monthly expenses before finalizing the loan amount</li>
                <li>• Longer tenure means lower EMI but higher total interest amount</li>
                <li>• Compare different banks' rates using our calculator to get the best deal</li>
                <li>• Always check for hidden charges and processing fees before applying</li>
              </ul>
            </div>
          </div>

          {/* Bank Comparison Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Bank Comparison</h2>

            {/* Mobile cards */}
            <div className="space-y-4 md:hidden">
              {bankLoans.map((bank) => (
                <div key={bank.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-slate-900">{bank.shortName}</h3>
                    <span className="rounded-full bg-navy/10 px-3 py-1 text-xs font-semibold text-navy">
                      {bank.minRate}% - {bank.maxRate}%
                    </span>
                  </div>
                  <div className="mb-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {bank.description}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500">Processing Fee</p>
                      <p className="font-medium text-slate-900">{bank.processingFee}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Max Loan</p>
                      <p className="font-medium text-slate-900">{bank.maxLoanAmount}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Max Tenure</p>
                      <p className="font-medium text-slate-900">{bank.maxTenure}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="text-left py-4 px-4 font-semibold text-slate-900">Bank</th>
                    <th className="text-center py-4 px-4 font-semibold text-slate-900">Bank Type</th>
                    <th className="text-center py-4 px-4 font-semibold text-slate-900">Interest Rate</th>
                    <th className="text-center py-4 px-4 font-semibold text-slate-900">Processing Fee</th>
                    <th className="text-center py-4 px-4 font-semibold text-slate-900">Max Loan</th>
                    <th className="text-center py-4 px-4 font-semibold text-slate-900">Max Tenure</th>
                  </tr>
                </thead>
                <tbody>
                  {bankLoans.map((bank, index) => (
                    <tr key={bank.id} className={`border-b hover:bg-slate-50 transition ${index % 2 === 0 ? "bg-white" : "bg-white"}`}>
                      <td className="py-4 px-4 font-semibold text-slate-900">{bank.shortName}</td>
                      <td className="text-center py-4 px-4 text-slate-600">{bank.description}</td>
                      <td className="text-center py-4 px-4">
                        <span className="bg-navy/10 text-navy px-3 py-1 rounded-full text-sm font-semibold">
                          {bank.minRate}% - {bank.maxRate}%
                        </span>
                      </td>
                      <td className="text-center py-4 px-4 text-slate-600">{bank.processingFee}</td>
                      <td className="text-center py-4 px-4 text-slate-600">{bank.maxLoanAmount}</td>
                      <td className="text-center py-4 px-4 text-slate-600">{bank.maxTenure}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Eligibility & Requirements */}
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Eligibility & Requirements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:grid-cols-3">
              {bankLoans.map((bank) => (
                <div
                  key={bank.id}
                  className="rounded-2xl p-6 bg-white border border-slate-200 shadow-sm"
                >
                  <h3 className="text-xl font-bold mb-4 text-slate-900">{bank.shortName}</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-700 mb-2">Eligibility:</p>
                      <ul className="text-sm space-y-1 text-slate-600">
                        {bank.eligibility.map((item, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span>•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "What is EMI and how is it calculated?", a: "EMI (Equated Monthly Installment) is the fixed amount you need to pay every month towards your loan. It includes both principal and interest components. Our calculator uses the standard EMI formula: EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1], where P is principal, r is monthly interest rate, and n is tenure in months." },
                { q: "What documents are required for a home loan?", a: "Typically, you'll need: Identity proof, Address proof, Income proof (salary slip, ITR), Property documents, Sanction letter from local authority, NOC from municipal corporation, and Bank statements for last 6 months." },
                { q: "Can I prepay my home loan?", a: "Yes, most banks allow prepayment of home loans. Many banks have no prepayment penalty, but some may charge a small percentage. Prepayment helps reduce total interest and tenure. Check with your bank for specific prepayment terms." },
                { q: "Is there any tax benefit on home loans?", a: "Yes! You can claim tax deduction under Section 80C for principal repayment (up to ₹1.5 lakhs per year) and Section 24(b) for interest paid (up to ₹2 lakhs per year) on your home loan." },
                { q: "What is a processing fee?", a: "Processing fee is charged by banks for processing your loan application. It typically ranges from 0.5% to 1.5% of the loan amount and is deducted from the loan amount at disbursal." },
                { q: "How long does loan approval take?", a: "Loan approval typically takes 3-7 working days after complete documentation. Some banks offer faster processing for salaried employees. Online loan applications may be quicker than traditional methods." },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-white border border-slate-200 p-6 rounded-xl hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{faq.q}</h3>
                  <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center py-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Ready to Apply for a Loan?</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Get expert guidance from our team to find the best loan option that suits your financial needs.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-navy text-white rounded-lg font-semibold hover:bg-navy/90 hover:shadow-xl transition-all duration-300"
            >
              Contact Our Experts <ArrowRightIcon className="w-5 h-5" />
            </a>
          </div>

        </div>
      </section>
    </>
  );
};

export default BankLoansPage;
