import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  robots: { index: false, follow: false },
};

export default function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Iniciar sesión</h1>
      <div className="mt-6">
        <LoginForm redirectTo={searchParams.next === "/pricing" ? "/pricing" : "/tools"} />
      </div>
      <p className="mt-6 text-center text-sm text-ink-soft">
        ¿No tienes cuenta?{" "}
        <a href="/register" className="font-medium text-accent hover:underline">
          Regístrate gratis
        </a>
      </p>
    </div>
  );
}
