import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/RandomCard";
import { Input } from "../ui/Input";
import { Button } from "../ui/RandomButton";

const STEPS = [
  "Personal Info",
  "Bank Details",
  "DPI Onboarding",
  "Review & Submit",
];

export default function SignupStepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bankAccount: "",
    ifsc: "",
    aadhaar: "",
    pan: "",
    digilocker: "",
    upi: "",
    consentDPI: false,
  });

  const percent = useMemo(
    () => Math.round(((currentStep + 1) / STEPS.length) * 100),
    [currentStep]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((d) => ({
      ...d,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const nextStep = () =>
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));
  const handleSubmit = () => {
    console.log("Submitted Data:", formData);
    alert("Signup Successful ✅");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f2544] via-[#1f3e72] to-[#2a5ecb]" />
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-white">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Create your BondMatch+ account
          </h1>
          <p className="mt-2 text-white/70">
            DPI-ready onboarding with Aadhaar, PAN, DigiLocker & UPI.
          </p>
        </div>

        {/* Stepper */}
        <Card className="border border-white/20 bg-white/85 backdrop-blur-xl rounded-2xl shadow-2xl">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-[#0f2544]">
                Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
              </CardTitle>
              <span className="text-sm font-medium text-[#1f3e72]">
                {percent}%
              </span>
            </div>
            {/* Progress bar */}
            <div className="mt-4 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#2a5ecb] to-[#1f3e72] transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>

            {/* Step dots */}
            <div className="mt-4 flex items-center gap-3">
              {STEPS.map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={[
                      "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold",
                      i <= currentStep
                        ? "bg-[#2a5ecb] text-white"
                        : "bg-gray-200 text-gray-600",
                    ].join(" ")}
                  >
                    {i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={[
                        "h-1 w-10 rounded-full",
                        i < currentStep ? "bg-[#2a5ecb]" : "bg-gray-200",
                      ].join(" ")}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Animated step body */}
            <div className="min-h-[260px]">
              {currentStep === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all">
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <Input
                      placeholder="Alex Mercer"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#2a5ecb]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#2a5ecb]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="mt-1 h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#2a5ecb]"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Use 8+ characters with a mix of letters & numbers.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Bank Account Number
                    </label>
                    <Input
                      placeholder="XXXXXXXXXXXX"
                      name="bankAccount"
                      value={formData.bankAccount}
                      onChange={handleChange}
                      className="mt-1 h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#2a5ecb]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      IFSC Code
                    </label>
                    <Input
                      placeholder="HDFC0001234"
                      name="ifsc"
                      value={formData.ifsc}
                      onChange={handleChange}
                      className="mt-1 h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#2a5ecb]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      UPI ID
                    </label>
                    <Input
                      placeholder="name@bank"
                      name="upi"
                      value={formData.upi}
                      onChange={handleChange}
                      className="mt-1 h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#2a5ecb]"
                    />
                  </div>
                  <div className="md:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 p-3">
                    Bank verification happens instantly. We never store full
                    credentials.
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Aadhaar Number
                    </label>
                    <Input
                      placeholder="XXXX-XXXX-XXXX"
                      name="aadhaar"
                      value={formData.aadhaar}
                      onChange={handleChange}
                      className="mt-1 h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#2a5ecb]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      PAN Number
                    </label>
                    <Input
                      placeholder="ABCDE1234F"
                      name="pan"
                      value={formData.pan}
                      onChange={handleChange}
                      className="mt-1 h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#2a5ecb]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      DigiLocker ID
                    </label>
                    <Input
                      placeholder="your-digilocker-id"
                      name="digilocker"
                      value={formData.digilocker}
                      onChange={handleChange}
                      className="mt-1 h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#2a5ecb]"
                    />
                  </div>
                  <label className="md:col-span-2 inline-flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
                    <input
                      type="checkbox"
                      name="consentDPI"
                      checked={formData.consentDPI}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#2a5ecb] rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">
                      I consent to DPI verification (Aadhaar/PAN/DigiLocker/UPI)
                      for KYC.
                    </span>
                  </label>
                  <div className="md:col-span-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-800 p-3">
                    Your identity data is encrypted and used only for KYC
                    compliance.
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4 transition-all">
                  <div className="rounded-xl border border-gray-200 p-4 bg-white">
                    <h3 className="font-semibold text-gray-800">Review</h3>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                      <div>
                        <span className="font-medium">Name:</span>{" "}
                        {formData.name || "-"}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>{" "}
                        {formData.email || "-"}
                      </div>
                      <div>
                        <span className="font-medium">Account:</span>{" "}
                        {formData.bankAccount || "-"}
                      </div>
                      <div>
                        <span className="font-medium">IFSC:</span>{" "}
                        {formData.ifsc || "-"}
                      </div>
                      <div>
                        <span className="font-medium">UPI:</span>{" "}
                        {formData.upi || "-"}
                      </div>
                      <div>
                        <span className="font-medium">Aadhaar:</span>{" "}
                        {formData.aadhaar || "-"}
                      </div>
                      <div>
                        <span className="font-medium">PAN:</span>{" "}
                        {formData.pan || "-"}
                      </div>
                      <div>
                        <span className="font-medium">DigiLocker:</span>{" "}
                        {formData.digilocker || "-"}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    By submitting, you agree to our Terms and acknowledge our
                    Privacy Policy.
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center justify-between">
              {currentStep > 0 ? (
                <Button
                  onClick={prevStep}
                  className="h-11 px-5 rounded-xl border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 transition"
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < STEPS.length - 1 ? (
                <Button
                  onClick={nextStep}
                  className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#2a5ecb] to-[#1f3e72] hover:brightness-110 text-white font-semibold shadow-lg transition"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg transition"
                >
                  Submit & Create Account
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer note */}
        <p className="mt-6 text-center text-white/70 text-sm">
          Have an account?{" "}
          <a href="/login" className="text-white hover:opacity-80 font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
