import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

function PoliciesPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-base-content/50 hover:text-primary mb-6 transition-colors">
          <ArrowLeft size={16} /> Volver al panel
        </Link>

        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-6 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                <FileText size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-base-content">Términos y Condiciones</h1>
                <p className="text-sm text-base-content/50">Última actualización: julio 2026</p>
              </div>
            </div>

            <div className="prose prose-sm max-w-none text-base-content/80 space-y-6">

              <section>
                <h2 className="text-lg font-semibold text-base-content">1. Aceptación de los términos</h2>
                <p>
                  Al acceder y utilizar el sistema CaféFlow, usted acepta estos términos y condiciones en su totalidad.
                  Si no está de acuerdo con alguno de estos términos, no debe utilizar el sistema.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-base-content">2. Descripción del servicio</h2>
                <p>
                  CaféFlow es un sistema de gestión para cafeterías que permite administrar pedidos, mesas,
                  productos, clientes, pagos y un programa de fidelización. El sistema está disponible para
                  personal autorizado (administradores y meseros) y clientes registrados.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-base-content">3. Cuentas de usuario</h2>
                <p>
                  Las cuentas de administrador y mesero son creadas únicamente por un administrador del sistema.
                  Los clientes pueden crear su propia cuenta. Usted es responsable de mantener la confidencialidad
                  de sus credenciales y de todas las actividades realizadas bajo su cuenta.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-base-content">4. Uso aceptable</h2>
                <p>El usuario se compromete a:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Utilizar el sistema únicamente para los fines previstos.</li>
                  <li>No intentar acceder a áreas no autorizadas del sistema.</li>
                  <li>No interferir con el funcionamiento del sistema.</li>
                  <li>Reportar cualquier problema o vulnerabilidad encontrada.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-base-content">5. Programa de fidelización</h2>
                <p>
                  Los puntos de fidelización se otorgan por compras realizadas en la cafetería. Los puntos
                  tienen las siguientes condiciones:
                </p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Se obtiene 1 punto por cada $500 COP en compras.</li>
                  <li>Los descuentos por puntos son: 100 pts = 5%, 300 pts = 10%, 600 pts = 15%.</li>
                  <li>Los puntos no son transferibles ni canjeables por efectivo.</li>
                  <li>La gerencia se reserva el derecho de modificar las condiciones del programa.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-base-content">6. Pagos</h2>
                <p>
                  Los pagos se procesan únicamente en el establecimiento. CaféFlow registra la información
                  de los pagos para fines administrativos. No se almacenan datos de tarjetas de crédito
                  en el sistema.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-base-content">7. Propiedad intelectual</h2>
                <p>
                  Todo el contenido, diseño y código del sistema CaféFlow son propiedad exclusiva del equipo
                  de desarrollo. Queda prohibida su reproducción, distribución o modificación sin autorización.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-base-content">8. Limitación de responsabilidad</h2>
                <p>
                  CaféFlow se proporciona "tal cual" sin garantías de ningún tipo. No nos hacemos responsables
                  por pérdidas o daños derivados del uso del sistema, incluyendo pero no limitado a errores
                  operativos, pérdida de datos o interrupciones del servicio.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-base-content">9. Modificaciones</h2>
                <p>
                  Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones
                  entrarán en vigor inmediatamente después de su publicación en el sistema. El uso continuado
                  del sistema implica la aceptación de los términos modificados.
                </p>

              </section>

              <section>
                <h2 className="text-lg font-semibold text-base-content">10. Contacto</h2>
                <p>
                  Para preguntas sobre estos términos y condiciones, comuníquese con el administrador del
                  sistema a través del correo electrónico{' '}
                  <a href="mailto:angeldavidagudelocuartas13@gmail.com" className="text-primary hover:underline">
                    angeldavidagudelocuartas13@gmail.com
                  </a>.
                </p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PoliciesPage
