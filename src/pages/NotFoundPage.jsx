import { Link } from "react-router-dom";
import PageSection from "../components/PageSection";
import SeoHead from "../components/SeoHead";

const NotFoundPage = () => (
  <main className="page-shell w-full">
    <SeoHead
      title="404 Page Not Found"
      description="The page you requested on MyHosurProperty could not be found. Explore verified Hosur property listings from the homepage instead."
      noIndex
    />
    <PageSection tag="404 error" title="The page you requested could not be found." className="min-h-[50vh] flex items-center">
      <p className="mx-auto max-w-xl text-center text-sm leading-7 text-slate-600">
        The link may be outdated, or the page may have been moved. Return to the homepage to continue browsing the platform.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link to="/" className="site-button-primary inline-flex rounded-lg px-6 py-3 text-sm font-bold">
          Go to homepage
        </Link>
        <Link to="/listings" className="site-button-secondary inline-flex rounded-lg px-6 py-3 text-sm font-bold">
          Browse listings
        </Link>
      </div>
    </PageSection>
  </main>
);

export default NotFoundPage;
