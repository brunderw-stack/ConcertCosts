import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="login-hero relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,oklch(1_0_0/0.15)_1px,transparent_0)] [background-size:24px_24px]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <div className="order-2 max-w-xl text-center lg:order-1 lg:text-left">
          <h1 className="font-display text-5xl font-bold tracking-tight text-primary sm:text-6xl lg:text-7xl">
            Concert Cost Tracker
          </h1>
          <p className="mt-4 font-display text-2xl font-semibold leading-snug sm:text-3xl">
            See what your favorite shows really cost - and how worth it they
            felt.
          </p>
          <p className="mt-4 text-base text-base-content/75 sm:text-lg">
            Log tickets, snacks, travel, merch, and fun ratings in one place.
            Then spot your best-value nights on a clear dashboard.
          </p>
        </div>
        <div className="order-1 w-full max-w-md self-center lg:order-2 lg:self-auto">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
