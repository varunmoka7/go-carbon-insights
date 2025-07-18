import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Define translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.dashboard": "Dashboard",
      "nav.tracking": "Tracking",
      "nav.scope1": "Scope 1",
      "nav.scope2": "Scope 2", 
      "nav.scope3": "Scope 3",
      "nav.decarbonization": "Decarbonization",
      "nav.profile": "Profile",
      "nav.reports": "Reports & Analytics",
      "nav.methodology": "Methodology",
      "nav.reference": "Reference",
      "nav.community": "Community",
      "nav.about": "About",
      "nav.contact": "Contact",
      
      // Common
      "common.loading": "Loading...",
      "common.error": "Error",
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.delete": "Delete",
      "common.edit": "Edit",
      "common.create": "Create",
      "common.update": "Update",
      
      // Authentication
      "auth.signIn": "Sign In",
      "auth.signUp": "Sign Up",
      "auth.signOut": "Sign Out",
      "auth.email": "Email",
      "auth.password": "Password",
      "auth.forgotPassword": "Forgot Password?",
      "auth.createAccount": "Create Account",
      "auth.alreadyHaveAccount": "Already have an account?",
      "auth.dontHaveAccount": "Don't have an account?",
      
      // Dashboard
      "dashboard.welcome": "Welcome to GoCarbonTracker",
      "dashboard.overview": "Overview",
      "dashboard.emissions": "Emissions",
      "dashboard.targets": "Targets",
      "dashboard.progress": "Progress",
      
      // Emissions
      "emissions.scope1": "Scope 1 Emissions",
      "emissions.scope2": "Scope 2 Emissions", 
      "emissions.scope3": "Scope 3 Emissions",
      "emissions.total": "Total Emissions",
      "emissions.unit": "tCO₂e",
      
      // Industry
      "industry.analysis": "Industry Analysis",
      "industry.taxonomy": "Industry Taxonomy",
      "industry.glossary": "Industry Glossary",
      "industry.plasticPackaging": "Plastic Packaging",
      
      // Accessibility
      "accessibility.panel": "Accessibility Panel",
      "accessibility.highContrast": "High Contrast",
      "accessibility.largeText": "Large Text",
      "accessibility.reducedMotion": "Reduced Motion"
    }
  }
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'en', // Default language
    
    interpolation: {
      escapeValue: false // React already does escaping
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    react: {
      useSuspense: false // Disable suspense to avoid loading issues
    }
  });

export default i18n;