import { Header } from "./components/Header";
import { usePath } from "./lib/router";
import { CardPage } from "./pages/card/CardPage";
import { TransfersPage } from "./pages/transfers/TransfersPage";
import { AccountPage } from "./pages/account/AccountPage";

function PageFor({ path }: { path: string }) {
  switch (path) {
    case "/transfers":
      return <TransfersPage />;
    case "/account":
      return <AccountPage />;
    default:
      return <CardPage />;
  }
}

export function App() {
  const path = usePath();

  return (
    <div className="min-h-screen bg-mist">
      <Header currentPath={path} />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <PageFor path={path} />
      </main>
      <footer className="mx-auto max-w-5xl px-4 pb-10 text-ink-soft">
        Demo Bank is a demonstration product. No real accounts or money.
      </footer>
    </div>
  );
}
