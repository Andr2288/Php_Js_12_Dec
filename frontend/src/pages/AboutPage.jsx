import { Calendar, Users, Award, Clock, MapPin, Heart } from "lucide-react";

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-gray-900 to-black text-white">
                <div className="max-w-6xl mx-auto px-6 py-20">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold mb-6">
                            Про театр <span className="text-red-500">RESONANCE</span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Сучасний театр, що поєднує класичні традиції з інноваційними підходами до сценічного мистецтва. 
                            Наша місія - створювати незабутні театральні враження, що знаходять відгук у серцях глядачів.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Main Content */}
                <div className="grid lg:grid-cols-2 gap-16 mb-20">
                    {/* History Section */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Наша історія</h2>
                        <div className="space-y-4 text-gray-700 leading-relaxed">
                            <p>
                                Театр RESONANCE було засновано у 1995 році групою ентузіастів, які мріяли створити 
                                унікальний простір для сучасного театрального мистецтва. Назва "RESONANCE" відображає 
                                нашу філософію - створювати вистави, що резонують з душею кожного глядача.
                            </p>
                            <p>
                                За майже три десятиліття ми стали одним з провідних театрів країни, представивши 
                                понад 200 прем'єр та виховавши цілу плеяду талановитих акторів, режисерів та 
                                театральних діячів.
                            </p>
                            <p>
                                Наш репертуар охоплює широкий спектр жанрів - від класичної драми до сучасних 
                                експериментальних постановок, від інтимних камерних вистав до масштабних мюзиклів.
                            </p>
                        </div>
                    </div>

                    {/* Mission Section */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Наша місія</h2>
                        <div className="bg-white rounded-lg p-8 shadow-sm">
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <Heart className="text-red-500 mt-1" size={24} />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Емоційний зв'язок</h3>
                                        <p className="text-gray-600">
                                            Створювати вистави, які торкаються найглибших струн людської душі 
                                            та залишають незабутні враження.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <Users className="text-blue-500 mt-1" size={24} />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Спільнота</h3>
                                        <p className="text-gray-600">
                                            Об'єднувати людей через мистецтво, створювати простір для діалогу 
                                            та взаєморозуміння.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <Award className="text-yellow-500 mt-1" size={24} />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Досконалість</h3>
                                        <p className="text-gray-600">
                                            Прагнути до найвищих стандартів у всіх аспектах театрального виробництва.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-white rounded-lg p-8 shadow-sm mb-20">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Наші досягнення</h2>
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-red-600 mb-2">29</div>
                            <div className="text-gray-600">Років досвіду</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-red-600 mb-2">200+</div>
                            <div className="text-gray-600">Прем'єр</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-red-600 mb-2">500K+</div>
                            <div className="text-gray-600">Глядачів</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-red-600 mb-2">15</div>
                            <div className="text-gray-600">Театральних нагород</div>
                        </div>
                    </div>
                </div>

                {/* Theatre Spaces */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Наші сцени</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Main Stage */}
                        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                            <div className="h-48 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                                <div className="text-white text-6xl">🎭</div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Основна сцена</h3>
                                <div className="space-y-2 text-gray-600 mb-4">
                                    <div className="flex items-center space-x-2">
                                        <Users size={16} />
                                        <span>600 місць</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <MapPin size={16} />
                                        <span>Італійська сцена</span>
                                    </div>
                                </div>
                                <p className="text-gray-600">
                                    Класична італійська сцена з оркестровою ямою, призначена для великих 
                                    драматичних постановок та мюзиклів.
                                </p>
                            </div>
                        </div>

                        {/* Chamber Stage */}
                        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                            <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                                <div className="text-white text-6xl">🎪</div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Камерна сцена</h3>
                                <div className="space-y-2 text-gray-600 mb-4">
                                    <div className="flex items-center space-x-2">
                                        <Users size={16} />
                                        <span>80 місць</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <MapPin size={16} />
                                        <span>Арена сцена</span>
                                    </div>
                                </div>
                                <p className="text-gray-600">
                                    Інтимний простір для експериментальних постановок та камерних вистав, 
                                    що створює особливий зв'язок між акторами та глядачами.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="bg-white rounded-lg p-8 shadow-sm">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Наша команда</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="text-red-600" size={32} />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">45+ Акторів</h3>
                            <p className="text-gray-600">
                                Талановиті артисти різних поколінь, які створюють магію на сцені
                            </p>
                        </div>
                        
                        <div>
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="text-blue-600" size={32} />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">12 Режисерів</h3>
                            <p className="text-gray-600">
                                Досвідчені постановники з унікальним баченням та творчим підходом
                            </p>
                        </div>
                        
                        <div>
                            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="text-yellow-600" size={32} />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">30+ Технічних спеціалістів</h3>
                            <p className="text-gray-600">
                                Професіонали, які забезпечують технічну досконалість кожної вистави
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
