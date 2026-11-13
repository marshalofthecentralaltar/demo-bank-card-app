import { useState, type ReactNode } from "react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "et", label: "Eesti" },
  { code: "ru", label: "Русский" },
];

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-line py-4 last:border-b-0 sm:grid-cols-[12rem_1fr] sm:gap-6">
      <dt className="font-semibold text-ink-soft">{label}</dt>
      <dd className="m-0 min-w-0 break-words">{children}</dd>
    </div>
  );
}

export function AccountPage() {
  const [language, setLanguage] = useState("en");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="m-0 text-[2rem] font-bold">Account</h1>
      <section aria-labelledby="details-heading" className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 id="details-heading" className="mt-0 mb-2 text-[1.3rem] font-bold">
          Personal details
        </h2>
        <dl className="m-0">
          <DetailRow label="Account holder">
            <span id="account-name" className="font-semibold">Anneli Tamm</span>
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
      <section aria-labelledby="settings-heading" className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 id="settings-heading" className="mt-0 mb-4 text-[1.3rem] font-bold">
          Settings
        </h2>
        <label htmlFor="language" className="mb-2 block font-semibold">
          Language
        </label>
        <select
          id="language"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          className="w-full max-w-xs rounded-md border-2 border-line bg-white px-3 py-2 text-ink"
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
