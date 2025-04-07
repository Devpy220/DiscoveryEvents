import { Switch, Route } from "wouter";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ListingPage from "@/pages/listing-page";
import CreateListingPage from "@/pages/create-listing-page";
import EventDetailsPage from "@/pages/event-details-page";
import CheckoutPage from "@/pages/checkout-page";
import ProfilePage from "@/pages/profile-page";
import HelpPage from "@/pages/help-page";
import PageBackground from "@/components/layout/page-background";
import Navbar from "@/components/layout/navbar-new";

/**
 * Router component that defines the application routes
 * - Public routes: Home, Auth, Listings, Event Details, Help
 * - Protected routes: Create Listing, Checkout, Profile
 */
function Router() {
  return (
    <Switch>
      <Route path="/">
        <HomePage />
      </Route>
      <Route path="/auth">
        <AuthPage />
      </Route>
      <Route path="/events">
        <ListingPage />
      </Route>
      <Route path="/events/:id">
        <EventDetailsPage />
      </Route>
      <Route path="/help">
        <HelpPage />
      </Route>
      <ProtectedRoute path="/create-listing" component={() => <CreateListingPage />} />
      <ProtectedRoute path="/checkout/:ticketId" component={() => <CheckoutPage />} />
      <ProtectedRoute path="/profile" component={() => <ProfilePage />} />
      <Route path="/:rest*">
        <NotFound />
      </Route>
    </Switch>
  );
}

/**
 * Main application component
 */
function App() {
  return (
    <PageBackground imagePath="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80" overlayOpacity="bg-white/70">
      <Navbar />
      <Router />
    </PageBackground>
  );
}

export default App;
