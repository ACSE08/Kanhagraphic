import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageCircle, Clock, User } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact Kanha Graphic in Vadodara. Call ${SITE.phone}, email ${SITE.email}, or visit our office at ${SITE.address}.`,
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="hidden bg-[#0a1628] py-16 text-white lg:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-white/70 max-w-2xl">
            Have questions? Reach out to {SITE.contactPerson} and our team will
            respond within 24 hours.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0a1628]">Contact Person</h3>
                  <p className="text-gray-600">{SITE.contactPerson}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0a1628]">Phone</h3>
                  <a href={`tel:${SITE.phoneRaw}`} className="text-gray-600 hover:text-orange-600">
                    {SITE.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0a1628]">Email</h3>
                  <a href={`mailto:${SITE.email}`} className="text-gray-600 hover:text-orange-600 break-all">
                    {SITE.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0a1628]">WhatsApp</h3>
                  <a
                    href={`https://wa.me/${SITE.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700"
                  >
                    Chat with us
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0a1628]">Office Address</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{SITE.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0a1628]">Business Hours</h3>
                  <p className="text-gray-600 text-sm">Mon - Sat: 10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 h-64">
              <iframe
                title="Kanha Graphic Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.0!2d73.18!3d22.34!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDIwJzI0LjAiTiA3M8KwMTAnNDguMCJF!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-gray-100">
              <h2 className="text-xl font-bold text-[#0a1628] mb-6">Send us a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
