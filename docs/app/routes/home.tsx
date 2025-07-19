import type { Route } from "./+types/home";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { Link } from "react-router";
import HomeContent from "./components";
import { span } from "framer-motion/m";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Turboversion" },
    {
      name: "description",
      content:
        "The smart, automated versioning tool for monorepos and single-package projects",
    },
  ];
}

export default function Home() {
  return (
    <HomeLayout
      nav={{
        title: (
          <span className="flex items-center">
            <img src="/favicon.svg" alt="Turbo Logo" className="w-6 h-6 mr-2" />{" "}
            Turboversion
          </span>
        ),
      }}
    >
      <div className="p-4 flex flex-col items-center justify-center text-center flex-1">
        {/* <h1 className="text-xl font-bold mb-2">Turboversion</h1>
        <p className="text-fd-muted-foreground mb-4">
          The smart, automated versioning tool for monorepos and single-package
          projects
        </p>
        <Link
          className="text-sm bg-fd-primary text-fd-primary-foreground rounded-full font-medium px-4 py-2.5"
          to="/docs"
        >
          Open Docs
        </Link> */}
        <HomeContent />
      </div>
    </HomeLayout>
  );
}
