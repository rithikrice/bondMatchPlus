import { Card, CardContent, CardHeader, CardTitle } from "../ui/RandomCard";
import { Input } from "../ui/Input";
import { Button } from "../ui/RandomButton";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  const handleSignupRedirect = (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f2544] via-[#1f3e72] to-[#2a5ecb]" />
      {/* Decorative glows */}
      <div className="absolute -top-20 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 -right-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="grid w-full max-w-5xl grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Brand panel */}
          <div className="hidden lg:flex flex-col text-white/90">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs tracking-wide">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                secure onboarding
              </span>
            </div>
            <h1 className="text-4xl font-extrabold leading-tight">
              Welcome back to <span className="text-white">BondMatch+</span>
            </h1>
            <p className="mt-3 text-white/70">
              Institutional-grade design. Consumer-grade simplicity. Track,
              discover, and act on the fixed-income market—confidently.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4 text-sm">
              <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/10">
                <p className="font-semibold">AES-256</p>
                <p className="text-white/60">Encryption</p>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/10">
                <p className="font-semibold">99.9%</p>
                <p className="text-white/60">Uptime</p>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/10">
                <p className="font-semibold">DPI Ready</p>
                <p className="text-white/60">Aadhaar / PAN</p>
              </div>
            </div>
          </div>

          {/* Auth card */}
          <Card className="w-full rounded-2xl border border-white/20 bg-white/85 backdrop-blur-xl shadow-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-[#0f2544] text-center">
                Sign in to BondMatch+
              </CardTitle>
              <p className="text-center text-sm text-gray-500">
                Enter your credentials to access your dashboard
              </p>
            </CardHeader>

            <CardContent className="pt-2">
              {/* Attach onSubmit */}
              <form className="space-y-4" onSubmit={handleSignIn}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      className="w-full pl-3 pr-3 h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#2a5ecb] focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-3 pr-3 h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#2a5ecb] focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="inline-flex items-center gap-2 select-none">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-[#2a5ecb]"
                    />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <a
                    href="#"
                    className="text-[#2a5ecb] hover:opacity-80 font-medium"
                  >
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-[#2a5ecb] to-[#1f3e72] hover:brightness-110 text-white font-semibold shadow-lg transition"
                >
                  Sign In
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white/85 px-3 text-xs text-gray-500">
                      or
                    </span>
                  </div>
                </div>

                <Button className="w-full h-11 rounded-xl bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 font-medium transition">
                  Continue with Email Link
                </Button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                New here?{" "}
                <a
                  href="#"
                  onClick={handleSignupRedirect}
                  className="text-[#2a5ecb] hover:opacity-80 font-semibold"
                >
                  Create an account
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
