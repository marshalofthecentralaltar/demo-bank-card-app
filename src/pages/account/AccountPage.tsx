import { useState, type ReactNode } from "react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "et", label: "Eesti" },
  { code: "ru", label: "Русский" },
];

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-line py-4 last:border-b-0 sm:grid-cols-[14rem_1fr] sm:gap-6">
      <dt className="text-sm font-semibold text-ink-soft">{label}</dt>
      <dd className="m-0 min-w-0 break-words text-forest">{children}</dd>
    </div>
  );
}

export function AccountPage() {
  const [language, setLanguage] = useState("en");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="m-0">Account</h1>
      <section aria-labelledby="details-heading" className="rounded-[1.75rem] border border-line bg-paper p-6 sm:p-8">
        <h2 id="details-heading" className="mt-0 mb-2 text-[1.5rem] font-extrabold tracking-tight text-forest">
          Personal details
        </h2>
        <dl className="m-0">
          <DetailRow label="Account holder">
            <span id="account-name" className="text-lg font-semibold text-forest">
              Anneli Tamm
            </span>
          </DetailRow>
          <DetailRow label="Email">anneli.tamm@example.com</DetailRow>
          <DetailRow label="Address">
            Vahtrakivi tänav 41-7
            <br />
            10917 Tallinn, Estonia
          </DetailRow>
          <DetailRow label="Customer since">March 2021</DetailRow>
        </dl>
      </section>
      <section aria-labelledby="settings-heading" className="rounded-[1.75rem] border border-line bg-paper p-6 sm:p-8">
        <h2 id="settings-heading" className="mt-0 mb-6 text-[1.5rem] font-extrabold tracking-tight text-forest">
          Settings
        </h2>
        <label htmlFor="language" className="mb-2 block text-sm font-semibold text-ink-soft">
          Language
        </label>
        <select
          id="language"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          className="w-full max-w-xs rounded-full border-2 border-line bg-paper px-5 py-2.5 font-semibold text-forest transition-colors hover:border-bright"
        >
          {LANGUAGES.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
            </option>
          ))}
        </select>
      </section>
    </div>
  );
}
