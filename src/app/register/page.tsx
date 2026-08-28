import type { Metadata } from "next";
import RegisterForm from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Crear cuenta",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Crear cuenta gratis</h1>
      <p className="mt-2 text-sm text-ink-soft">
        3 operaciones gratuitas al día, sin necesidad de tarjeta.
      </p>
      <div className="mt-6">
        <RegisterForm />
      </div>
      <p className="mt-6 text-center text-sm text-ink-soft">
        ¿Ya tienes cuenta?{" "}
        <a href="/login" className="font-medium text-accent hover:underline">
          Inicia sesión
        </a>
      </p>
    </div>
  );
}
