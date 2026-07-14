import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const ContactSection = () => {
  return (
    <section id="contacto" className="py-20 bg-landing-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-landing-fg mb-4">
            ¿Listo para empezar?
          </h2>
          <p className="text-lg text-landing-muted-fg">
            Contáctanos y descubre cómo CaféFlow puede transformar tu negocio
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-landing-primary mt-1" />
              <div>
                <p className="font-semibold text-landing-fg mb-1">Teléfono</p>
                <p className="text-landing-muted-fg">+57 300 123 4567</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-landing-primary mt-1" />
              <div>
                <p className="font-semibold text-landing-fg mb-1">Email</p>
                <p className="text-landing-muted-fg">contacto@cafeflow.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-landing-primary mt-1" />
              <div>
                <p className="font-semibold text-landing-fg mb-1">Dirección</p>
                <p className="text-landing-muted-fg">
                  Calle 72 #10-34, Bogotá, Colombia
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-landing-primary mt-1" />
              <div>
                <p className="font-semibold text-landing-fg mb-1">Horario</p>
                <p className="text-landing-muted-fg">Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                <p className="text-landing-muted-fg">Soporte técnico disponible 24/7</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden shadow-lg h-[400px]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.6087234567!2d-74.0617!3d4.6533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMzknMTEuOSJOIDc0wrAwMyc0Mi4xIlc!5e0!3m2!1sen!2sco!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de CaféFlow"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
