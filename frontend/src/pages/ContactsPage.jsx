import { MapPin, Phone, Mail, Clock, Car, Bus, Calendar } from "lucide-react";

const ContactsPage = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-gray-900 to-black text-white">
                <div className="max-w-6xl mx-auto px-6 py-20">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold mb-6">Контакти</h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Плануйте свій візит до театру RESONANCE. Ми завжди раді бачити вас!
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Main Contact Info */}
                <div className="grid lg:grid-cols-2 gap-16 mb-20">
                    {/* Contact Details */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Зв'яжіться з нами</h2>
                        
                        <div className="space-y-6">
                            {/* Address */}
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MapPin className="text-red-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Адреса</h3>
                                    <p className="text-gray-600">
                                        вул. Театральна, 15<br />
                                        м. Київ, 01001<br />
                                        Україна
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Phone className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Телефони</h3>
                                    <div className="space-y-1 text-gray-600">
                                        <p>Каса: +38 (044) 234-56-78</p>
                                        <p>Адміністрація: +38 (044) 234-56-79</p>
                                        <p>Груповий відділ: +38 (044) 234-56-80</p>
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Mail className="text-green-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Електронна пошта</h3>
                                    <div className="space-y-1 text-gray-600">
                                        <p>info@resonance-theater.com</p>
                                        <p>tickets@resonance-theater.com</p>
                                        <p>press@resonance-theater.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Working Hours */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Режим роботи</h2>
                        
                        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
                            <div className="flex items-center space-x-3 mb-4">
                                <Clock className="text-red-600" size={24} />
                                <h3 className="text-xl font-semibold text-gray-900">Каса театру</h3>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Понеділок - П'ятниця:</span>
                                    <span className="font-medium">10:00 - 19:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Субота - Неділя:</span>
                                    <span className="font-medium">11:00 - 19:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">У дні вистав:</span>
                                    <span className="font-medium">до 20:00</span>
                                </div>
                            </div>
                            
                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <p className="text-sm text-gray-500">
                                    Каса не працює у святкові дні. Онлайн бронювання доступне 24/7.
                                </p>
                            </div>
                        </div>

                        {/* Additional Services */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Додаткові послуги</h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <Calendar className="text-blue-600" size={20} />
                                    <span>Екскурсії по театру (за записом)</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Bus className="text-green-600" size={20} />
                                    <span>Організація групових відвідувань</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Car className="text-purple-600" size={20} />
                                    <span>Платна парковка (50 грн/година)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How to Get Here */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Як до нас дістатися</h2>
                    
                    <div className="grid md:grid-cols-2 gap-8">

                        {/* Bus */}
                        <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bus className="text-green-600" size={32} />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-3">Громадський транспорт</h3>
                            <div className="space-y-2 text-gray-600">
                                <p>Автобуси: <strong>18, 62, 114</strong></p>
                                <p>Тролейбуси: <strong>16, 18</strong></p>
                                <p>Зупинка "Театр RESONANCE"</p>
                            </div>
                        </div>

                        {/* Car */}
                        <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Car className="text-purple-600" size={32} />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-3">Автомобіль</h3>
                            <div className="space-y-2 text-gray-600">
                                <p>Підземний паркінг</p>
                                <p>100 місць</p>
                                <p>В'їзд з вул. Театральна, 17</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div className="bg-white rounded-lg p-8 shadow-sm">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Часті питання</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Чи можна повернути квитки?</h3>
                            <p className="text-gray-600">
                                Так, квитки можна повернути не пізніше ніж за 48 годин до початку вистави. 
                                Комісія за повернення становить 10%.
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Чи є можливість придбати квитки в день вистави?</h3>
                            <p className="text-gray-600">
                                Якщо є вільні місця, квитки можна придбати в касі театру до початку вистави. 
                                Рекомендуємо бронювати заздалегідь онлайн.
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Чи є знижки для груп?</h3>
                            <p className="text-gray-600">
                                Для груп від 10 осіб діє знижка 15%. Для оформлення групових квитків 
                                зверніться до групового відділу за телефоном +38 (044) 234-56-80.
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Чи можна потрапити в театр з дітьми?</h3>
                            <p className="text-gray-600">
                                Діти допускаються на вистави відповідно до вікових обмежень. 
                                Дітям до 5 років вхід заборонений. Для дітей 6-16 років діють знижки.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactsPage;
