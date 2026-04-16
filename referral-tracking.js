/**
 * Agentic SuperHero - Referral Tracking Script
 * Handles referral link tracking, URL parameters, and conversion events
 */

(function() {
    'use strict';

    // Get referral ID from URL parameters
    function getReferralId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('ref') || null;
    }

    // Store referral ID in localStorage
    function storeReferralId(refId) {
        if (refId) {
            localStorage.setItem('superhero_referral_id', refId);
            localStorage.setItem('superhero_referral_timestamp', new Date().toISOString());
        }
    }

    // Get stored referral ID
    function getStoredReferralId() {
        return localStorage.getItem('superhero_referral_id');
    }

    // Track page view with referral info
    function trackPageView() {
        const refId = getReferralId() || getStoredReferralId();

        if (window.gtag && refId) {
            gtag('event', 'page_view', {
                'referral_source': refId
            });
        }
    }

    // Track form interaction
    function trackFormInteraction() {
        const form = document.getElementById('lead-form');
        if (form) {
            form.addEventListener('focus', function() {
                if (window.gtag) {
                    gtag('event', 'form_start', {
                        'referral_id': getStoredReferralId()
                    });
                }
            }, true);
        }
    }

    // Track button clicks
    function trackButtonClicks() {
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-cta') || e.target.classList.contains('submit-btn')) {
                if (window.gtag) {
                    gtag('event', 'cta_click', {
                        'button_text': e.target.textContent,
                        'referral_id': getStoredReferralId()
                    });
                }
            }
        });
    }

    // Initialize referral tracking
    function init() {
        const refId = getReferralId();

        // Store referral ID if present
        if (refId) {
            storeReferralId(refId);
        }

        // Track page view
        trackPageView();

        // Track interactions
        trackFormInteraction();
        trackButtonClicks();

        // Log to console in development
        if (refId) {
            console.log('Referral tracked:', refId);
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose public API
    window.SuperHeroTracking = {
        getReferralId: getReferralId,
        getStoredReferralId: getStoredReferralId,
        storeReferralId: storeReferralId
    };
})();
