import { useAuthStore } from "../store/useAuthStore";
import { User, Mail, Calendar } from "lucide-react";

const ProfilePage = () => {
    const { authUser } = useAuthStore();

    if (!authUser) return null;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Мій профіль</h1>

                <div className="bg-white rounded-lg shadow-sm p-8">
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                            <User size={32} className="text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                {authUser.name}
                            </h2>
                            <p className="text-gray-600">{authUser.email}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Інформація про користувача
                            </h3>

                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <User size={20} className="text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Ім'я</p>
                                    <p className="font-medium">{authUser.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <Mail size={20} className="text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{authUser.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <Calendar size={20} className="text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Користувач з</p>
                                    <p className="font-medium">
                                        {new Date(authUser.created_at || Date.now()).toLocaleDateString('uk-UA')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Мої бронювання
                            </h3>
                            <div className="bg-gray-50 p-6 rounded-lg text-center">
                                <p className="text-gray-500">
                                    У вас поки немає бронювань
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;