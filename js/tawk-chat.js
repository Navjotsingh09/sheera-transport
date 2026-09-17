/**
 * Tawk.to Live Chat Integration
 * Free live chat widget for customer support
 * 
 * TO GET YOUR OWN TAWK.TO ACCOUNT:
 * 1. Visit https://www.tawk.to/
 * 2. Sign up for FREE
 * 3. Create a property
 * 4. Copy your Property ID and Widget ID from the Admin Panel
 * 5. Replace the IDs below with your actual IDs
 */

// Replace with your Tawk.to Property ID and Widget ID
const TAWK_PROPERTY_ID = '5f9xxxxxxxxxxxxx'; // Example: '5f9a1b2c3d4e5f6g7h8i9j0k'
const TAWK_WIDGET_ID = 'default'; // Example: 'default' or '1a2b3c4d5e6f7g8h'

(function() {
    // Only load if valid IDs are provided
    if (TAWK_PROPERTY_ID === '5f9xxxxxxxxxxxxx') {
        console.warn('⚠️ Tawk.to: Please configure your Property ID in js/tawk-chat.js');
        return;
    }

    var Tawk_API = Tawk_API || {};
    var Tawk_LoadStart = new Date();

    (function() {
        var s1 = document.createElement("script");
        var s0 = document.getElementsByTagName("script")[0];
        s1.async = true;
        s1.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        s0.parentNode.insertBefore(s1, s0);
    })();

    // Customize Tawk.to widget
    Tawk_API.onLoad = function() {
        console.log('✅ Tawk.to Live Chat loaded successfully');
        
        // Set custom colors
        Tawk_API.setAttributes({
            'name': '',
            'email': '',
            'hash': ''
        }, function(error) {});
        
        // Customize bubble position (right, bottom)
        Tawk_API.customStyle = {
            visibility: {
                desktop: {
                    position: 'br',
                    xOffset: 20,
                    yOffset: 100
                },
                mobile: {
                    position: 'br',
                    xOffset: 10,
                    yOffset: 90
                }
            }
        };

        // Auto-greeting after 3 seconds
        setTimeout(function() {
            if (!Tawk_API.isChatMaximized()) {
                Tawk_API.showWidget();
                // Optionally add a notification bubble
                // Tawk_API.addTag('new-visitor');
            }
        }, 3000);
    };

    // Hide widget during chat widget interaction
    Tawk_API.onChatMaximized = function() {
        console.log('💬 Live chat opened');
    };

    Tawk_API.onChatMinimized = function() {
        console.log('💬 Live chat minimized');
    };

    Tawk_API.onChatEnded = function() {
        console.log('💬 Live chat ended');
    };

    // Track user engagement
    Tawk_API.onLoad = function() {
        // Example: Track page visits
        Tawk_API.addEvent('page-visit', {
            page: window.location.pathname,
            title: document.title
        }, function(error) {});
    };
})();

// Alternative: Custom Simple Live Chat Widget (if not using Tawk.to)
class SimpleLiveChat {
    constructor() {
        // Uncomment to use this instead of Tawk.to
        // this.init();
    }

    init() {
        this.createWidget();
    }

    createWidget() {
        const widgetHTML = `
            <div class="simple-live-chat-widget">
                <button class="simple-chat-button" id="simple-chat-btn">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="chat-notification">1</span>
                </button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', widgetHTML);

        document.getElementById('simple-chat-btn').addEventListener('click', () => {
            // Redirect to contact form or open external chat
            window.location.href = '/contact.html';
        });
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SimpleLiveChat };
}

/* 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Get Tawk.to Account:
 *    - Go to https://www.tawk.to/
 *    - Click "Sign Up Free"
 *    - Create your account
 * 
 * 2. Create Property:
 *    - After login, click "Add Site"
 *    - Enter "Seehra Transport" as site name
 *    - Enter "seehratransport.com"
 * 
 * 3. Get Widget Code:
 *    - Go to Administration > Property Settings
 *    - Look for "Direct Chat Link" or "Widget Code"
 *    - Find your Property ID (format: 5f9xxxxxxxxxxxxx)
 *    - Find your Widget ID (usually "default")
 * 
 * 4. Configure This File:
 *    - Replace TAWK_PROPERTY_ID with your actual ID
 *    - Replace TAWK_WIDGET_ID if you have a custom one
 * 
 * 5. Customize Colors (optional):
 *    - In Tawk.to dashboard go to Appearance > Widget
 *    - Set Primary Color: #001060 (Seehra Transport Blue)
 *    - Set Button Color: #FF1500 (Seehra Transport Red)
 * 
 * 6. Add Agents:
 *    - Go to Administration > Agents
 *    - Add your support team members
 *    - Set their availability hours
 * 
 * 7. Configure Triggers (optional):
 *    - Set up automated messages
 *    - Create pre-chat forms
 *    - Add FAQ quick responses
 * 
 * The widget will automatically:
 * - Show online/offline status
 * - Support file uploads
 * - Save chat history
 * - Send email notifications when offline
 * - Work on mobile devices
 * - Support multiple languages
 */
