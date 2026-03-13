/**
 * WhatsApp AI Chatbot Widget
 * Provides instant answers to common customer queries
 */

// WhatsApp Business Number
const WHATSAPP_NUMBER = '447123456789'; // Replace with actual Seehra Transport WhatsApp number

// AI Knowledge Base - Common Q&A
const chatKnowledgeBase = {
    greeting: {
        patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
        responses: [
            "Hello! 👋 Welcome to Seehra Transport. How can I help you today?",
            "Hi there! 🚚 Thanks for reaching out to Seehra Transport. What can I help you with?",
            "Welcome! 😊 I'm here to help with your delivery needs. What would you like to know?"
        ]
    },
    pricing: {
        patterns: ['price', 'cost', 'how much', 'quote', 'pricing', 'rates', 'charge', 'fee'],
        responses: [
            "Our pricing is transparent and competitive:\n\n📦 Standard Delivery: From £4.99\n⚡ Express Delivery: From £7.99\n🚀 Same-Day: From £12.99\n\nFor an accurate quote, please visit our booking page or share your delivery details!"
        ]
    },
    tracking: {
        patterns: ['track', 'tracking', 'where is my', 'status', 'locate', 'find my parcel', 'track order'],
        responses: [
            "To track your parcel:\n\n1. Visit: sheera-tau.vercel.app/tracking.html\n2. Enter your tracking number\n3. See real-time updates\n\nNeed help? Share your tracking number and I'll assist!"
        ]
    },
    booking: {
        patterns: ['book', 'booking', 'schedule', 'arrange delivery', 'send parcel', 'ship', 'courier'],
        responses: [
            "Ready to book? It's quick and easy! 📝\n\n1. Visit: sheera-tau.vercel.app/booking.html\n2. Fill in collection & delivery details\n3. Choose your service (Standard/Express/Same-Day)\n4. Confirm booking\n\nWould you like me to guide you through the process?"
        ]
    },
    delivery_times: {
        patterns: ['delivery time', 'how long', 'when will', 'delivery speed', 'how fast', 'arrival', 'eta'],
        responses: [
            "Our delivery options:\n\n📦 Standard: 2-3 business days\n⚡ Express: Next business day\n🚀 Same-Day: Within 4-6 hours\n🌙 Overnight: Before 9 AM next day\n\nAll tracked and insured! Need a specific time window? Let me know!"
        ]
    },
    coverage: {
        patterns: ['coverage', 'deliver to', 'service area', 'location', 'where do you', 'regions', 'cities'],
        responses: [
            "We deliver nationwide across the UK! 🇬🇧\n\n✅ All major cities\n✅ Remote areas\n✅ Scottish Highlands\n✅ Northern Ireland\n\nJust enter your postcode when booking for instant confirmation!"
        ]
    },
    business: {
        patterns: ['business', 'b2b', 'corporate', 'company', 'bulk', 'contract', 'multi-drop'],
        responses: [
            "Perfect for businesses! 🏢\n\nWe offer:\n✅ Multi-drop services\n✅ Volume discounts\n✅ Dedicated account manager\n✅ API integration\n✅ Flexible invoicing\n\nContact us for a custom B2B solution: contact@seehra-transport.co.uk"
        ]
    },
    payment: {
        patterns: ['payment', 'pay', 'invoice', 'billing', 'credit card', 'payment methods'],
        responses: [
            "We accept:\n\n💳 Credit/Debit Cards\n💰 PayPal\n📧 Business Invoice (30-day terms)\n🏦 Bank Transfer\n\nAll transactions are secure and encrypted! 🔒"
        ]
    },
    insurance: {
        patterns: ['insurance', 'insured', 'coverage', 'protection', 'damage', 'lost', 'compensation'],
        responses: [
            "All parcels include:\n\n✅ Free insurance up to £100\n✅ Additional coverage available\n✅ Full compensation for verified claims\n✅ 24/7 claims support\n\nYour parcels are in safe hands! 📦🛡️"
        ]
    },
    contact: {
        patterns: ['contact', 'phone', 'email', 'call', 'speak to', 'talk to', 'reach', 'customer service'],
        responses: [
            "Get in touch with us:\n\n📧 Email: info@seehra-transport.co.uk\n📞 Phone: +44 1234 567890\n💬 WhatsApp: Right here!\n🕐 Hours: Mon-Fri 8AM-6PM, Sat 9AM-1PM\n\nHow can we help you today?"
        ]
    },
    driver_job: {
        patterns: ['driver', 'job', 'career', 'hiring', 'employment', 'work', 'recruit', 'vacancy'],
        responses: [
            "Join our team! 🚗\n\nWe're hiring:\n✅ Delivery drivers\n✅ Multi-drop specialists\n✅ Van driver\n\nBenefits:\n💰 Competitive pay\n📅 Flexible schedules\n📱 App-based routing\n\nApply: sheera-tau.vercel.app/recruitment.html"
        ]
    },
    help: {
        patterns: ['help', 'assist', 'support', 'problem', 'issue', 'question'],
        responses: [
            "I'm here to help! 😊\n\nI can assist with:\n• Getting quotes\n• Tracking parcels\n• Booking deliveries\n• Pricing info\n• Service coverage\n• Business solutions\n\nWhat would you like to know?"
        ]
    }
};

class WhatsAppChatWidget {
    constructor() {
        this.isOpen = false;
        this.messageHistory = [];
        this.init();
    }

    init() {
        this.createWidget();
        this.attachEventListeners();
        this.showWelcomeMessage();
    }

    createWidget() {
        const widgetHTML = `
            <!-- WhatsApp Chat Widget -->
            <div class="whatsapp-widget" id="whatsapp-widget">
                <!-- Chat Button -->
                <button class="whatsapp-button" id="whatsapp-button" aria-label="Open WhatsApp Chat">
                    <svg class="whatsapp-icon" viewBox="0 0 24 24" fill="none">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="currentColor"/>
                    </svg>
                    <span class="whatsapp-badge" id="whatsapp-badge">1</span>
                    <svg class="whatsapp-close-icon" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>

                <!-- Chat Box -->
                <div class="whatsapp-chat-box" id="whatsapp-chat-box">
                    <!-- Header -->
                    <div class="whatsapp-header">
                        <div class="whatsapp-header-content">
                            <div class="whatsapp-avatar">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </div>
                            <div class="whatsapp-header-info">
                                <h3>Seehra Transport</h3>
                                <p class="whatsapp-status">
                                    <span class="online-dot"></span>
                                    <span>Online - Typically replies instantly</span>
                                </p>
                            </div>
                        </div>
                        <button class="whatsapp-minimize" id="whatsapp-minimize" aria-label="Close chat">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M19 9l-7 7-7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </div>

                    <!-- Messages -->
                    <div class="whatsapp-messages" id="whatsapp-messages">
                        <!-- Messages will be added here dynamically -->
                    </div>

                    <!-- Quick Replies -->
                    <div class="whatsapp-quick-replies" id="whatsapp-quick-replies">
                        <button class="quick-reply-btn" data-message="Get a quote">💰 Get Quote</button>
                        <button class="quick-reply-btn" data-message="Track my parcel">📦 Track Parcel</button>
                        <button class="quick-reply-btn" data-message="Book a delivery">🚚 Book Now</button>
                        <button class="quick-reply-btn" data-message="Pricing information">💳 Pricing</button>
                    </div>

                    <!-- Input -->
                    <div class="whatsapp-input-wrapper">
                        <button class="whatsapp-emoji-btn" aria-label="Emoji">
                            <svg viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                                <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                        <input 
                            type="text" 
                            class="whatsapp-input" 
                            id="whatsapp-input" 
                            placeholder="Type a message..."
                            autocomplete="off"
                        />
                        <button class="whatsapp-send-btn" id="whatsapp-send-btn" aria-label="Send message">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>

                    <!-- WhatsApp CTA -->
                    <div class="whatsapp-cta">
                        <button class="whatsapp-cta-btn" id="whatsapp-cta-btn">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="currentColor"/>
                            </svg>
                            Continue on WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    attachEventListeners() {
        const button = document.getElementById('whatsapp-button');
        const minimize = document.getElementById('whatsapp-minimize');
        const sendBtn = document.getElementById('whatsapp-send-btn');
        const input = document.getElementById('whatsapp-input');
        const quickReplies = document.querySelectorAll('.quick-reply-btn');
        const ctaBtn = document.getElementById('whatsapp-cta-btn');

        button.addEventListener('click', () => this.toggleChat());
        minimize.addEventListener('click', () => this.closeChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        quickReplies.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const message = e.target.getAttribute('data-message');
                this.sendQuickReply(message);
            });
        });

        ctaBtn.addEventListener('click', () => this.openWhatsApp());
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const widget = document.getElementById('whatsapp-widget');
        const badge = document.getElementById('whatsapp-badge');
        
        widget.classList.toggle('active', this.isOpen);
        
        if (this.isOpen) {
            badge.style.display = 'none';
            badge.classList.remove('show');
            document.getElementById('whatsapp-input').focus();
        }
    }

    closeChat() {
        this.isOpen = false;
        document.getElementById('whatsapp-widget').classList.remove('active');
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.addMessage(
                "Hi! 👋 Welcome to Seehra Transport. I'm here to help with quotes, tracking, bookings, and any questions you have. How can I assist you today?",
                'received'
            );
        }, 1000);
    }

    sendMessage() {
        const input = document.getElementById('whatsapp-input');
        const message = input.value.trim();

        if (!message) return;

        this.addMessage(message, 'sent');
        input.value = '';

        // Generate AI response
        setTimeout(() => {
            const response = this.getAIResponse(message);
            this.addMessage(response, 'received');
        }, 500 + Math.random() * 1000);
    }

    sendQuickReply(message) {
        this.addMessage(message, 'sent');

        setTimeout(() => {
            const response = this.getAIResponse(message);
            this.addMessage(response, 'received');
        }, 500);
    }

    getAIResponse(userMessage) {
        const message = userMessage.toLowerCase();

        // Check knowledge base
        for (const [category, data] of Object.entries(chatKnowledgeBase)) {
            for (const pattern of data.patterns) {
                if (message.includes(pattern)) {
                    const responses = data.responses;
                    return responses[Math.floor(Math.random() * responses.length)];
                }
            }
        }

        // Default response
        return "Thanks for your message! 😊\n\nI can help you with:\n• Quotes & Pricing\n• Parcel Tracking\n• Booking Deliveries\n• Service Info\n• Driver Jobs\n\nFor complex queries, click 'Continue on WhatsApp' below to chat with our team directly!";
    }

    addMessage(text, type) {
        const messagesContainer = document.getElementById('whatsapp-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `whatsapp-message ${type}`;
        
        const time = new Date().toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });

        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text.replace(/\n/g, '<br>')}</p>
                <span class="message-time">${time}</span>
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        this.messageHistory.push({ text, type, time });
    }

    openWhatsApp() {
        const lastMessages = this.messageHistory
            .slice(-3)
            .map(m => m.text)
            .join('\n\n');
        
        const whatsappText = encodeURIComponent(
            `Hello Seehra Transport!\n\n${lastMessages}\n\nI'd like to continue our conversation.`
        );
        
        const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`;
        window.open(whatsappURL, '_blank');
    }
}

// Initialize widget when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new WhatsAppChatWidget();
    });
} else {
    new WhatsAppChatWidget();
}

// Show notification badge after 5 seconds
setTimeout(() => {
    const badge = document.getElementById('whatsapp-badge');
    if (badge && !document.getElementById('whatsapp-widget').classList.contains('active')) {
        badge.style.display = 'flex';
        badge.classList.add('show');
    }
}, 5000);
